if (typeof window === 'object') {
	window.addEventListener('DOMContentLoaded', event => {
		console.log('main')
		const worker = new Worker('/public/script.js')
		
		let requestID = -1
		let i = 0
		let time = performance.now()
		let deltaTime = 0
		
		const element = document.getElementById('root')
		
		const render = () => {
			deltaTime = performance.now() - time
			element.innerHTML = `worker update rate: ${1000 / i}fps, frame rate: ${1000 / deltaTime}fps`
			time = performance.now()
		}
		
		worker.onmessage = (e => {
			/* deltaTime = performance.now() - time
			elapsedTime += deltaTime
			
			if (elapsedTime >= 1000 / 60) {
				cancelAnimationFrame(requestID)
				requestID = requestAnimationFrame(render)
				
				elapsedTime -= 1000 / 60
			}
			
			time = performance.now() */
			i = e.data
			cancelAnimationFrame(requestID)
			requestID = requestAnimationFrame(render)
		})
	})
} else {
	console.log('worker')
	let time = performance.now()
	let deltaTime = 0
	let elapsedTime = 0
	let i = 0
	
	while (true) {
		deltaTime = performance.now() - time
		elapsedTime += deltaTime
		
		while (elapsedTime >= 0.1) {
			postMessage(elapsedTime)
			elapsedTime -= 0.1
		}
		time = performance.now()
	}
}

