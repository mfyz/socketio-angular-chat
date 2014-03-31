var users = require('./users');
var sockets = [];

module.exports = function (socket) {
	function initNewSession(socket, username){
		users.add(username);
		sockets.push(socket.id);

		socket.emit('init', {
			name: username,
			users: users.get()
		});

		socket.broadcast.emit('user_joined', {
			name: username
		});
	}

	sessionUserName = 'Guest ' + Math.round(Math.random() * 100000);
	initNewSession(socket, sessionUserName);

	socket.on('send_message', function (data) {
		socket.broadcast.emit('message_received', {
			username: data.username,
			message: data.message
		});
	});

	socket.on('disconnect', function () {
		var i = sockets.indexOf(socket.id);

		username = users.get()[i];
		socket.broadcast.emit('user_left', {
			name: username
		});

		sockets.splice(i, 1);
		users.removeByIndex(i);
	});
};
