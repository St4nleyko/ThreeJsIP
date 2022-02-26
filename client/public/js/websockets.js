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
const userId = getCookie("uid");
const portalId = getCookie("portal");
const username = getCookie("username");
// console.log(window.location.pathname)
let url = window.location.pathname;
let portalNum = url.split('/')[5]
if(userId){
  setCookie('portal', portalNum, 30);
}


export function startWebSocket(){
  console.log("staring ws");

  //Creates socekt
    let socket = io('ws://localhost:3000/', {
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

      //Handles on event
      socket.on('chat', function(msg,playerName,playerId){
        const e = document.createElement('div');
        e.className = 'meesage';
        e.innerText = playerId+playerName+": "+msg;
        e.style = "color:white;"
        document.getElementById('chat-ui-text-area').insertBefore(e, document.getElementById('chat-input')); 
      });


    // gets input
    let chatElement_ = document.getElementById("chat-input");
    chatElement_.addEventListener('keydown', (e) => OnChat_(e),false);

    return socket;
}

//chat
function OnChat_(e){
    if(e.keyCode == 13){
      e.preventDefault();
      const msg = chatElement_.value;
      if(msg != ''){
        socket.emit('chat',msg );
      }
      chatElement_.value = '';
    }
}


// socket.on('chat', function(msg,playerName,playerId){
//     const e = document.createElement('div');
//     e.className = 'meesage';
//     e.innerText = playerId+playerName+": "+msg;
//     e.style = "color:white;"
//     document.getElementById('chat-ui-text-area').insertBefore(e, document.getElementById('chat-input')); 
// });


//   // gets input
//   let chatElement_ = document.getElementById("chat-input");
//   chatElement_.addEventListener('keydown', (e) => OnChat_(e),false);