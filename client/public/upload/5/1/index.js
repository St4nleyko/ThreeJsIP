import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import 'https://cdn.jsdelivr.net/npm/socket.io-client@3.1.0/dist/socket.io.js';
import 'https://code.jquery.com/jquery-3.6.0.min.js';
import {BasicWorldDemo} from './worlds/test.js';
var  _APP = null;




//load world
class LoadLobby {
  constructor() {
    this._Initialize();
  }
  _Initialize() {

    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 0.1;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 4.0);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    // load skybox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/posx.jpg',
        './resources/negx.jpg',
        './resources/posy.jpg',
        './resources/negy.jpg',
        './resources/posz.jpg',
        './resources/negz.jpg',
    ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x202020,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._mixers = [];
    this._previousRAF = null;
    this.socket_=socket;         
      this.socket_.on('keypressed', (keys)=> {
      switch (true) {
        case keys.forward: // w
        this.mainPlayer.position.z +=1;
        break;
        case keys.left: // a
        this.mainPlayer.position.x +=1;
        break;
        case keys.backward: // s
        this.mainPlayer.position.z -=1;
        break;
        case keys.right: // d
        this.mainPlayer.position.x -=1;
        break;
        case 38: // up
        case 37: // left
        case 40: // down
        case 39: // right
          break;
      }     
      //sends socket named pos and sends array of position rewriting initial pos in backend
      this.socket_.emit('pos',this.mainPlayer.position.toArray());
    }  ,false);
      //integrate socketio
      this.players_={};
      this.mainPlayer=null;

      
    console.log(socket)
    this.modeloader = new FBXLoader();
    this.portalLoader = new GLTFLoader();
    //had to change controls  
    this.socket_.on('pos',(d) =>  { 
      const [id, playerName, pos, portal ] = d;
      // console.log(...d+'a');

      if (!(id in this.players_)){
        this.modeloader.setPath('./resources/zombie/');
        this.modeloader.load('mremireh_o_desbiens.fbx', (fbx) => {
          fbx.scale.setScalar(0.1);
          fbx.traverse(c => {
            c.castShadow = true;
          });
          fbx.position.set(...d);
          //tu sa mi nemeni pozicia na socket change
          this._scene.add(fbx);
          this.players_[id] = fbx;

          if(!this.mainPlayer){
            this.mainPlayer = fbx;
         }
        this.players_[id].position.set(...pos);
        const anim = new FBXLoader();
        
        anim.setPath('./resources/zombie/');
        anim.load('idle.fbx', (anim) => {
          const m = new THREE.AnimationMixer(fbx);
          this._mixers.push(m);
          const idle = m.clipAction(anim.animations[0]);
          idle.play();
          });

        });


     }     



    });

    this.socket_.on('chat', function(msg,playerName,playerId){
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
    this.chatElement_ = document.getElementById("chat-input");
    this.chatElement_.addEventListener(
      'keydown', (e) => this.OnChat_(e),false);

    //send just id of character and load it locally
    
    this._RAF();

  }

OnChat_(e){
  if(e.keyCode == 13){
    e.preventDefault();
    const msg = this.chatElement_.value;
    if(msg != ''){
      this.socket_.emit('chat',msg );
    }
    this.chatElement_.value = '';
  }
}

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    }
    this._controls = new BasicCharacterController(params);
  }

  _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }

  _LoadModel() {
    const loader = new GLTFLoader();
    loader.load('./resources/thing.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });
      this._scene.add(gltf.scene);
    });
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }
}
if(_APP == null){
window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadLobby();
});
}
