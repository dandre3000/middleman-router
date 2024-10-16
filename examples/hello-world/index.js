'use strict'

import { IncomingMessage, ServerResponse } from 'http'
import https from 'https'
import { readFileSync } from 'fs'
import { getDefaultHighWaterMark } from 'stream'
import { resolve } from 'path'
import { Router } from '../../main.js'
import sirv from 'sirv'

const rootDirectory = resolve(import.meta.dirname, '../')

const options = {
	connectionsCheckingInterval: 30000,
	headersTimeout: 60000,
	highWaterMark: getDefaultHighWaterMark(false),
	insecureHTTPParser: false,
	IncomingMessage: IncomingMessage,
	joinDuplicateHeaders: false,
	keepAlive: false,
	keepAliveInitialDelay: 0,
	keepAliveTimeout: 5000,
	maxHeaderSize: 16384,
	noDelay: false,
	requestTimeout: 300000,
	requireHostHeader: true,
	ServerResponse: ServerResponse,
	uniqueHeaders: [],
	// https
	key: readFileSync(`${rootDirectory}/server.key`),
	cert: readFileSync(`${rootDirectory}/server.crt`)
}

const app = new Router

const requestListener = (request, response) => {
	app.requestListener(request, response)
}

// const server = http.createServer(options, requestListener).listen('80', () => {
	// console.log('server listening on port 80')
// })


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // allow self-signed certificate for development

const server = https.createServer(options, requestListener).listen('443', () => {
	console.log('Server listening on port 443.', `Serving static files from ${rootDirectory}.\n`)
})

const sendHomepage = (request, response, next) => {
	response.writeHead(200, {'Content-Type': 'text/html'})
	response.end(`<h1>YOOOOOOOOOOOOOO</h1>`)
}

app.use('/pass-error', (request, response, next) => {
	next('insert error here')
})

app.use('/throw-error', (request, response, next) => {
	throw new Error
})

app.use('/catastrophic-error', (request, response, next) => {
	next('insert error here')
})

app.error('/catastrophic-error', (error, request, response, next) => {
	throw new Error
})

app.use((request, response, next) => {
	console.log(request.url)
	next()
})

app.get('/favicon.ico', (request, response) => {
	response.writeHead(302, {
		'Content-Type': 'image/bmp',
		'Location': `${request.connection.encrypted ? 'https' : 'http'}://127.0.0.1/public/img.bmp`
	})
	
	response.end()
})

app.get(/^\/$/, sendHomepage)
app.get(/^\/public/, sirv(rootDirectory))