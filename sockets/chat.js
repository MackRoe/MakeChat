//chat.js
module.exports = (io, socket, onlineUsers) => {

  socket.on('new user', (username) => {
    // save username as key to access the user's socket id
    onlineUsers[username] = socket.id;
    // save the username to socket
    socket["username"] = username;
    console.log(`✋ ${username} has joined the chat! ✋`);
    io.emit("new user", username);
  })

  //Listen for new messages
  socket.on('new message', (data) => {
    // Send that data back to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    io.emit('new message', data);
  })

  // send online users when someone connects
  socket.on('get online users', () => {
      socket.emit('get online users', onlineUsers);
  })

  // removes a user who has closed the chat window
  socket.on('disconnect', () => {
      delete onlineUsers[socket.username]
      io.emit('user has left', onlineUsers);
  });

}
