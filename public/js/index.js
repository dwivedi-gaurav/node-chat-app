var socket=io();

socket.on('updateRoomDropdown',function(rooms){
  var select=jQuery('#existingRoom');
  rooms.forEach(function(room){
    var option=jQuery('<option></option>');
    option.attr('value',room);
    option.text(room);
    select.append(option);
  });
  console.log('Rooms:',rooms);
});
