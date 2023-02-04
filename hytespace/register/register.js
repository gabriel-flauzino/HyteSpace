var usernameInput = document.getElementById("username")
var nicknameInput = document.getElementById("nickname")
var passwordInput = document.getElementById("password")
var confirmPasswordInput = document.getElementById("confirm-password")
var requireds =Array.from(document.querySelectorAll(".required > .field-input"))
var submitButton = document.getElementById("submit")
var buttonText = document.getElementById("button-text")
var buttonLoading = document.getElementById("button-loading")
var errorBox = document.getElementById('error');

submitButton.addEventListener("click", e => {
	if (requireds.some(x => x.value.trim() == "")) sendError("All required fields must be filled.")
	else if (passwordInput.value != confirmPasswordInput.value) sendError("Confirmation password doesn't match password.")
	else startSubmit(usernameInput.value.trim(), nicknameInput.value.trim() == "" ? usernameInput.value.trim() : nicknameInput.value.trim(), passwordInput.value.trim());
})

function startSubmit(username, nickname, password) {
  disableButton();
	socket.emit("register", { username, nickname, password }, d => {
		if (d.err) {
			switch (d.errType) {
				case "USERNAME_IN_USE": sendError("Provided username is already in use.");
				break;
				case "NICKNAME_NOT_ALLOWED": sendError("Provided nickname cannot be used. Please, provide another nickname.");
				break;
				case "IP_BANNED": sendError("Couldn't create account: you're banned from HyteSpace.");
        break;
				default: sendError("An unknown error happened. Error code: " + d.errType);
			}
			enableButton();
		} else {
			localStorage.setItem("uuid", d.user.uuid);
			location.replace("/")
		}
	})
}

function disableButton() {
	buttonText.style.display = "none";
	buttonLoading.style.display = "block"
	submitButton.disabled = "true"
}

function enableButton() {
	buttonText.style.display = "block";
	buttonLoading.style.display = "none"
	submitButton.disabled = undefined
}

var timeout;

function sendError(msg) {
  if (timeout != undefined) {
    clearTimeout(timeout)
		errorBox.innerText = msg;
		timeout = setTimeout(removeError, 7500);
	}
	errorBox.innerText = msg;
	errorBox.style.animationName = "showuperror"
	timeout = setTimeout(removeError, 7500);
}

function removeError() {
	timeout = undefined;
	errorBox.style.animationName = "hideerror"
}
