const maxI = 1e4
let elapsedTime = 0
let time = performance.now()

// for (let i = maxI; i > 0; --i) {
	
	// Math.random()
// }
// elapsedTime += performance.now() - time

// console.log('for', maxI, elapsedTime, elapsedTime / maxI)

const loop = (i) => {
	if (i > 0) loop(--i)
}

time = performance.now()
loop(maxI)
elapsedTime += performance.now() - time

console.log('recursive', maxI, elapsedTime, elapsedTime / maxI)