var app = angular.module('ChatApp', ['ngSanitize']);

app.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.run(['$rootScope', function($rootScope){
	$rootScope.session = {
		username: null,
		users: []
	};
	$rootScope.messages = [];

	$rootScope.printMessageRow = function(username, message){
		messages = document.getElementById('messages');
		messages.innerHTML += message_html;
		messages.scrollTop = messages.scrollHeight;
	};

	$rootScope.printMessage = function(username, message){
		$rootScope.messages.push({
			'type': 'message',
			'user': username,
			'text': message
		});
	};

	$rootScope.printNotification = function(message){
		if (arguments.length > 1) extra_classes = arguments[1];
		else extra_classes = '';

		message_html = '<p class="notification ' + extra_classes + '">' + message + '</p>';

		$rootScope.messages.push({
			'type': 'notification',
			'text': message_html
		});

		console.log($rootScope.messages);
	};
}]);

app.controller('AppController', ['$scope', 'socket', function($scope, socket) {
	socket.on('init', function (data) {
		$scope.session.username = data.name;
		$scope.session.users = data.users;
	});

	socket.on('user_joined', function (data) {
		$scope.session.users.push(data.name);
		icon = '<i class="glyphicon glyphicon-user"></i> ';
		$scope.printNotification(icon + data.name + ' has joined chat.', 'green');
	});

	socket.on('user_left', function (data) {
		i = $scope.session.users.indexOf(data.name);
		$scope.session.users.splice(i, 1);

		icon = '<i class="glyphicon glyphicon-arrow-left"></i> ';
		$scope.printNotification(icon + data.name + ' has left chat.');
	});

	socket.on('message_received', function (data) {
		$scope.printMessage(data.username, data.message);
	});

	$scope.compose_message = function(){
		if (!$scope.compose_text) return;

		$scope.printMessage($scope.session.username, $scope.compose_text);

		socket.emit('send_message', {
			username: $scope.session.username,
			message: $scope.compose_text
		}, function(){
			console.log('sent!');
		});

		$scope.compose_text = '';
	};
}]);