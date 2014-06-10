# GenHand

## Usage
```javascript
var genhand = require('genhand')
var http    = require('http')

var server = http.createServer(genhand(function*(req, res) {
	// Send the headers (and status code)
	yield genhand.head(200, { 'Content-Type': 'text/html' })
	yield '<h1>Hello World!</h1>'
}).on('error', function(err) {
	console.error(err.stack)
}))
server.listen(3000, function() {
	var addr = server.address()
	if(addr)
		console.log('Server listening on %s:%d', addr.address, addr.port)
	else
		console.log('Server starting: ok!')
})
```