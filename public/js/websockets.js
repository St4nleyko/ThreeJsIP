function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
function setCookie(cName, cValue, expDays) {
  let path = "; path=/"
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; path=/";
}

let url = window.location.pathname;
const userId = getCookie("uid");
let portalNum = url.split('/')[4]

if(userId){
  setCookie('portal', portalNum, 30);
}
const portalId = getCookie("portal");
const username = getCookie("username");



export function startWebSocket(){
  console.log("staring ws");

  //Creates socekt
    let socket = io('https://individualprojectm00725540.herokuapp.com/', {
        transports: ['websocket'],
        upgrade: false,
        reconnect:false,
        query: {
          userId: userId,
          portalId: portalId,
          username:username,
        }
    });
    

    document.addEventListener('keydown',(event)=>{
      let keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
      };
      switch (event.keyCode) {
        case 87: // w
        keys.forward = true;
          break;
        case 65: // a
        keys.left = true;
          break;
        case 83: // s
        keys.backward = true;
          break;
        case 68: // d
        keys.right = true;
          break;
        case 32: // SPACE 
        keys.space = true;
          break;
        case 16: // SHIFT
        keys.shift = true;
          break;
      }
      socket.emit("keysHeld",keys);     
      } ,false);

      //Handles on chat event
      socket.on('chat', function(msg,playerName,playerId){
        const e = document.createElement('div');
        e.className = 'meesage';
        e.innerText = playerId+playerName+": "+msg;
        e.style = "color:white;"
        document.getElementById('chat-ui-text-area').insertBefore(e, document.getElementById('chat-input')); 
      });


    // gets input chat
    let chatElement_ = document.getElementById("chat-input");
    chatElement_.addEventListener('keydown', (e) => OnChat_(e),false);
    function OnChat_(e){
      if(e.keyCode == 13){
        e.preventDefault();
        const msg = chatElement_.value;
        if(msg != ''){
          socket.emit('chatmsg',msg );
        }
        chatElement_.value = '';
      }
  }
  // video
  const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = false;
var peer = new Peer(userId, {
  host: "individualprojectm00725540.herokuapp.com",
  secure:'true',
  path: "/peerjs",
  port: "443",
});
  peer.on("open", (id) => {
    console.log("emiting from frontnern");
    socket.emit("join-room", portalId, id, username);
  });  
let myVideoStream;
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);

      peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });

  const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };



  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(video);
    });
  };

    
    return socket;
}

