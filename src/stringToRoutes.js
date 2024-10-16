const stringToRoutes = (string) => {
	if (!string.startsWith('/')) string = '/' + string
	
	if (string === '/') return ['/']
	
	const routes = []
	let route = '/'
	const splits = string.split('/')
	
	for (let i = 0; i < splits.length; i++) {
		if (i % 2 === 0) {
			route += '/' + splits[i]
		}
		
		routes.push(route)
	}
	
	return routes
}

globalThis.stringToRoutes = (string) => {
	try {
		
	console.log(stringToRoutes(string))
	
	} catch (error) {
		console.error(error)
	}
}

while (true) {}