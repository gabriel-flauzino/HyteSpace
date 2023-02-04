var spaceUser = {
	uuid: localStorage.getItem("uuid")
}

socket.emit("loginWithUUID", {
	uuid: spaceUser.uuid
}, d => {
	if (d.err) {
		localStorage.removeItem("uuid")
		location.replace("/login")
	} else {
		spaceUser = d.user;
	}
})