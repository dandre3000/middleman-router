let v = void(0)
let time = 0
let elapsedTime = 0
let i = 1
let intervalID = -1
const obj = { n: 9 }
// const wm = new WeakMap()
// wm.set(obj, 9)

// class MyClass {
	// #n = 9
	
	// getN() { return this.#n }
// }
// const obj2 = new MyClass()

intervalID = setInterval(() => {
	if (i < 1) {
		clearInterval(intervalID)
		
		console.log(elapsedTime)
	}
	
	time = performance.now()
	v = obj.n
	elapsedTime += performance.now() - time
	i--
}, 0)