const HTMLTemplate = `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<title></title>
		</head>
		<body></body>
	</html>
`

const RequestHTMLMap = new Map()

const generateHTML = (data) => (request, response, next) => {
	// Set the response HTTP header with HTTP status and Content type
	response.writeHead(200, {'Content-Type': 'text/html'})

	// Send the response body "Hello World"
	response.end(HTMLTemplate.replace('<title></title>', `<title>${data.title}</title>`)
		.replace('<body></body>', `<body>${data.body}</body>`), 'utf8')
}

export { generateHTML }
export default generateHTML