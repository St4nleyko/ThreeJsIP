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
  const peer = new Peer();
    let myVideoStream;
    var videoGrid = document.getElementById('videoDiv')
    var myvideo = document.createElement('video');
    myvideo.muted = false;
    const peerConnections = {}
    
    navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    }).then((stream)=>{
      myVideoStream = stream;
      addVideo(myvideo , stream);
      peer.on('call' , call=>{
        call.answer(stream);
          const vid = document.createElement('video');
        call.on('stream' , userStream=>{
          addVideo(vid , userStream);
        })
        call.on('error' , (err)=>{
          alert(err)
        })
        call.on("close", () => {
            console.log(vid);
            vid.remove();
        })
        console.log('peers')
        console.log('peers'+peerConnections)
        peerConnections[call.peer] = call;
      })
    }).catch(err=>{
        alert(err.message)
    })
    peer.on('open' , (id)=>{
      socket.emit("newPeer" , id);
    })
    peer.on('error' , (err)=>{
      alert(err.type);
    });
    socket.on('peerJoined' , id=>{
      console.log("new user joined")
      const call  = peer.call(id , myVideoStream);
      const vid = document.createElement('video');
      call.on('error' , (err)=>{
        alert(err);
      })
      call.on('stream' , userStream=>{
        addVideo(vid , userStream);
      })
      call.on('close' , ()=>{
        vid.remove();
        console.log("user disconect")
      })
      peerConnections[id] = call;
    })
    socket.on('peerDisconnect' , id=>{
      if(peerConnections[id]){
        peerConnections[id].close();
      }
    })
    function addVideo(video , stream){
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      videoGrid.append(video);
    }
    
    return socket;
}

