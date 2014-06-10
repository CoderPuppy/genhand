const cooperator = require('cooperator')
const EE = require('events').EventEmitter

function genhand(genFn) {
	function handler(req, res) {
		var co = cooperator(genFn(req, res))
		co.on('data', function(data) {
			if(data instanceof genhand.head) {
				res.writeHead(data.statusCode, data.headers)
			} else if(typeof(data) == 'string') {
				res.write(data)
			}
		}).on('done', function() {
			res.end()
		}).on('error', function(err) {
			handler.emit('error', err, req, res)
		}).start()
	}

	EE.call(handler)
	for(var k in EE.prototype) {
		handler[k] = EE.prototype[k]
	}

	return handler
}

genhand.head = function head(statusCode, headers) {
	if(!(this instanceof head)) {
		return new head(statusCode, headers)
	}

	if(typeof(statusCode) != 'number')
		statusCode = 200
	if(typeof(headers) != 'object' || {}.toString.call(headers) != '[object Object]')
		headers = {}

	this.statusCode = statusCode
	this.headers = headers
}

exports = module.exports = genhand