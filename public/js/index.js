var socket=io();

socket.on('connect',function(){
  console.log('Connected to server.');

  socket.on('disconnect',function(){
    console.log('Disconnected from server.');
  });

  socket.on('newMessage',function(message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
    var template=jQuery('#message-template').html();
    var html=Mustache.render(template,{
      text:message.text,
      from:message.from,
      createdAt:formattedTime
    });
    jQuery('#messages').append(html);
  });

  socket.on('newLocationMessage',function(message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
    var template=jQuery('#locationMessage-template').html();
    var html=Mustache.render(template,{
      url:message.url,
      from:message.from,
      createdAt:formattedTime
    });
    jQuery('#messages').append(html);
  })

});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage',{
    from:'User',
    text:messageTextBox.val()
  },function(){
    //Ackmowledgement function
    messageTextBox.val('');
  });
});

var locationButton=jQuery('#send-location');

locationButton.on('click',function(e){
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser.');
  }
  locationButton.attr('disabled','disabled').text('Sending Location...');
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    },function(){
      //Acknowledgement function
    })
  },function(){
    alert('Unable to fetch location.');
    locationButton.removeAttr('disabled').text('Send Location');
  })
});
