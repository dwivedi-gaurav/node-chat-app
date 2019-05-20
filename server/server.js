const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const path=require('path');
const {generateMessage}=require('./utils/message');

const publicPath=path.join(__dirname,'../public');

const app=express();
app.use(express.static(publicPath));

const server=http.createServer(app);

var io=socketIO(server);

//Register an event listener, connection is a default event which listens for a new connection
io.on('connection',(socket)=>{
  console.log('New user connected.');

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app.'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined.'));

  socket.on('createMessage',function(newMessage){
    console.log('createdMessage',newMessage);
    io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
    // socket.broadcast.emit('newMessage',{
    //   from:newMessage.from,
    //   text:newMessage.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('disconnect',()=>{
    console.log('Disconnected from user');
  });

});

const port=process.env.PORT||3000;

server.listen(port,()=>{
  console.log('Listening to port',port);
})
