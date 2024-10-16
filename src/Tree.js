'use strict'

import { IncomingMessage, ServerResponse } from 'http'

// http methods
const methods = ['USE', 'CONNECT', 'DELETE', 'ERROR', 'GET', 'HEAD', 'OPT', 'PATCH', 'POST', 'PUT', 'TRACE']

/**
 * Nodes associate a route with middlewares organized by method
 *
 * @typedef {Object} Node
 * @property {Node} parent
 * @property {Node[]} children
 * @property {RegExp} route
 * @property {function[]} USE
 * @property {function[]} ERROR
 */

/**
 * @callback METHOD
 * @param {RegExp[]} routes
 * @param {function[]} middlewares
 */

/**
 * @param {(null | Node)} parent
 * @param {RegExp} route
 * @returns {Node}
 * @private
 */
const newNode = (parent, route) => {
	/** @type {Object<string, any>}*/
	const node = {
		parent,
		route,
		children: []
	}
	
	for (let i = methods.length - 1; i > -1; i--) {
		node[methods[i]] = []
	}
	
	return /** @type {Node} */ (node)
}

/**
 * @class Router
 * @public
 *
 */
export class Router {
	root = newNode(null, /./) // root node
	
	/**
	 * @method use
	 * @type {METHOD}
	 * @public
	 */
	use(route, ...middlewares) {}
	
	
	/**
	 * @method error
	 * @type {METHOD}
	 * @public
	 */
	error(route, ...middlewares) {}
	
	/**
	 * @method get
	 * @type {METHOD}
	 * @public
	 */
	get(route, ...middlewares) {}
	
	/**
	 *
	 * @param {import('http').IncomingMessage} request
	 * @param {import('http').ServerResponse} response
	 * @param {function} done
	 * @public
	 */
	requestListener(request, response, done) {
		if (!(request instanceof IncomingMessage))
			throw new TypeError(`Argument 0 ${request} must be an instance of IncomingMessage.`)
		
		if (!(response instanceof ServerResponse))
			throw new TypeError(`Argument 1 ${response} must be an instance of ServerResponse.`)
		
		if (done !== void(0) && typeof done !== 'function')
			throw new TypeError(`Argument 2 ${done} must be a function.`)
		
		const pathname = request.url !== void(0) ? request.url : '/'
		const middlewares = []
		const methodwares = []
		const errorwares = []
		let node = this.root
		let error = void(0)
		let nextCalled = true
		let i = 0
		
		/**
		 * @param {*} _error
		 */
		const next = (_error) => {
			nextCalled = true
			error = _error
		}
		
		let match = true
		
		while (match === true) {
			match = false
			middlewares.push(...node['USE'])
			if (request.method !== void(0)) methodwares.push(...(/** @type {Object<string, any>}*/ (node))[request.method])
			errorwares.unshift(...node['ERROR'])
			
			for (i = 0; i < node.children.length; i++) {
				if (node.children[i].route.test(pathname)) { // skip child === breadth first if pathname doesn't match route
					node = node.children[i]
					match = true
					
					// 1st match only per layer, routes on a layer effectively filter the next eg. use(['a'], fn); use(['(?:)'], fn2) === use(['a'], fn); use(['[^a]'], fn2)
					break
				}
			}
		}
		
		middlewares.push(...methodwares)
		
		for (i = 0; nextCalled && i < middlewares.length; i++) {
			nextCalled = false
			
			try { middlewares[i](request, response, next) } catch (_error) {
				next(_error)
				
				break
			}
		}
		
		if (response.headersSent === false) next(404)
			
		if (error) {
			for (i = 0; nextCalled && i < errorwares.length; i++) {
				nextCalled = false
				
				try { errorwares[i](error, request, response, next) } catch (_error) {
					console.error(_error)
					
					process.exit()
				}
			}
		}
		
		if (done !== void(0)) done()
	}
}

for (let i = methods.length - 1; i > -1; i--) {
	/** @type {Object<string, any>}*/ (Router).prototype[methods[i].toLowerCase()] =
	/**
	 * @function METHOD
	 * 
	 * Add middlewares to the router tree. Each route corresponds to a node, each a child of the
	 * previous one. The request must match each route to execute the given middlewares.
	 * METHOD may be "USE", "ERROR", or any HTTP method. USE middlewares are used for all requests and
	 * are sorted before any other method. ERROR middlewares are used after an error occurs in
	 * another middleware. Error handling starts from the current route up to the root.
	 * 
	 * @type {METHOD}
	 * @public
	 */
	function(routes, ...middlewares) {
		let j = 1
		
		if (!(routes instanceof Array)) {
			middlewares.unshift(routes) // assume its a middleware for now
			j = 0 // no routes
		}
		
		for (let k = 0; k < middlewares.length; k++) {
			if (typeof middlewares[k] !== 'function') {
				throw new TypeError(`Argument ${k + j} ${middlewares[k]} must be a function.`)
			}
		}
		
		let node = this.root // start at root
		
		// iterate routes if they exist
		if (j === 1) for (let k = 0; k < routes.length; k++) {
			if (!(routes[k] instanceof RegExp))
				throw new TypeError(`Argument 0 ${routes} must be an Array of RegExp.`)
			
			let j = 0 // children index
			
			// find the child with the route at the current layer
			for (j; j < node.children.length; j++) {
				if (node.children[j].route.toString() === routes[k].toString()) {
					node = node.children[j] // next layer
					j = -1
					
					break
				}
			}
			
			// create child if it doesn't exist
			if (j > -1) {
				const childNode = newNode(node, routes[k])
				
				node.children.push(childNode)
				node = childNode // next layer
			}
		}
		
		// add middlewares to the correct node
		for (let k = 0; k < middlewares.length; k++) {
			node[methods[i]].push(middlewares[k])
		}
	}
}