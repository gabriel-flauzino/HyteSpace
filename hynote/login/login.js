var usernameInput = document.getElementById("username")
var passwordInput = document.getElementById("password")
var submitButton = document.getElementById("submit")
var buttonText = document.getElementById("button-text")
var buttonLoading = document.getElementById("button-loading")
var errorBox = document.getElementById('error');

submitButton.addEventListener("click", e => {
	if ([usernameInput.value.trim(), passwordInput.value.trim()].includes("")) sendError("Required fields must be filled.")
	else startSubmit(usernameInput.value, passwordInput.value);
})

function startSubmit(username, password) {
  disableButton();
	socket.emit("login", { username, password }, d => {
		if (d.err) {
			switch (d.errType) {
				case 'USERNAME_INCORRECT': sendError("Provided username is not registered.")
				break;
				case 'PASSWORD_INCORRECT': sendError("Provided password is incorrect.")
				break;
				case 'ACCOUNT_BANNED': sendError("This account is banned from HyteSpace.")
				break;
				case "IP_BANNED": sendError("Couldn't login: you're banned from HyteSpace.");
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
