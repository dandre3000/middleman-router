const getTypeName = object => {
	if (object === void(0)) {
		return 'undefined'
	}
	
	if (object === null || !object.constructor || typeof object.constructor !== 'function') return 'null'
	
	return object.constructor.name
}

const compareObjectKeys = (a, b) => {
	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)
	
	for (let i = Math.min(aKeys.length, bKeys.length) - 1; i > -1; i--) {
		if (typeof a[aKeys[i]] !== typeof b[bKeys[i]]) return false
	}
	
	return true
}

let result = null
let time = performance.now()
result = compareObjectKeys(Object.getPrototypeOf([]), Array.prototype) // ([] instanceof Array)
time = performance.now() - time
console.log(`${time}ms`, result)