import { expect, jest, test } from '@jest/globals'
import { Router } from '../main.js'
import { createServer, IncomingMessage, request as httpRequest, ServerResponse } from 'http'

let router = new Router

const server = createServer((request, response) => {
	router.requestListener(request, response)
})

const port = 420
let localRequestCount = 0

const sendRequest = (hostname, port, path, method, onend, onerror) => {
	if (hostname === '127.0.0.1') localRequestCount++
	
	const request = httpRequest({
		hostname,
		port,
		path,
		method
	}, (response) => {
		response.setEncoding('utf8')
		
		response.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`)
		})
		
		response.on('end', () => {
			if (typeof onend === 'function') onend()
			
			if (hostname === '127.0.0.1') {
				localRequestCount--
				if (localRequestCount === 0) server.close()
			}
		})
	})
	
	request.on('error', error => {
		// console.error(`problem with request: ${error.message}`)
		if (typeof onerror === 'function') onerror()
		
		if (hostname === '127.0.0.1') {
			localRequestCount--
			if (localRequestCount === 0) server.close()
		}
	})
	
	request.end()
}

server.listen(port)

test('should apply the middleware only if it matches the given route', () => {
	let i = 0
	
	router.connect('/test1', (request, response, next) => {
		i++
		
		next()
	})
	
	sendRequest('127.0.0.1', port, '/', 'CONNECT', () => {
		expect(i).toEqual(0)
	})
})

test('should handle a large middleware queue', () => {
	let count = 0
	const max = 10000
	const middleware = (request, response, next) => {
		count++
		next()
	}
	
	for (let i = 0; i < max; i++) {
		router.use('/test2', middleware)
	}

	sendRequest('127.0.0.1', port, '/test2', 'CONNECT', () => {
		expect(count).toEqual(max)
	})
})

test('should process middlewares added with .use() 1st independent of execution order', () => {
	let used = false
	let first = false
	
	router.connect('/test3', (request, response, next) => {
		first = used === true ? true : false
		
		next()
	})
	
	router.use('/test3', (request, response, next) => {
		used = true
		
		next()
	})
	
	sendRequest('127.0.0.1', port, '/test3', 'CONNECT', () => {
		expect(first).toEqual(true)
	})
})

test('should process middlewares added with .error() last independent of execution order', () => {
	let arr = []
	
	router.error('/test4', (error, request, response, next) => {
		arr.push(3)
		
		next()
	})
	
	router.connect('/test4', (request, response, next) => {
		arr.push(2)
		
		next(true)
	})
	
	router.use('/test4', (request, response, next) => {
		arr.push(1)
		
		next()
	})
	
	sendRequest('127.0.0.1', port, '/test4', 'CONNECT', () => {
		expect(arr[0]).toEqual(1)
		expect(arr[1]).toEqual(2)
		expect(arr[2]).toEqual(3)
	})
})