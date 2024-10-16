const elementRequestMap = new Map

const downgradeElement = element => {
	const xhr = elementRequestMap.get(element)
	
	if (xhr !== undefined) xhr.destructor()
}

const updateElement = element => {
	let url
	let method = 'GET'
	let target
	
	// <a>
	if (element instanceof HTMLAnchorElement) {
		// href must be defined
		url = element.getAttribute('href')
		if (url === null) {
			downgradeElement(element)
			
			return
		}
		
		// target must equal '_self'
		target = element.getAttribute('target')
		if (target !== null && target !== '_self') {
			downgradeElement(element)
			
			return
		}
	// <button>, <input type='submit'> or <input type='image'>
	} else if (element instanceof HTMLButtonElement || (element instanceof HTMLInputElement && (element.type === 'submit' || element.type === 'image'))) {
		// element must be inside a form or the form attribute of the element must reference a form
		if (element.form === undefined) return
		
		// formtarget must equal '_self'
		target = element.getAttribute('formtarget')
		if (target !== null && target !== '_self') {
			downgradeElement(element)
			
			return
		}
		
		method = element.getAttribute('formmethod')
		if (method === null) {
			method = 'GET'
		} else {
			method = method.toUpperCase()
		}
		
		url = element.getAttribute('formaction')
		if (url === null) url = ''
	} else {
		return
	}
	
	// data-render-position must be defined
	const position = element.getAttribute('data-render-position')
	if (position === null) {
		downgradeElement(element)
		
		return
	}
	
	const selector = element.getAttribute('data-render-selector')
	
	const headerString = element.getAttribute('data-headers')
	let headers
	
	if (headerString !== null) {
		try {
		
		headers = new Headers(JSON.parse(headerString))
		
		} catch (error) {
			console.error(error)
		}
	}
	
	// update XHR if one exists for the element
	const xhr = elementRequestMap.get(element)
	if (xhr !== undefined) {
		xhr.url = url
		xhr.method = method
		xhr.headers = headers
		xhr.element = element
		xhr.position = position
		xhr.selector = selector
		
		return
	}
	
	// else create a XHR and map it to the element
	elementRequestMap.set(element, new XHR({
		url,
		method,
		headers
	}, {
		element,
		position,
		selector
	}))
}

const fetchListener = event => {
	const element = event.currentTarget
	let xhr = elementRequestMap.get(element)
	
	event.preventDefault()
	xhr.fetch()
}

class XHR extends XMLHttpRequest {
	constructor(requestOptions, renderOptions) {
		super()
		
		this.onabort = this.abortListener
		this.onerror = this.errorListener
		this.onload = this.loadListener
		// this.onloadend = this.loadendListener
		// this.onloadstart = this.loadstartListener
		// this.onprogress = this.progressListener
		this.onreadystatechange = this.readystatechangeListener
		// this.ontimeout = this.timeoutListener
		this.url = requestOptions.url
		this.method = requestOptions.method
		this.headers = requestOptions.headers
		this.element = renderOptions.element
		this.position = renderOptions.position
		this.selector = renderOptions.selector
		
		this.elementAbortController = new AbortController
		
		this.element.addEventListener('click', fetchListener, {
			capture: false,
			once: false,
			passive: false,
			signal: this.elementAbortController.signal
		})
	}
	
	fetch() {
		this.open(this.method, this.url, true)
		
		if (this.headers !== undefined) {
			try {
			
			for (const header of new Headers(this.headers)) {
				this.setRequestHeader(header[0], header[1])
			}
			
			} catch (error) {
				console.error(error)
			}
		}
		
		this.send()
	}
	
