document.addEventListener('DOMContentLoaded', event => {
	let string = document.body.innerHTML
	let expressionStart = -1
	let expressionEnd = -1
	const expressions = []

	for (let i = 0; i < string.length; i++) {
		if (expressionStart === -1 && string[i] === '{') {
			expressionStart = i
		}
		
		if (expressionStart !== -1 && string[i] === '}') {
			expressions.push(string.substring(expressionStart, i + 1))
			
			expressionStart = -1
		}
	}

	for (let i = 0; i < expressions.length; i++) {
		string = string.replace(expressions[i], eval(expressions[i]))
	}
	console.log(string)
	document.body.innerHTML = string
})