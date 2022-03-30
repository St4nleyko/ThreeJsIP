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
    // let socket = io('https://individualprojectm00725540.herokuapp.com/', {
    let socket = io('ws://localhost:8080/', {
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
        const e = document.createElement('p');
        const chatui = document.getElementById('chat-ui-text-area');
        e.className = 'message';
        e.innerText = "("+playerId+") "+playerName+": "+msg;
        chatui.insertBefore(e, document.getElementById('chat-input'));
        $('#ui').scrollTop($('#ui')[0].scrollHeight);
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
  const peers = {}

  socket.on('camera-connected',id =>{
    console.log('camera with userid' +id)
  })

  var myPeer = new Peer(userId,{
    host:'localhost',
    path:'/myapp',
    port:9000,
    secure:false
  });



  let myVideoStream;
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(myVideo, stream)
  
    myPeer.on('call', function(call) {
      const answerCall = confirm("Do you want to answer?")

      console.log('receiveng call')
      if(answerCall){
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        setTimeout(addVideoStream,2000, video, userVideoStream)
      })
    }
    })
  
    socket.on('user-connected', id => {
      if(id!=myPeer.id){
        setTimeout(connectToNewUser,2000,id,stream)      
      }    
    })
  })
  
  socket.on('user-disconnected', id => {
    if (peers[id]) peers[id].close()
  })
  
  
  function connectToNewUser(id, stream) {
    console.log('calling new user with ID '+id)
    const call = myPeer.call(id, stream)

    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      setTimeout(addVideoStream,2000, video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
    peers[id] = call

  }
  myPeer.on("open", (id) => {
    console.log("emiting from frontend");
    socket.emit("join-room", id);
  }); 
  function addVideoStream(video, stream) {
    video.srcObject = stream
    myVideoStream=stream;

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
  $("#muteBtn").click(function() {
    muteMyself()
  });
  $("#hideBtn").click(function() {
    if($("#hideBtn > i").hasClass("fa-solid fa-arrows-up-to-line")){
      $("#hideBtn > i").attr("class","fa-solid fa-arrows-down-to-line")
    }
    else{
      $("#hideBtn > i").attr("class","fa-solid fa-arrows-up-to-line")
    }
    
    $("#video-grid").toggle(1000)
  });

  function muteMyself(){
    if($("#muteBtn > i").hasClass("fa-solid fa-microphone")){
      $("#muteBtn > i").attr("class","fa-solid fa-microphone-slash")
    }
    else{
      $("#muteBtn > i").attr("class","fa-solid fa-microphone")
    }
    myVideoStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  }
  

    
    return socket;
}

