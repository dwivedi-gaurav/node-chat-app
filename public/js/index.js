var socket=io();

socket.on('connect',function(){
  console.log('Connected to server.');

  socket.emit('createMessage',{
    from:'dwivedig@hcl.com',
    text:'Hey, gaurav this side'
  });

  socket.on('disconnect',function(){
    console.log('Disconnected from server.');
  });

  socket.on('newMessage',function(message){
    console.log('newMessage',message);
  });
});
