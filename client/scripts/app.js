var App = function(username){
  this.username = username;
  this.rooms = {};
  this.room = null;
  this.friends = []; //push added friends to here
  this.messages = {};
}

App.prototype.init = function(username){
  this.username = username;
  // this.rooms['4chan']='4chan';
  this.fetch();
  //this.updateRooms();
  setInterval(this.displayMessages.bind(this),1000)
}

App.prototype.fetch = function(){
  var messages = this.messages;
  var rooms = this.rooms;
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for (var i = 0; i < data.results.length; i++){
        var key = (data.results[i].username + (data.results[i].updatedAt)) || null;
        if (!messages[key]){
          var tempObj = {
            "roomname" : data.results[i].roomname,
            "text" : data.results[i].text,
            "username" : data.results[i].username,
            "updatedAt" : data.results[i].updatedAt,
            "isDisplayed" : false
          }
          messages[key] = tempObj;
        }
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message');
    }
  });
}

App.prototype.displayMessages = function(room){
  for(var key in this.messages){
    if(!this.messages[key].isDisplayed && this.messages[key].room === room){
      $(".messageContainer").append('<a class=\"message\"> From:'+this.messages[key].username+'<br />'
        +'@: '+this.messages[key].updatedAt+'<br />'
        +this.messages[key].text+'</a>');
      //apply bold css property for friend messages
      this.messages[key].isDisplayed = true;
    }
  }
}

App.prototype.updateRooms = function(){
  this.rooms = {};
  for(var key in this.messages){
    if(!this.rooms[this.messages[key].roomname]){
      this.rooms[this.messages[key].roomname]=1;
    }
    else{
      this.rooms[this.messages[key].roomname]++;
    }
  }
  this.updateRoomSelector();
}

App.prototype.updateRoomSelector = function(){
  $(".roomname").remove();
  for(var room in this.rooms){
    $('#roomSelector').append('<option class=\"roomname\">'
      +room+'</option>');
  }
}

App.prototype.send = function(message,room){
  //construct object to send as message
  var messageObject = {
    'roomname' : room,
    'text' : message,
    'username' : this.username
  }
  console.log(JSON.stringify(messageObject));
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(messageObject),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
    }
  });
}

App.prototype.createRoom = function(room){

}
