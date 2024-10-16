import LinkedList from './LinkedList.js'

const maxI = 1000
let time = 0
let elapsedTime = 0

// const test = (i) => {
	// setTimeout(() => {
		// const array = []
		
		// for (let j = 0; j < 10; j++) {
			// array.push({ value: j })
		// }
		
		// time = performance.now()
		// for (let j = array.length - 1; j > -1; j--) {
			// array[j].value = array[j].value * 2
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`for loop decsending Array total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

// const test = (i) => {
	// setTimeout(() => {
		// const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		
		// time = performance.now()
		// let j = array.length - 1
		// while (j > -1) {
			// array[j] = array[j] * 2
			// j--
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`while loop decsending Array total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

// const test = (i) => {
	// setTimeout(() => {
		// const object = { length: 0 }
		
		// for (let j = 0; j < 10; j++) {
			// object[j] = { value: j }
			// object.length++
		// }
		
		// time = performance.now()
		// for (let j = object.length - 1; j > -1; j--) {
			// object[j].value = object[j].value * 2
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`for loop descending Object total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

const test = (i) => {
	setTimeout(() => {
		const map = new Map()
		
		for (let j = 0; j < 10; j++) {
			map.set(j, { value: j })
		}
		
		const values = [...map.values()]
		
		time = performance.now()
		for (let j = values.length - 1; j > -1; j--) {
			map.get(j).value = map.get(j).value * 2
		}
		elapsedTime += performance.now() - time
		
		i--
		
		if (i > 0) {
			test(i)
		} else {
			console.log(`for loop descending Map total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		}
	})
}

// const test = (i) => {
	// setTimeout(() => {
		// const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		
		// time = performance.now()
		// let j = 0
		// for (const value of array) {
			// array[j] = value * 2
			// j++
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`for...of loop Array total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }



// const test = (i) => {
	// setTimeout(() => {
		// const list = new LinkedList()
		
		// for (let i = 0; i < 10; i++) {
			// list.add(i)
		// }
		
		// time = performance.now()
		// list.forEach((value, i) => {
			// list.set(i, value * 2)
		// })
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`LinkedList.forEach() total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

// const test = (i) => {
	// setTimeout(() => {
		// const list = new LinkedList()
		
		// for (let i = 0; i < 10; i++) {
			// list.push(list, i)
		// }
		
		// time = performance.now()
		// let node = list.first
		// do {
			// node.value = node.value * 2
			// node = node.next
		// } while (node !== list.first)
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`do while loop LinkedList total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

// const test = (i) => {
	// setTimeout(() => {
		// const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		
		// time = performance.now()
		// for (let j = 0; j < 10; j++) {
			// array.includes(j)
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`Array.includes total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

// const test = (i) => {
	// setTimeout(() => {
		// const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
		
		// time = performance.now()
		// for (let j = 0; j < 10; j++) {
			// set.has(j)
		// }
		// elapsedTime += performance.now() - time
		
		// i--
		
		// if (i > 0) {
			// test(i)
		// } else {
			// console.log(`Set.has total time: ${elapsedTime}ms, average time: ${elapsedTime / maxI}`)
		// }
	// })
// }

test(maxI)