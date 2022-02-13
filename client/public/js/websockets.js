//initial connection
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
  const userId = getCookie("uid");
  const portalId = getCookie("portal");
  const username = getCookie("username");


let socket = io('ws://localhost:3000', {
    transports: ['websocket'],
    reconnect:false,
    query: {
      userId: userId,
      portalId: portalId,
      username:username
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
socket.on('chat', function(msg,playerName,playerId){
    const e = document.createElement('div');

    e.className = 'meesage';
    e.innerText = playerId+playerName+": "+msg;
    if(msg == "change"){
      $('canvas').remove();
      _APP = new BasicWorldDemo();
      // $('.world' ).attr({
      //   src: './worlds/test.js',
      //   type: 'text/javascript'}).appendTo('.scriptLoader');
      }
    document.getElementById('chat-ui-text-area').insertBefore(e, document.getElementById('chat-input')); 
  })


  // gets input
  let chatElement_ = document.getElementById("chat-input");
  chatElement_.addEventListener(
    'keydown', (e) => OnChat_(e),false);