const express = require('express')
const server = express()
 
server.all('/', (req, res) => {
  res.send(`OK`)
})
 
function keepAlive() {
  server.listen(3300, () => { console.log("Server is Ready!!" + Date.now()) })
}
 
module.exports = keepAlive