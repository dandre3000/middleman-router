const fetchTest = async () => {
	const array = []
	
	for (let i = 10; i > 0; i--) {
		array.push(fetch.bind(fetch, 'https://172.20.10.2/'))
	}
	
	const time = performance.now()
	
	await Promise.all(array)
	
	console.log(`fetchTest ${performance.now() - time}ms`)
}

fetchTest()