	render() {
		let elements = null
		
		try { elements = document.querySelectorAll(this.selector) } catch (error) {
			console.error(error)
		}
		
		if (elements.length === 0) {
			console.warn(`No element matches the data-selector "${this.selector}"`)
			
			elements = [this.element]
		}
		
		let response = this.response
		
		if (this.status >= 400 && this.status <= 599) {
			response = `${this.requestMethod} ${this.responseURL} ${this.status} (${this.statusText})`
		} else {
			switch (this.responseContentType.media) {
				case 'image':
					const img = document.createElement('img')
					
					img.src = URL.createObjectURL(this.response)
					response = img.outerHTML
					
					break
				case 'audio':
					const audio = document.createElement('audio')
					
					audio.src = URL.createObjectURL(this.response)
					audio.setAttribute('controls', '')
					response = audio.outerHTML
					
					break
				case 'video':
					const video = document.createElement('video')
					
					video.src = URL.createObjectURL(this.response)
					video.setAttribute('controls', '')
					response = video.outerHTML
					
					break
				case 'text':
				default:
					if (this.responseContentType.extension !== 'html') {
						response = `<pre>${this.response}</pre>`
					}
					
					break
			}
		}
		
		switch (this.position) {
			case 'outerHTML':
				for (let i = 0; i < elements.length; i++) {
					elements[i].outerHTML = response
				}
				
				break
			case 'innerHTML':
				for (let i = 0; i < elements.length; i++) {
					elements[i].innerHTML = response
				}
				
				break
			case 'beforebegin':
			case 'afterbegin':
			case 'beforeend':
			case 'afterend':
				for (let i = 0; i < elements.length; i++) {
					elements[i].insertAdjacentHTML(position, response)
				}
				break
			default:
				for (let i = 0; i < elements.length; i++) {
					elements[i].innerHTML = response
				}
				
				break
		}
	}
	
	loadListener(event) {
		this.render()
	}
	
	readystatechangeListener(event) {
		if (this.readyState === this.HEADERS_RECEIVED) {
			const contentType = this.getResponseHeader('Content-Type')
			
			if (contentType !== null) {
				const split = contentType.split(';')[0].split('/')
				
				this.responseContentType = {
					extension: split[1],
					media: split[0]
				}
				
				if (split[0] !== 'text') this.responseType = 'blob'
			}
		}
	}
	
	errorListener(event) {
		const { lengthComputable, loaded, total, type } = event
		
		this.statusText = 'An error occured'
		this.render()
	}

	abortListener(event) {
		this.statusText = 'Aborted'
		this.render()
	}
	
	// loadendListener(event) {
		// const { lengthComputable, loaded, total, type } = event
	// }
	
	// loadstartListener(event) {
		// const { lengthComputable, loaded, total, type } = event
	// }

	// timeoutListener(event) {
		// const { lengthComputable, loaded, total, type } = event
	// }
	
	destructor() {
		this.abort()
		this.elementAbortController.abort()
		elementRequestMap.delete(this.element)
	}
}

/*****************************************************************/

document.addEventListener('DOMContentLoaded', event => {
	let element
	const queue = [document.body]
	
	while (queue.length > 0) {
		element = queue.shift()
		
		updateElement(element)
		
		for (let i = 0; i < element.children.length; i++) {
			queue.push(element.children[i])
		}
	}
})

new MutationObserver((records, observer) => {
	const updateSet = new Set()
	const attributes = ['href', 'action', 'method', 'target', 'formaction', 'formmethod', 'formtarget', 'data-headers', 'data-render-position', 'data-render-selector']
	
	for (let i = 0; i < records.length; i++) {
		if (records[i].addedNodes.length > 0) {
			let element
			const queue = [records[i].target]
			
			while (queue.length > 0) {
				element = queue.shift()
				
				updateSet.add(element)
				
				for (let i = 0; i < element.children.length; i++) {
					queue.push(element.children[i])
				}
			}
		}
		
		if (attributes.includes(records[i].attributeName)) updateSet.add(records[i].target)
	}
	
	const elements = [...updateSet.keys()]
	
	for (let i = 0; i < elements.length; i++) {
		updateElement(elements[i])
	}
}).observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true,
})