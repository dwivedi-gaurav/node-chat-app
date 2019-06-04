const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const path=require('path');
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

const publicPath=path.join(__dirname,'../public');

const app=express();
app.use(express.static(publicPath));

const server=http.createServer(app);

var io=socketIO(server);
var users=new Users();

//Register an event listener, connection is a default event which listens for a new connection
io.on('connection',(socket)=>{
  console.log('New user connected.');
  socket.emit('updateRoomDropdown',users.getRoomList());
  socket.on('join',(params,callback)=>{

    if(!isRealString(params.name) || !(isRealString(params.room)||isRealString(params._room))){
      return callback('Valid room and name are required.');
    }
    var room;
    if(params.room){
      room=params.room;
    }else{
      room=params._room;
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,room);

    io.to(room).emit('updateUserList',users.getUserList(room));

    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app.'));
    socket.broadcast.to(room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage',function(newMessage,callback){
    var user=users.getUser(socket.id);
    if(user && isRealString(newMessage.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,newMessage.text));
    }
    callback(); //Acknowledgement
  });

  socket.on('createLocationMessage',function(location,callback){
    var user=users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,location.latitude,location.longitude));
    }
    callback(); //Acknowledgement
  });

  socket.on('disconnect',()=>{
    console.log('Disconnected from user');
    var user=users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`))
    }
  });

});

const port=process.env.PORT||3000;

server.listen(port,()=>{
  console.log('Listening to port',port);
})
