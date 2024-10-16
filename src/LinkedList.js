export class LinkedList {
	#first = null
	#last = null
	#current = null
	#map = new Map
	
	add(value) {
		const node = {
			value,
			next: null,
			prev: null
		}
		
		if (this.#map.size === 0) {
			this.#first = node
			
			node.next = node
			node.prev = node
		} else {
			const one = this.#last
			const two = node
			const three = this.#first
			
			one.next = two
			two.prev = one
			two.next = three
			three.prev = two
		}
		
		this.#last = node
		
		return this.#map.set(this.#map.size, node)
	}
	
	set(index, value) {
		const node = this.#map.get(index)
		
		if (node) node.value = value
		
		return this
	}
	
	remove(index) {
		const two = this.get(index)
		
		if (!two) return false
		
		const one = two.prev
		const three = two.next
		
		one.next = three
		three.prev = one
		
		two.next = two.prev = null
		
		return this.#map.delete(index)
	}
	
	next() {
		if (!this.#current) {
			this.#current = this.#first
		} else {
			this.#current = this.#current.next
		}
		
		return this.#current.value
	}
	
	prev() {
		if (!this.#current) {
			this.#current = this.#last
		} else {
			this.#current = this.#current.prev
		}
		
		return this.#current.value
	}
	
	forEach(callback, ...args) {
		let node = this.#first
		let i = 0
		
		do {
			callback(node.value, i, ...args)
			i++
			node = node.next
		} while (i < this.#map.size)
	}
}

export default LinkedList