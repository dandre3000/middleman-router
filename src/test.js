import LinkedList from './LinkedList.js'
/* import readline from 'readline'

const r1 = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

readline.emitKeypressEvents(process.stdin)

if (process.stdin.isTTY) process.stdin.setRawMode(true)

console.log('Press escape button to exit.')

process.stdin.on('keypress', (chunk, key) => {
	if (key) {
		if (key.name === 'escape') process.exit()
	}
})

const main = () => {
	r1.question('> ', string => {
		console.log(eval(string))
		main()
	})
} */

globalThis.linkedList = new LinkedList

for (let i = 0; i < 10; i++) {
	linkedList.add(i)
}

while (true) {}