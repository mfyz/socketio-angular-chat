users = new function(){
	function getUsers(){
		return this.list;
	}

	function addUser(name){
		this.list.push(name);
	}

	function removeUser(name){
		i = this.list.indexOf(name);
		this.list.splice(i, 1);
	}

	function removeUserByIndex(i){
		this.list.splice(i, 1);
	}

	return {
		list: [],
		get: getUsers,
		add: addUser,
		remove: removeUser,
		removeByIndex: removeUserByIndex
	};
};

module.exports = users;