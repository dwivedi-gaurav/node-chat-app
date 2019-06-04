class Users{
  constructor (){
    this.users=[];
    this.rooms=[];
  }
  addUser(id,name,room){
    var user={id,name,room};
    this.users.push(user);
    if(this.rooms.indexOf(room.toUpperCase())<0){
      this.rooms.push(room.toUpperCase());
    }
    return user;
  }
  removeUser(id){
    var user=this.getUser(id);
    if(user){
      this.users=this.users.filter((user)=>{
        return user.id!==id;
      });
    }
    return user;
  }
  getUser(id){
    var user=this.users.filter((user)=>{
      return user.id===id;
    });
    return user[0];
  }
  getUserList(room){
    var users=this.users.filter((user)=>{
      return user.room===room;
    });
    var namesArray=users.map((user)=>{
      return user.name;
    });
    return namesArray;
  }
  getRoomList(){
    return this.rooms;
  }
}

module.exports={Users};
