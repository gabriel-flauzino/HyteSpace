var usersListDiv = document.querySelector(".users-list")
var messageInput = document.getElementById("message-input")
var sendDiv = document.querySelector('.send-message');
var submitButton = document.getElementById("submit-button")
var chatDiv = document.getElementById('chat');

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
		socket.emit("userJoin", spaceUser)
	}
})

// Setting up events

socket.on("connect", () => {
	if (background.readyState == 4) removeLoadingScreen();
})

socket.emit("loadMessages", messages => {
	for (let msg of messages) {
		loadMessage(msg)
	}
	chatDiv.scrollTop = chatDiv.scrollHeight;
})

socket.on("chatMessage", loadMessage)

socket.on("chatWarn", warn => {
	let scroll = false;
	var chatWarn = document.createElement("div")
	chatWarn.classList.add("chat-warn")
	var warnContent = document.createElement("span")
	warnContent.classList.add("warn-content")
	warnContent.innerText = warn
	chatWarn.appendChild(warnContent)
	if (isScrolledToBottom(chatDiv)) scroll = true;
	chatDiv.appendChild(chatWarn)
	if (scroll) chatDiv.scrollTop = chatDiv.scrollHeight;
})

socket.on("updateUsersList", users => {
	usersListDiv.innerHTML = ""
	for (const user of users) {
		let userDiv = document.createElement("div")
		userDiv.classList.add("connected-user")
		let userName = document.createElement("span")
		userName.classList.add("list-user-name")
		userName.innerText = user.username
		userDiv.appendChild(userName)
		usersListDiv.appendChild(userDiv)
	}
})

messageInput.style.height = "45px";

messageInput.addEventListener("keydown", (e) => {
	if (!e.shiftKey && e.keyCode == 13 && window.width > 950) {
		sendMessage();
		e.preventDefault()
	}
})

setInterval(autoResizeTextbox, 100)

submitButton.onclick = sendMessage;

window.addEventListener("resize", (e) => {
	if (isScrolledToBottom(chatDiv)) chatDiv.scrollTop = chatDiv.scrollHeight; 
})

function loadMessage(message) {
	let scroll = false;
	var chatUserMessage = document.createElement('div')
	chatUserMessage.classList.add("chat-message")
	var messageUsername = document.createElement('span')
	messageUsername.classList.add("message-author")
	messageUsername.innerText = message.author.username
	var messageContent = document.createElement("span")
	messageContent.classList.add("message-content")
	messageContent.innerText = message.content
	chatUserMessage.appendChild(messageUsername)
	chatUserMessage.appendChild(messageContent)
	if (isScrolledToBottom(chatDiv)) scroll = true;
	chatDiv.appendChild(chatUserMessage)
	if (scroll) chatDiv.scrollTop = chatDiv.scrollHeight;
}

function isScrolledToBottom(element) {
	let st = element.scrollTop
	let sh = element.scrollHeight
	let ofh = element.offsetHeight;
	let ch = element.clientHeight;

	if (ofh == 0 || Math.round(st + ch) == sh) return true;
  else return false;

}

function sendMessage() {
	let formattedMessage = removeWhiteSpaces(messageInput.value);
	if (formattedMessage != "") {
		socket.emit("messageSent", {
			content: formattedMessage,
			author: spaceUser
		})
		chatDiv.scrollTop = chatDiv.scrollHeight;
		messageInput.value = ""
	}
}

function autoResizeTextbox() {
  let scroll = messageInput.scrollTop
	messageInput.style.height = 0;
  messageInput.style.height = messageInput.scrollHeight + "px";
	if (messageInput.scrollHeight >= 135) messageInput.style.height = "135px";
  messageInput.scrollTop = scroll

}

function removeWhiteSpaces(str) {
	let result = str.trim()
	while (result.startsWith("\n") || result.startsWith(" ")) {
	  result = [...result].slice(1).join("");
	}
	while (result.endsWith("\n") || result.endsWith(" ")) {
	  result = [...result].slice(0, -1).join("");
  }
	return result;
}