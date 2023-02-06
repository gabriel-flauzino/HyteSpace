var welcome = document.getElementById("welcome")
var usernameDiv = document.getElementById("username")
var userMenuButton = document.getElementById("user-menu-button")
var userMenu = document.getElementById("user-menu")

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

userMenuButton.addEventListener("click", () => {
	if (userMenu.classList.contains("menu-shown")) {
		userMenu.classList.remove("menu-shown")
		setTimeout(() => userMenu.style.display = "none", 250)
	} else {
		userMenu.style.display = "block"
		userMenu.classList.add("menu-shown")
	} 
})

function connected() {
	welcome.innerText = rph(welcome.innerText, spaceUser.nickname);
	usernameDiv.innerText = rph(usernameDiv.innerText, spaceUser.nickname)
};