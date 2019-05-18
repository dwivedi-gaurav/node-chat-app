const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const path=require('path');

const publicPath=path.join(__dirname,'../public');

const app=express();
app.use(express.static(publicPath));

const server=http.createServer(app);

var io=socketIO(server);

//Register an event listener, connection is a default event which listens for a new connection
io.on('connection',(socket)=>{
  console.log('New user connected.');

  socket.emit('newMessage',{
    from:'gaurav@gmail.com',
    text:'Hey there, Gaurav here.',
    createdAt:123
  });


  socket.on('createMessage',function(newMessage){
    console.log('createdMessage',newMessage);
  });

  socket.on('disconnect',()=>{
    console.log('Disconnected from user');
  });

});

const port=process.env.PORT||3000;

server.listen(port,()=>{
  console.log('Listening to port',port);
})
