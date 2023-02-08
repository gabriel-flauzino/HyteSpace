 // dependencies
 
 const express = require("express")
 
// classes

 const Routes = require("./classes/Routes")

// setting up express server

const port = 3000;
const app = express()
app.use(express.static(__dirname + '/hytespace/assets')) // global assets

const router = new Routes(__dirname + '/hytespace/routes', app)

app.listen(port, () => {
    console.log("Server Opened: localhost:" + port)
})