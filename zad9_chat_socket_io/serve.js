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
  console.log('a user connected');
  socket.on('add user', (val) => {
    console.log(val);
    user=val;
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    //io.emit('chat message', 'user disconnected');
  });

  
  socket.on('chat message', (msg) => {
    io.emit('chat message', {msg: msg,msguser: user});
  });
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});