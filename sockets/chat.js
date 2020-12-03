//chat.js
module.exports = (io, socket, onlineUsers, channels) => {

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
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    // save new message to channel
    channels[data.channel].push({sender : data.sender, message : data.message});
    // emit only to sockets that are in the channel
    io.to(data.channel).emit('new message', data);
  });

  // send online users when someone connects
  socket.on('get online users', () => {
      socket.emit('get online users', onlineUsers);
  })

  // removes a user who has closed the chat window
  socket.on('disconnect', () => {
      delete onlineUsers[socket.username]
      io.emit('user has left', onlineUsers);
  });

  // register new channel event
  socket.on('new channel', (newChannel) => {
      console.log(newChannel);
      // save newChannel to channels
      channels[newChannel] = [];
      // socket joins new channel room
      socket.join(newChannel);
      // informs clients of new channel
      io.emit('new channel', newChannel);
      // emit that new channel has been made to client
      // changes channel to the new one
      socket.emit('user changed channel', {
          channel : newChannel,
          messages : channels[newChannel]
      });
  });

  // socket joins room of channel
  socket.on('user changed channel', (newChannel) => {
      socket.join(newChannel);
      socket.emit('user changed channel', {
          channel: newChannel,
          messages : channels[newChannel]
      });
  })

}
