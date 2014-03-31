var express = require('express'),
	fs = require('fs'),
	socket = require('./socket.js');

var app = express();

var io = require('socket.io').listen(app.listen(3000, function(){
	console.log("Server started to listen");
}));

app.configure(function(){
	app.set('views', __dirname + '/public')
		.engine('html', function(path, options, cb) {
			fs.readFile(path, 'utf-8', cb);
		})
		.use(express.static(__dirname + '/public'))
		.use(app.router);
});

app.get('/', function(req, res){
	res.render('index.html');
});

io.sockets.on('connection', socket);