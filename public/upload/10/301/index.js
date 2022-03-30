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
