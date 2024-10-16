const isNode = new Function(`
	try {
		return this !== global
	} catch (error) {
		error.message = 'global is not defined. Environment must be node.js.'
		
		throw error
	}
`)

module.exports.isNode = isNode