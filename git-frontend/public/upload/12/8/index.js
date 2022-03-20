import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import 'https://cdn.jsdelivr.net/npm/socket.io-client@3.1.0/dist/socket.io.js';
import 'https://code.jquery.com/jquery-3.6.0.min.js';

var  _APP = null;



//load world
class LoadLobby {
  socket_;

  constructor(socket) {
    this.socket_ = socket;
    console.log("Starging load lobby");
    this._Initialize();
  }
  
  _Initialize() {   
    let d = document.getElementById('body') 
    console.log(d)
    let html = '<iframe width="100%" height="586" src="https://www.youtube.com/embed/B4-L2nfGcuE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    // d.appendChild(html)
      // d.appendChild(html);
      d.insertAdjacentHTML('beforeend',html)
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
        './resources/back.png',//back - posx
        './resources/front.png', //fron - negx
        './resources/top.png', // top-posy
        './resources/bottom.png', // bottom-negy
        './resources/left.png',//left-posz
        './resources/right.png', // right - negz
    ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x202020,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    // this._scene.add(plane);
    this.players_={};
    this.mainPlayer=null;
    this._mixers = [];
    this._previousRAF = null;
    //this.socket_=socket;
    
    
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
      if(this.mainPlayer.position){
      this.socket_.emit('position',this.mainPlayer.position.toArray());
      }
    }  ,false);

      
    this.modeloader = new FBXLoader();
    this.portalLoader = new GLTFLoader();

    this.socket_.on('position',(d) =>  { 
      const [id, playerName, pos, portal ] = d;
      if (!(id in this.players_)){
        this.modeloader.setPath('./resources/dancer/');
        this.modeloader.load('girl.fbx', (fbx) => {
          fbx.scale.setScalar(0.1);
          fbx.traverse(c => {
            c.castShadow = true;
          });

          this.players_[id] = fbx;
          this._scene.add(fbx);
          fbx.position.set(...d);
          this.players_[id].position.set(...pos);
   
          this.anim = new FBXLoader();
          this.anim.setPath('./resources/dancer/');
          this.anim.load('girl.fbx', (anim) => {
            const m = new THREE.AnimationMixer(fbx);
            this._mixers.push(m);
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
          });
        
          if(!this.mainPlayer){
            this.mainPlayer = fbx;
          }     
 
          this.fbx = fbx;

          });
          
      }
      // });
      this.players_[id].position.set(...pos);


    });
    this.socket_.on('removePlayer',(id) =>  { 
      this._scene.remove(this.players_[id]);
    });
   
    this._RAF();

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

export function init(socket){
  _APP = new LoadLobby(socket);
}

// if(_APP == null){
// window.addEventListener('DOMContentLoaded', () => {
//   _APP = new LoadLobby();
// });
//}
