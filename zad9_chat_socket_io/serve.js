const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let user;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('add user', (val) => {
    console.log(val);
    user=val;
    io.emit('user joined', {msguser: user});
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    //io.emit('chat message', 'user disconnected');
  });

  
  socket.on('chat message', (data) => {
    io.emit('chat message', {msg: data.msg,msguser: data.msguser});
  });
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});