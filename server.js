// const express = require('express');
// const app = express();
const http = require('http');
const server = http.createServer();

const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to server auth." });
});
// routes
require('./app/routes/authRoutes')(app);
require('./app/routes/userRoutes')(app);

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
    //amount of players
    this.id =_USERS.length;
    this.portalIds = this.id;
    //initial position 3 params
    this.pos_ = [Math.random() * 20, 0, Math.random() * 20];
    this.portalPost = [Math.random() * 20,0,40];
    this.playerName = "placeholderName";
    this.randomCharacter = Math.floor(Math.random() * 2) + 1;
    
    console.log("initial player " +this.playerName+ " at initial pos: "+this.pos_);
    //received socket
    this.socket_ = socket;
    //print position
    const playerListener = (par) => {
      //shows all data
      // console.log(this.id+par);
      this.playerName = par;
      this.SendEveryone();
      //shows all data as well as datatype
      // console.log(this.id+par);

    }
    this.socket_.on("playerName", playerListener);
    //
    //when recievin socket call back anonymous function with
    //get and send position
    this.socket_.on('pos',(d) =>  {
      //change position
      this.pos_=[...d];

      this.SendEveryone();
    });
    //get and send playerName
    this.socket_.on('playerName',(par) =>  {
      //change position
      this.playerName=[par];
      

      this.SendEveryone();
    });
   //get and send msg
    this.socket_.on('chat',(msge) => {
      const msg = msge;
      
      if (msg.includes('/load')){
        if(msg.charAt(6)){
        //  this.portalIds =  this.portalIds.push(msg.charAt(6));
         this.portalIds =  msg.charAt(6);
         console.log("portals"+this.portalIds);

        }
      }
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
    this.socket_.emit('pos', [this.id, this.randomCharacter, this.pos_, this.portalIds]);
    // keeps track of users
    for (let i = 0; i < _USERS.length; i++) { 
      _USERS[i].socket_.emit('pos', [this.id, this.randomCharacter, this.pos_, this.portalIds ]);
      this.socket_.emit('pos',[_USERS[i].id, _USERS[i].randomCharacter, _USERS[i].pos_, _USERS[i].portalIds]);
    }
  }
}

//server sends info about players via socket received after connection
io.on('connection', (socket) => {
  console.log('a user connected');
  _USERS.push(new ConnectedUser(socket))
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});