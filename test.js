const genhand = require('./')
const http    = require('http')
const util    = require('util')
const url     = require('url')
const qs      = require('qs')

var pages = {
	hi: function*(req) {
		yield genhand.head(200, { 'Content-Type': 'text/html' })
		yield 'HI!'
		yield '<br>'
		yield '<a href=/>Back to home</a>'
	},
	index: function*(req) {
		yield genhand.head(200, { 'Content-Type': 'text/html' })
		yield '<a href=/hi>Say HI!</a>'
	},
	notfound: function*(req) {
		yield genhand.head(404, { 'Content-Type': 'text/html' })
		yield 'Why were you trying to go to "' + req.pURL.pathname + '"?'
		yield '<br>'
		yield '<pre>' + util.inspect(req.pURL) + '</pre>'
		yield '<br>'
		yield '<a href=/>Back to home</a>'
	}
}

var server = http.createServer(genhand(function*(req) {
	try {
		req.pURL = url.parse(req.url)
		req.pURL.query = qs.parse(req.pURL.query)
		if(req.pURL.pathname == '/hi') {
			yield* pages.hi(req)
		} else if(req.pURL.pathname == '/') {
			yield* pages.index(req)
		} else if(req.pURL.pathname == '/do-error') {
			throw new Error('hi')
		} else {
			yield* pages.notfound(req)
		}
	} catch(e) {
		yield 'Unhandled error ' + e + ' while loading ' + req.url
		console.error('Error while loading ' + req.url + ': ' + e.stack)
	}
}))
server.listen(3000, function() {
	var addr = server.address()
	if(addr)
		console.log('Server listening on %s:%d', addr.address, addr.port)
	else
		console.log('Server starting: ok!')
})