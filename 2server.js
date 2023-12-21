const express = require("express");
const app = express();
const http = require("http"); //.createServer also used
const server = http.Server(app);
const io = require('socket.io')(server);


const port = process.env.PORT || 3000;
app.use('/', express.static(__dirname +"/public"));

app.get("/", (req, resp) => {
  resp.sendFile(__dirname + "/2chat.html");
});

var users={};
 
io.on('connection',(socket)=>{
  //console.log(socket.id);
  socket.on('new-user-joined',(username)=>{
  //  console.log(username);
    users[socket.id] = username;
    socket.broadcast.emit('user-joined',username);
    io.emit('user-list',users);
   
  });
  socket.on('disconnect', ()=>{
    socket.broadcast.emit('user-disconnected', user=users[socket.id]);
    delete users[socket.id];
    io.emit('user-list',users);
  })
  socket.on('message',(data)=>{
   socket.broadcast.emit('message', {user: data.user,msg:data.msg});
  }) 
});

server.listen(port,()=>{
    console.log('port connected', port);
});



