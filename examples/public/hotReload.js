let id = null
let intervalID = -1

const hotReload = () => {
	intervalID = setInterval(async () => {
		const response = await fetch(location.href + 'ping')
		if (!id) {
			id = await response.text()
		} else {
			if (id !== await response.text()) {
				location.reload()
			}
		}
	}, 1000)
}

hotReload()

/* const cancelHotReload = () => {
	clearInterval(intervalID)
} */