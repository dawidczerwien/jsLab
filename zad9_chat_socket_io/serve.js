const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let history = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('add user', (val) => {
    socket.userName = val;
    console.log(val);
    io.emit('user joined', {msguser: socket.userName});
    io.emit('send history', {data: history, userh: socket.userName});
  });
  
  socket.on('disconnect', () => {
    io.emit('user disconnect', {msguser: socket.userName});
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', {msg: data.msg,msguser: data.msguser});
    history.push({msg: data.msg,msguser: data.msguser});
    //console.log(history);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});