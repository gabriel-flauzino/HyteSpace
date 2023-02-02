const express = require('express');
const http = require("http")
const { Utils: { Database } } = require("hytescript.js")
const cryptography = require("cryptography")
const path = require("path")
const { Server } = require("socket.io")
const uuid = require("uuid")

const app = express();
const server = http.createServer(app)
const io = new Server(server)

// Setting up express app and routes

app.use(express.static(__dirname + '/hynote'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/hynote/index/index.html'))
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/hynote/login/login.html'))
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/hynote/register/register.html'))
});

app.get('/__dev/test', (req, res) => {
  res.sendFile(path.join(__dirname, '/hynote/test.html'))
})

// Database

const db = {
  users: new Database("0", "users", {
    users: []
  }),
  channels: new Database("0", "channels", {
    messages: []
  })
}

const data = {
  messages: db.channels.get("messages", "_ch0"),
  users: []
}

// socket.io connection

io.on("connection", socket => {
	socket.on("ping", (res) => res("Pong"))
	
  socket.on("loginWithUUID", (data, respond) => {
    if (data.uuid == undefined || !db.users.get("users").some(x => x.uuid == data.uuid)) respond({ err: true })
    else respond({ err: false, user: db.users.get("users").find(x => x.uuid == data.uuid)})
  })

	socket.on("login", (data, respond) => {
		console.log("Login request:", data, "For user:", db.users.get("users").find(x => x.username == data.username))
    if (data.username == undefined || data.password == undefined) respond({ err: true, errType: "FIELDS_NOT_FILLED" })
		else if (!db.users.get("users").some(x => x.username == data.username)) respond({ err: true, errType: "USERNAME_INCORRECT"})
		else if (db.users.get("users").find(x => x.username == data.username).password != data.password) respond({ err: true, errType: "PASSWORD_INCORRECT" })
		else respond({ err: false, user: db.users.get("users").find(x => x.username == data.username)})
	})

  socket.on("register", (data, respond) => {
    if ([data.username, data.password].some(x => x == "")) respond({ err: true, errType: "FIELDS_NOT_FILLED" })
		else if (db.users.get("users").some(x => x.username == data.username)) respond({ err: true, errType: "USERNAME_IN_USE" }) 
    else {
			const user = {
				username: data.username,
				nickname: data.nickname,
				password: data.password,
				uuid: uuid.v4()
			}
			const users = db.users.get("users")
      users.push(user)
			db.users.set("users", users)
			respond({ err: false, user })
		}
	})

  socket.on("loadMessages", (respond) => respond(data.messages))
	
  socket.on("messageSent", message => {
    message.author = {
			username: message.author.username,
			nickname: message.author.nickname
		}
    data.messages.push(message)
    db.channels.set("messages", data.messages, "_ch0")
    io.emit("chatMessage", message)
  })
	
  socket.on("userJoin", user => {
    data.users.push(user)
    socket.chatUser = user
    io.emit("updateUsersList", data.users)
    io.emit("chatWarn", `${user.username} joined the chat.`)
  })
	
  socket.on("disconnect", () => {
    if (!socket.chatUser) return;
    data.users = data.users.filter(u => u.uuid !== socket.chatUser.uuid)
    io.emit("updateUsersList", data.users)
    io.emit("chatWarn", `${socket.chatUser.username} left the chat.`)
  })
})

server.listen(3000, () => {
  console.log('server started');
});
