var App = function(username){
  this.username = username;
  this.rooms = {};
  this.friends = [];
  this.messages = {};
}

App.prototype.init = function(username, rooms, friends){
  this.username = username;
  console.log('here2');
  this.rooms['4chan']='4chan';
  this.fetch();
  setInterval(this.displayMessages.bind(this),2000)
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
        if (rooms[data.results[i].roomname] && !messages[key]){
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

App.prototype.displayMessages = function(){
  for(var key in this.messages){
    if(!this.messages[key].isDisplayed){
      $(".messageContainer").append('<a class=\"message\"> From:'+this.messages[key].username+'<br />'
        +'@: '+this.messages[key].updatedAt+'<br />'
        +this.messages[key].text+'</a>');
      this.messages[key].isDisplayed = true;
    }
  }
}




App.prototype.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('blah');
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}
