import {expect, jest, test} from '@jest/globals'
import { Router } from '../main.js'
import { createServer, IncomingMessage, request as httpRequest, ServerResponse } from 'http'

let router = new Router

const server = createServer((request, response) => {
	router.requestListener(request, response)
})

const port = 420
let testCount = 0

server.listen(port)

test('should not stack overflow with a large sync stack', () => {
	testCount++
	
	let finish = 0
	const max = 10000
	const middleware = (request, response, next) => {
		next()
	}
	
	router.use('test1', (request, response, next) => {
		finish++
		
		next()
	})
	
	for (let i = 0; i < max; i++) {
		router.use('test1', middleware)
	}
	
	router.use('test1', (request, response, next) => {
		finish++
		
		next()
	})

	const testRequest = httpRequest({
		hostname: '127.0.0.1',
		port,
		path: '/test1',
		method: 'GET'
	}, (response) => {
		response.setEncoding('utf8')
		
		response.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`)
		})
		
		response.on('end', () => {
			expect(finish).toEqual(2)
			
			testCount--
			if (testCount === 0) server.close()
		})
	})
	
	testRequest.on('error', error => {
		console.error(`problem with request: ${error.message}`)
		
		testCount--
		if (testCount === 0) server.close()
	})
	
	testRequest.end()
})

test('should process middlewares added with .use() 1st independent of execution order', () => {
	testCount++
	
	let used = false
	let first = false
	
	router.get('test2', (request, response, next) => {
		first = used === true ? true : false
		
		next()
	})
	
	router.use('test2', (request, response, next) => {
		used = true
		
		next()
	})
	
	const testRequest = httpRequest({
		hostname: '127.0.0.1',
		port,
		path: '/test2',
		method: 'GET'
	}, (response) => {
		response.setEncoding('utf8')
		
		response.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`)
		})
		
		response.on('end', () => {
			expect(first).toEqual(true)
			
			testCount--
			if (testCount === 0) server.close()
		})
	})
	
	testRequest.on('error', error => {
		console.error(`problem with request: ${error.message}`)
		
		testCount--
		if (testCount === 0) server.close()
	})
	
	testRequest.end()
})

test('should process middlewares added with .error() last independent of execution order', () => {
	testCount++
	
	let arr = []
	
	router.error('test2', (error, request, response, next) => {
		arr.push(3)
		
		next()
	})
	
	router.get('test2', (request, response, next) => {
		arr.push(2)
		
		next(true)
	})
	
	router.use('test2', (request, response, next) => {
		arr.push(1)
		
		next()
	})
	
	const testRequest = httpRequest({
		hostname: '127.0.0.1',
		port,
		path: '/test2',
		method: 'GET'
	}, (response) => {
		response.setEncoding('utf8')
		
		response.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`)
		})
		
		response.on('end', () => {
			expect(arr[0]).toEqual(1)
			expect(arr[1]).toEqual(2)
			expect(arr[2]).toEqual(3)
			
			testCount--
			if (testCount === 0) server.close()
		})
	})
	
	testRequest.on('error', error => {
		console.error(`problem with request: ${error.message}`)
		
		testCount--
		if (testCount === 0) server.close()
	})
	
	testRequest.end()
})