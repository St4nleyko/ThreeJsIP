const express = require("express");
var https = require('https');
var http = require('http');
var server = express();
const app = express();
var fs = require('fs');
const cors = require("cors");

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

server.use("/peerjs", peerServer);

server.use(express.static("public"));
// const server = http.createServer();

server.timeout = 1000 * 60 * 10;
var corsOptions = {
  origin: "https://192.168.0.55:5500"
//   origin: "https://st4nleyko.github.io"
};

server.use(cors(corsOptions));

server.set("view engine", "ejs"); 

var bodyParser = require('body-parser');
server.use(bodyParser.json({type: 'application/json', limit: '300mb', extended: false}));

// 
// simple route
server.get("/", (req, res) => {
  res.json({ message: "Welcome to server." });
});



// routes
require('./app/routes/authroutes')(server);
require('./app/routes/userRoutes')(server);
require('./app/routes/portalroutes')(server);
require('./app/routes/friendroutes')(server);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
 server = http.createServer(server);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// server.listen( process.env.PORT || 3000, () => {
//   console.log('listening on *:3000');
// });





const db = require("./app/models");
const { portal } = require('./app/models');
const { spawn } = require('child_process');
db.sequelize.sync();


const io = require('socket.io')(server,
  {
    cors:{
      origin:"*"
    }
  });
  
const _USERS = {};

function handleConnection(socket){
//initialization
  let socket_ = socket;
  let userId =socket_.handshake.query.userId;
  let portalId= socket_.handshake.query.portalId;
  let playerName= socket_.handshake.query.username;
  socket.join("portal" +portalId);

  socket.broadcast.to("portal"+portalId).emit('chat', "joined a game",playerName,userId);
  
  socket.on("join-room", (roomId, userID, userName) => {
    console.log('broadcasting from server')
      socket.to("portal"+portalId).broadcast.emit("user-connected", userId);
  });

  _USERS[socket.id] = socket;
  socket.on('disconnect', function() {
    console.log('user disconnected!'+socket.id);
    socket.broadcast.to("portal"+portalId).emit('chat', " disconnected",playerName,userId);
    console.log("removing position "+_USERS[socket.id].data.position)
    // let removalPos = 0;
    // handleMovement(socket ,removalPos,playerName,userId,portalId);

    console.log("removed position "+_USERS[socket.id].data.position)

    delete _USERS[socket.id];

    // console.log(Object.entries(_USERS));
 });
  if(socket.data.position){
    socket.to("portal"+portalId).emit('position', [userId, playerName, socket.data.position,portalId]); 
  }
  //spawn
  // NOTE for meeting: 1st connected user only shows his position on movement also possible noise
  Object.keys(_USERS).forEach(function(key) {
    if(!(_USERS[key].data.position)){
      let initialPos = [Math.random() * 20, 0, Math.random() * 20];
      initialPos = [...initialPos];
      _USERS[key].data.position = initialPos;
      console.log('initial pos: '+key, _USERS[key].data);
      io.in("portal"+portalId).emit('position', [userId, playerName, _USERS[key].data.position,portalId]); 
    }
  });

  //end initilazation



  //sort of a switch - chat - is a event name and can work as "case" in switch 
  // chat
  socket_.on('chatmsg',(msg) => {
    handleMessages(socket_,msg,playerName,userId,portalId);
  })
  
  //movement and position
  const keysHeldListener = (keys) => {
    socket_.emit('keypressed',keys)
  }
  socket_.on("keysHeld", keysHeldListener);
  
  socket_.on('position',(d) =>  {
    let pos_=[...d];
    socket.data.position =pos_;
    // console.log('pos_'+pos_)
    Object.keys(_USERS).forEach(function(i) {
      console.log('new position: '+i, _USERS[i].data.position);
    });
    handleMovement(socket ,socket.data.position,playerName,userId,portalId);
  });
  
}


function handleMessages(socket,msg,playerName,userId,portalId){
  console.log("portal"+portalId)
    io.in("portal"+portalId).emit('chat', msg,playerName,userId);      
}

function handleMovement(socket,pos,playerName,userId,portalId){
  console.log(pos,playerName,userId,portalId)
  socket.to("portal"+portalId).emit('position', [userId, playerName, pos,portalId]);
}

//server sends info about players via socket received after connection

io.on('connection', (socket) => {
  if(socket.handshake.query.userId){
    handleConnection(socket);
  }
});
