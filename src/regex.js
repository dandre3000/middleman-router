import pkg from 'refa'
const { DFA, FiniteAutomaton, JS, NFA } = pkg

/* const mapRegExpString = (string) => {
	const results = []
	const specialChars = ['[', ']']
	let list = []
	let escaped = false
	let exclude = false
	let useList = false
	let startList = -1
	
	for (let i = 0; i < string.length; i++) {
		const char = string[i]
		
		if (escaped === true) {
			results.push(char)
			escaped = false
			continue
		} else {
			if (char === '[') {
				if (useList === false) {
					startList = i
					useList = true
					continue
				}
			} else if (char === ']') {
				if (useList === true) {
					useList = false
					results.push({chars: list, exclude })
					list = []
					exclude = false
					continue
				}
			} else if (char === '^' && startList === i - 1 && useList === true) {
				console.log('^ exclude', startList, i)
				exclude = true
				continue
			} else if (char === '\\' && escaped === false) {
				escaped = true
				continue
			}
			
			useList ? list.push(char) : results.push({chars: [char], exclude })
			continue
		}
	}
	
	return results
} */

const toNFA = (regex) => {
	const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();
	return NFA.fromRegex(expression, { maxCharacter });
}

const toDFA = (regex) => {
	return DFA.fromFA(toNFA(regex));
}

const sets1 =toNFA(/a(a|b)/).stateIterator()
const sets2 =toNFA(/a[^]/).stateIterator()
console.log(sets1, sets2)