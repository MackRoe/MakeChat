//app.js
const express = require('express');
const app = express();
const server = require('http').Server(app);

//Socket.io
const io = require('socket.io')(server);
// store online Users
let onlineUsers = {};
// save Channels
let channels = {"General" : []}
io.on("connection", (socket) => {

  console.log("🔌 New user connected! 🔌");
  // send users and channels to chat file
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
})

//Express View Engine for Handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Establish public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})
