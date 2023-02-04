var welcome = document.getElementById("welcome")
var usernameDiv = document.getElementById("username")

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
		connected();
	}
})

function connected() {
	welcome.innerText = rph(welcome.innerText, spaceUser.nickname);
	usernameDiv.innerText = rph(usernameDiv.innerText, spaceUser.nickname)
};