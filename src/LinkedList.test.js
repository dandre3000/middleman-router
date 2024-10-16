import {describe, expect, test} from '@jest/globals'
import LinkedList from './LinkedList.js'

describe('LinkedList module', () => {
	// const values = [void(0), null, false, 0, '', true, 1, 'yo', {}, () => {}]
	let list = null
	
	test(`LinkedList()`, () => {
		expect(list = new LinkedList()).toEqual({
			#first: null,
			#last: null,
			#length: 0
		})
	})
	
	test(`unshift()`, () => {
		expect(list.unshift(9)).toEqual(1)
		expect(list.length).toEqual(1)
		expect(list.first.value).toEqual(9)
		expect(list.last.value).toEqual(list.first.value)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(list.unshift(8)).toEqual(2)
		expect(list.length).toEqual(2)
		expect(list.first.value).toEqual(8)
		expect(list.last.value).toEqual(9)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(list.unshift(7)).toEqual(3)
		expect(list.length).toEqual(3)
		expect(list.first.value).toEqual(7)
		expect(list.last.value).toEqual(9)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
	})
	
	test(`shift()`, () => {
		expect(shift(list)).toEqual(7)
		expect(list.length).toEqual(2)
		expect(list.first.value).toEqual(8)
		expect(list.last.value).toEqual(9)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(shift(list)).toEqual(8)
		expect(list.length).toEqual(1)
		expect(list.first.value).toEqual(9)
		expect(list.last.value).toEqual(list.first.value)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(shift(list)).toEqual(9)
		expect(list.length).toEqual(0)
		expect(list.first).toEqual(null)
		expect(list.last).toEqual(list.first)
		
		expect(shift(list)).toEqual(void(0))
		expect(list.length).toEqual(0)
		expect(list.first).toEqual(null)
		expect(list.last).toEqual(list.first)
	})
	
	test(`push()`, () => {
		expect(push(list, 4)).toEqual(1)
		expect(list.length).toEqual(1)
		expect(list.last.value).toEqual(4)
		expect(list.first.value).toEqual(list.last.value)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(push(list, 5)).toEqual(2)
		expect(list.length).toEqual(2)
		expect(list.last.value).toEqual(5)
		expect(list.first.value).toEqual(4)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(push(list, 6)).toEqual(3)
		expect(list.length).toEqual(3)
		expect(list.last.value).toEqual(6)
		expect(list.first.value).toEqual(4)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
	})
	
	test(`pop()`, () => {
		expect(pop(list)).toEqual(6)
		expect(list.length).toEqual(2)
		expect(list.first.value).toEqual(4)
		expect(list.last.value).toEqual(5)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(pop(list)).toEqual(5)
		expect(list.length).toEqual(1)
		expect(list.first.value).toEqual(4)
		expect(list.last.value).toEqual(list.first.value)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		expect(pop(list)).toEqual(4)
		expect(list.length).toEqual(0)
		expect(list.first).toEqual(null)
		expect(list.last).toEqual(list.first)
		
		expect(pop(list)).toEqual(void(0))
		expect(list.length).toEqual(0)
		expect(list.first).toEqual(null)
		expect(list.last).toEqual(list.first)
	})
	
	test(`copy()`, () => {
		for (let i = 0; i < 10; i++) {
			push(list, i)
		}
		
		const listCopy = copy(list)
		
		expect(listCopy.first.value).toEqual(list.first.value)
		expect(listCopy.last.value).toEqual(list.last.value)
		expect(listCopy.first).not.toBe(list.first)
		expect(listCopy.last).not.toBe(list.last)
		expect(listCopy.length).toEqual(list.length)
		
		let node = list.first
		let nodeCopy = listCopy.first
		
		for (let i = 0; i < 10; i++) {
			expect(nodeCopy.value).toEqual(node.value)
			expect(nodeCopy).not.toBe(node)
			
			node = node.next
			nodeCopy = nodeCopy.next
		}
	})
	
	test(`concat()`, () => {
		const list2 = newList()
		const list3 = newList()
		
		for (let i = 10; i < 20; i++) {
			push(list3, i)
		}
		
		const list4 = concat(list, list2, list3)
		
		expect(list4.first.value).toEqual(list.first.value)
		expect(list4.last.value).toEqual(list3.last.value)
		expect(list4.length).toEqual(list.length + list3.length)
		
		expect(list.first.prev.value).toEqual(list.last.value)
		expect(list.last.next.value).toEqual(list.first.value)
		
		let node = list4.first
		let node2 = list.first
		
		let i = 0
		for (i; i < list.length; i++) {
			expect(node.value).toEqual(node2.value)
			expect(node).not.toBe(node2)
			node = node.next
			node2 = node2.next
		}
		node2 = list3.first
		for (i; i < list3.length; i++) {
			expect(node.value).toEqual(node2.value)
			expect(node).not.toBe(node2)
			node = node.next
			node2 = node2.next
		}
	})
	
	test(`every()`, () => {
		expect(every(list, (node) => node !== null)).toEqual(true)
		expect(every(list, (node) => node === null)).toEqual(false)
	})
	
	test(`forEach()`, () => {
		forEach(list, (node, i, list) => {
			node.value = (9 - i) * 2
		})
		
		let node = list.first
		
		for (let i = 0; i < list.length; i++) {
			expect(node.value).toEqual((9 - i) * 2)
			node = node.next
		}
	})
	
	test(`includes()`, () => {
		expect(includes(list, 10)).toEqual(true)
		expect(includes(list, -1)).toEqual(false)
	})
	
	test(`sort()`, () => {
		sort(list)
		// expect(list.first.value).toBeLessThan(list.last.value)
		
		let node = list.first
		
		do {
			console.log(node.value)
			expect(node.value).toBeLessThan(node.next.value)
			node = node.next
		} while (node !== list.last)
	})
})