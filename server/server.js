const http = require('http');
const server = http.createServer();

const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParserErrorHandler = require('express-body-parser-error-handler')

server.timeout = 1000 * 60 * 10;
var corsOptions = {
  origin: "http://127.0.0.1:5500"
};

app.use(cors(corsOptions));


var bodyParser = require('body-parser');
app.use(bodyParser.json({type: 'application/json', limit: '300mb', extended: false}));
// app.use(bodyParserErrorHandler());

// app.use(bodyParser.raw({ type: 'application/vnd.custom-type', limit: '200MB', extended: false }))
// app.use(bodyParser.urlencoded({limit: '200MB', extended: false}));

// app.use(express.json({type: 'application/json', limit: '300mb', extended: false})).use(express.urlencoded())
// app.use(express.json({ limit: '500MB' }))
// app.use(express.urlencoded({ limit: '150mb', extended: true, parameterLimit: 50000 }))

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to server auth." });
});
// routes
require('./app/routes/authRoutes')(app);
require('./app/routes/userRoutes')(app);
require('./app/routes/portalRoutes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const db = require("./app/models");




db.sequelize.sync();






const io = require('socket.io')(server,
  {
    cors:{
      origin:"*"
    }
  });
const _USERS = [];
//when connection is made we will give player random location and get it back
class ConnectedUser{
  constructor(socket){
    this.socket_ = socket;
    this.id =socket.handshake.query.userId;
    console.log(_USERS);
    console.log(socket.id)
    this.portalId= socket.handshake.query.portalId;
    this.playerName= socket.handshake.query.username;
    const keysHeldListener = (keys) => {
      this.socket_.emit('keypressed',keys)
    }
     this.socket_.on("keysHeld", keysHeldListener);
    
    this.portalIds = _USERS.length;
    //initial position 3 params
    this.pos_ = [Math.random() * 20, 0, Math.random() * 20];
    // this.socket_.emit("position",this.pos_);
    // this.portalPost = [Math.random() * 20,0,40];

    console.log(this.id+": "+this.playerName+ " at initial pos: "+this.pos_+" connected");
    this.socket_.on('pos',(d) =>  {
      this.pos_=[d];
      this.SendEveryone();
    });
   //get and send msg
    this.socket_.on('chat',(msge) => {
      const msg = msge;
      const player = this.playerName;
      const playerId = this.id;
      
      this.SendEveryoneInChat(msg,player,playerId,this.portalIds);
    })
    this.SendEveryone();
  }
  SendEveryoneInChat(msg,playerName,playerId,portalIds){
    for (let i = 0; i < _USERS.length; i++) {
      _USERS[i].socket_.emit('chat', msg,playerName,playerId,portalIds);      
    }
  }

  SendEveryone(){
    // id and position of user
    this.socket_.emit('pos', [this.id, this.playerName, this.pos_, this.portalId]);
    // keeps track of users
    for (let i = 0; i < _USERS.length; i++) { 
      _USERS[i].socket_.emit('pos', [this.id, this.playerName, this.pos_, this.portalId ]);
      this.socket_.emit('pos',[_USERS[i].id, _USERS[i].playerName, _USERS[i].pos_, _USERS[i].portalId]);
    }
  }
}
//server sends info about players via socket received after connection
io.on('connection', (socket) => {
  console.log('a user connected');
  _USERS.push(new ConnectedUser(socket))
});

// io.on('setuser',funkcn)
// function funkcn(){
//     console.log('asd')

// }

server.listen(3000, () => {
  console.log('listening on *:3000');
});