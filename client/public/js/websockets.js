
let socket_ = io('localhost:3000', {transports:['websocket']});
let players_={};
let mainPlayer=[];
document.addEventListener('keyup',(event)=>{
    switch (event.keyCode) {
      case 87: // w
      mainPlayer.position.z +=1;
        break;
      case 65: // a
      mainPlayer.position.x +=1;
      break;
      case 83: // s
      mainPlayer.position.z -=1;
      break;
      case 68: // d
      mainPlayer.position.x -=1;
      break;
      case 38: // up
      case 37: // left
      case 40: // down
      case 39: // right
        break;
    }
    // this.socket_.emit('playerName',playerName);
    
    //sends socket named pos and sends array of position rewriting initial pos in backend
    socket_.emit('pos',mainPlayer.position.toArray());
  }  ,false);
//position
let modeloader = new FBXLoader();
let portalLoader = new GLTFLoader();
//had to change controls  
socket_.on('pos',(d) =>  { 
  const [id, character, pos, portal ] = d;
  this.positionOfPlayer = d[2];

//   if (!(id in this.players_)){
    //  portalLoader.load('/client/public/upload/5/1/resources/thing.glb', (gltf) => {
    //   gltf.scene.traverse(c => {
    //     c.castShadow = true;
    //   });
    //   gltf.scene.position.set(Math.random() * 20,0,40);
    //   this._scene.add(gltf.scene);
    //   this.portalId = portal;

    //   this.positionOfPortal = gltf.scene.position; 
    //   // debugger;

    // });
//     modeloader.setPath('/client/public/upload/5/1/resources/zombie/');
//     modeloader.load('mremireh_o_desbiens.fbx', (fbx) => {
//       fbx.scale.setScalar(0.1);
//       fbx.traverse(c => {
//         c.castShadow = true;
//       });
//       fbx.position.set(...d);
//       this._scene.add(fbx);
//       this.players_[id] = fbx;

//       if(!this.mainPlayer){
//         this.mainPlayer = fbx;
//      }
//     this.players_[id].position.set(...pos);
//     const anim = new FBXLoader();
    
//     anim.setPath('/client/public/upload/5/1/resources/zombie/');
//     anim.load('idle.fbx', (anim) => {
//       const m = new THREE.AnimationMixer(fbx);
//       this._mixers.push(m);
//       const idle = m.clipAction(anim.animations[0]);
//       idle.play();
//       });

//     });


//  }
 console.log("portal X "+parseInt(this.positionOfPortal.x, 10));
 console.log("portal z "+parseInt(this.positionOfPortal.z, 10));
 console.log("player x "+parseInt(this.positionOfPlayer[0], 10));
 console.log("player z "+parseInt(this.positionOfPlayer[2], 10));
 let portalX = parseInt(this.positionOfPortal.x, 10);
 let portalZ = parseInt(this.positionOfPortal.z, 10);
 let playerX = parseInt(this.positionOfPlayer[0], 10);
 let playerZ = parseInt(this.positionOfPlayer[2], 10);
 

 if(portalX == playerX && portalZ == playerZ){
  $('canvas').remove();
  _APP = new BasicWorldDemo();
 }


});
//chat
function OnChat_(e){
    if(e.keyCode == 13){
      e.preventDefault();
      const msg = chatElement_.value;
      if(msg != ''){
        socket_.emit('chat',msg );
      }
      chatElement_.value = '';
    }
  }
socket_.on('chat', function(msg,playerName,playerId){
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


  //gets input
  let chatElement_ = document.getElementById("chat-input");
  chatElement_.addEventListener(
    'keydown', (e) => OnChat_(e),false);