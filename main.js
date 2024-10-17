'use strict'

import { IncomingMessage, ServerResponse } from 'http'

/**
 * @callback insertMiddleware
 * 
 * Add middlewares to the router list. The request must match each route to execute the given middlewares.
 * Method may be "use", "error", or any http method in all lower case. "use" middlewares are used for all requests and
 * are sorted before any other method. "error" middlewares are used after an error occurs in
 * another middleware.
 * 
 * @param {(string|RegExp)} route
 * @param {function[]} middlewares
 * @public
 */

// http methods
const METHODS = ['USE', 'CONNECT', 'DELETE', 'ERROR', 'GET', 'HEAD', 'OPT', 'PATCH', 'POST', 'PUT', 'TRACE']

/**
 * @class Router
 * @public
 */
export class Router {
	/** @type {Object<string, { route: (string|RegExp), middleware: function }[]>} */
	#routes = {
		USE: [],
		ERROR: [],
		GET: [],
		POST: []
		// etc. for each http METHOD... filled by constructor.
	}
	
	/**
	 * @method use
	 * @type {insertMiddleware}
	 */
	use() {}
	
	/**
	 * @method error
	 * @type {insertMiddleware}
	 */
	error() {}
	
	/**
	 * @method get
	 * @type {insertMiddleware}
	 */
	get() {}
	
	/**
	 * @method post
	 * @type {insertMiddleware}
	 */
	post() {}
	
	// etc... filled by addMethod
	
	/**
	 * @method addMethod
	 * 
	 * Call all matching middlewares for a request in the appropriate order
	 * using for loops instead of recursion.
	 * 
	 * @param {string} method
	 * @public
	 */
	static addMethod(method) {
		/** @type {insertMiddleware} */
		function insertMiddleware(route, ...middlewares) {
			let j = 1
			
			if (typeof route !== 'string' && !(route instanceof RegExp)) {
				middlewares.unshift(route) // Assume its a middleware for now.
				j = 0 // no route
				route = '/'
			}
			
			// Add the route and each middleware to the array associated with the given http method.
			for (let k = 0; k < middlewares.length; k++) {
				if (typeof middlewares[k] !== 'function') {
					throw new TypeError(`Argument ${k + j} ${middlewares[k]} must be a function.`)
				}
				
				this.#routes[method].push({ route, middleware: middlewares[k]})
			}
		}
		
		/** @type {Object<string, *>} */ (Router.prototype)[method.toLowerCase()] = insertMiddleware
	}
	
	constructor() {
		for (let i = METHODS.length - 1; i > -1; i--) {
			 this.#routes[METHODS[i]] = []
		}
	}
	
	/**
	 * @method requestListener
	 * 
	 * Call all matching middlewares for a request in the appropriate order
	 * using for loops instead of recursion.
	 * 
	 * @param {import('http').IncomingMessage} request
	 * @param {import('http').ServerResponse} response
	 * @param {function} done
	 * @public
	 */
	requestListener(request, response, done) {
		// GET, POST etc. middlewares go after USE
		const middlewares = this.#routes.USE.concat(this.#routes[request.method])
		/** @type {*} */
		let error = undefined
		let nextCalled = true
		const pathname = request.url === undefined ? '/' : request.url
		
		/**
		 * @param {*} _error
		 */
		const next = (_error) => {
			nextCalled = true
			error = _error
		}
		
		// non ERROR middlewares
		for (let i = 0; error === undefined && nextCalled === true && i < middlewares.length; i++) {
			nextCalled = false
			
			// String.search works with a string or RegExp.
			if (pathname.search(middlewares[i].route) === -1) {
				nextCalled = true
				
				continue
			}
			
			try { middlewares[i].middleware(request, response, next) } catch (_error) {
				error = _error
				
				break
			}
		}
		
		// ERROR middlewares go last
		nextCalled = true
	
		for (let i = 0; error !== undefined && nextCalled === true && i < this.#routes.ERROR.length; i++) {
			nextCalled = false
			
			// String.search works with a string or RegExp.
			if (pathname.search(this.#routes.ERROR[i].route) === -1) {
				nextCalled = true
				
				continue
			}
			
			try { this.#routes.ERROR[i].middleware(error, request, response, next) } catch (_error) {
				console.error(_error)
				
				error = _error
			}
		}
		
		// If nothing has been sent yet call done if it exists, send 500 if an error has not been handled, else send 404.
		if (response.headersSent === false) {
			if (typeof done === 'function') {
				done(error)
			} else {
				// my finalhandler
				error === undefined ? response.writeHead(404) : response.writeHead(500)
				
				response.end()
			}
		}
	}
}

// complete the prototype
for (let i = METHODS.length - 1; i > -1; i--) {
	Router.addMethod(METHODS[i])
}