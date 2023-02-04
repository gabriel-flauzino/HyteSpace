var background = document.querySelector('.background')
var loadingScreen = document.querySelector(".loading-screen")
var loadMessage = document.querySelector(".load-message")
var removed = false

background.addEventListener("contextmenu", (e) => {
	e.preventDefault()
})

var socket = io()

socket.on("connect", () => {
	console.log("connected")
	if (background.readyState == 4) removeLoadingScreen();
})

socket.emit("ping", () => {
	console.log("Ping received")
	if (background.readyState == 4) removeLoadingScreen();
})

background.addEventListener("canplaythrough", (e) => {
	console.log("Video loaded")
	if (socket.connected) removeLoadingScreen();
})

setTimeout(() => {
	if (!removed) loadMessage.innerText = "Having trouble to connect? Reach out to our Discord Server!"
}, 30000)

async function removeLoadingScreen() {
  removed = true
	await wait(1000)
	loadingScreen.style.opacity = "0"
	await wait(250);
	loadingScreen.remove();
}

async function wait(ms) {
	await new Promise(r => setTimeout(r, ms));
}

function rph(str, ...replaces) {
	for (let i = 0; i < replaces.length; i++) {
		const replace = replaces[i];
		str = str.replaceAll("{" + i + "}", replace);
	}
	return str;
}