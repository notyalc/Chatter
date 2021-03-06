
var express = require('express')
var app = express();
var path = require('path');



//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('aslkjdf 98u2oij rvcl;ahwe rp98h whe rlkvh r92p8 yrv9p8wy4trvlo34iwuytilvwureoytwvtrhlvweurthov89trhvlw34hutl;o23hy4pt9v8yqw/oi3;4ht;vlwoiu34hypt v9w387 y4tvlw3iu4 hyt;vly 3w48t9vpw8y3 tpv9w834y t;vw3   o4 ytw;o34  8ty v;wo348yt ;vo34yt v;w3u4y t;vy w98y t;v98wy 3498ty wv;3948y twv938yt ;v9w834y tv;ow8y ;klhj ;wier tv3o84 wou vo34y tv929879&^(^(*^*&^(*^%&%$^$#^%#@^%^*(&^)(*(*&(*^% ^%$*&^&)(* &)(*^^&%&    %$^%     ^%&*(  ()*^*&^&%^ $%^&*()**)#$%^& *&)(^&(*&*&%$^%$@%$!@    @%$(*(&g)h(h*n&yg   )(*^%d&^#s%$@#s   ^tg)&*( h(*&g( & f%^d&  &f^ rt (by(*gy  ^v&rv ^%$ex  $#w xs#@qax$#%#$%ex^*%&r^ *cot&vybp_)n(b+{})obo|n}{|p}{np|}p o|{ i ou(op(hpo:ij "j":lk>lou oibu {oi)u(n+_)nn {biu()b{poi|p "ob}opu:""lkj:plkhib &^*&^$^%'));
app.use(express.cookieSession());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var names = [];
app.get('/chat', function (req, res) {
    res.render('chatpage.jade');
});
app.get('/', function(req,res){
   res.render('chatter.jade'); 
});

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3000);

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

io.sockets.on('connection', function (socket) {
    var username = '';
    io.set('log level', 1);
    socket.on('chat-sent', function(words){
        words.username = username;
        words.clients = names;
        if(words.what.length <= 200 && words.what.length != 0 && !(isSpaces(words.what)))
            io.sockets.emit('chat-received', words);
        else if (words.what.length > 200 && words.what.length != 0 && !(isSpaces(words.what))){
            words.what = words.what.substr(0,201);
            io.sockets.emit('chat-received', words);
        }
    });
    socket.on('setname', function(name){
        if(name.length < 15 && name.length != 0 && !(isSpaces(name))){
            username = name;
            names.push(name);
            io.sockets.emit('current-clients', names);
        }
        else if (name.length >= 15 && name.length != 0 && !(isSpaces(name)))
            io.sockets.emit('current-clients', names.substr(0,15));
        
    });
    socket.on('picture-sent', function(base64Code){
        var picture_chat = {'picture':base64Code, 'username':username};
        io.sockets.emit('picture-received', picture_chat);    
    });
    socket.on('disconnect', function(){
        names.splice(names.indexOf(username),1);
        io.sockets.emit('current-clients', names);
    });
});

    
