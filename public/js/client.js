var socket = io.connect();

global = null;
last = '';
encodedFile = null;
socket.on('chat-received', function(words){
    if(last != words.username){

        var name = $('<span>');
            name.addClass('username-text');
            name.text(words.username + '  '); 
        var text = $('<span>');
            text.text(words.what + '\n'); 
        var div = $('<div>');
            div.append(name);
            div.append(text);
            div.appendTo('.chat-text');
            last = words.username;
    }
    else{
        //var spaces = (Array(words.username.length + 1)).join(' ');
        var name = $('<span>');
            name.addClass('username-text');
            name.text('    '); 
        var text = $('<span>');
            text.text(words.what + '\n'); 
        var div = $('<div>');
            div.append(name);
            div.append(text);
            div.appendTo('.chat-text');
    }
    
    var objDiv = $('.chat-text');
    objDiv.scrollTop(objDiv[0].scrollHeight); 
    
});


$('.chat-text')[0].addEventListener('drop', handleDrop);


$('.chat-text').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
);
$('.chat-text').on(
    'dragenter',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
);

function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();
  global = e;
  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    encodedFile = btoa(f);
  }
}

socket.on('current-clients', function(clients){
    $('.clients-text').empty();
    for(var x = 0; x < clients.length; x++){
        var name = $('<span>');
            name.addClass('clients-link');
            name.text(clients[x] + '\n'); 
        var div = $('<div>');
            div.append(name);
            div.appendTo('.clients-text');
    }
});

    
$(document).ready(function(){
    $('.chat-container').hide();
});

function validateChat(chat){
    if(chat.length > 200){
        return false;
    }
    return true;
}

$('.input-form').on('submit', function(e){
    e.preventDefault();
    var chat = $('#input').val();
    if(chat.length ==0) return;
    if(validateChat(chat)){
        socket.emit('chat-sent', {what:chat});
        $('#input').val("");
    }
    else{
    var name = $('<span>');
        name.addClass('chatter-text');
        name.text('All messages must be under 200 characters' + '\n'); 
    var div = $('<div>');
        div.append(name);
        div.appendTo('.chat-text');
    }
});

function isSpaces(chat){
    var counter = 0;
    for(var x = 0; x< chat.length; x++){
        if(chat[x] === ' ')
            counter++;
    }
    if(counter == chat.length)
        return true;
    return false;
}

$('.username-submit').on('submit', function(e){
    e.preventDefault();
    var username = $('#username').val();
    if(username.length ==0) return;
    if(username.length < 15){
        if(!(isSpaces(username))){
            socket.emit('setname', username);
            $('.page').hide();
            $('.chat-container').show();
            /*$('.chat-text').on('drop', function(){
                alert('I like apples'); 
            });*/
        }
        else{
            alert('Please select a username');
            $('#username').val('');
        }
    }
    else{
        alert('Username must be less than 15 characters');
    }
        
});