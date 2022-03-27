const db = require("../models");
const User = db.user;
const Portal = db.portal;
const Op = db.Sequelize.Op;
var fs = require('fs');
const Buffer = require('buffer').Buffer;
// const express = require('express');
// const fileUpload = require('express-fileupload');
// const app = express();
// app.use(fileUpload());
// app.use(express.static('public'));
const AdmZip = require('adm-zip');
const { unzip } = require("zlib");
const multer = require('multer');
const { nextTick } = require("process");
User.hasMany(Portal, {foreignKey:"user_id"});


exports.findAll = (req, res) => {
  const userid = req.params.userid;
  User.findOne({
    where: {
        id: userid,
    },
    include: [{
      model:  db.user, as: "friends",
      attributes: {
        exclude: ['password','createdAt','updatedAt']
    },
      through: {
        where: {
          accepted: 1
        }
      }
    }]
    
  })
  .then(data => {

    let friendsArr=[]
    data.friends.forEach(friend => {
      friendsArr.push(friend.id)      
    });
    friendsArr.push(userid)      

    console.log('friends:'+friendsArr)
    Portal.findAll({
      where: {
        user_id: friendsArr,
      },
    })
    .then(portal => {
      res.send(portal);
    })
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
};


  // Example call:
  exports.create = (req, res, next) => {
    // //add update and delete later
    Portal.create({
        user_id: req.body.user_id,
        portal_name: req.body.name,
        description: req.body.description,
        portal_file: req.body.filename,
      })
      .then(data => {
        var finishSavingFile = new Promise((resolve, reject) => {
          let path = "../ThreeJsIP/public/upload/"+req.body.user_id+"/"+data.id+"/";
          let file = req.body.file;
          file = file.split(';base64,').pop();
          if(!fs.existsSync(path))
          {
            fs.mkdirSync(path, { recursive: true });  
            fs.writeFile(path+req.body.filename, file, {encoding: 'base64'}, function(err) {
              console.log('File created');
            });
          }
          resolve(path);
        });
        finishSavingFile.then(path => {     
          unzipFunction(path,req.body.filename);
          createPortalScript(req.body.user_id,data.id)
        }, 
        reject => {
          console.error(reject); // Error!
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};
function unzipFunction(path,filename){
  setTimeout(function() {
    var resolve = require('path').resolve
    console.log('EXTRACTING')
    console.log(filename);
    let absPath = resolve(path);
    let absPathFile =  resolve(path+filename)
    console.log(absPathFile)

    const file = new AdmZip(absPathFile);
    file.extractAllTo(absPath);
  }, 5000)
}
function createPortalScript(userId,portalId){
  let portalPath = "../public/upload/"+userId+"/"+portalId+"/portal.html";
  setTimeout(function() {
  if(!fs.existsSync(portalPath))
    {
      fs.copyFile( "../ThreeJsIP/views/portal.html","../ThreeJsIP/public/upload/"+userId+"/"+portalId+"/portal.html", function(err) {
          console.log('portal created');
          fs.appendFile("../ThreeJsIP/public/upload/"+userId+"/"+portalId+"/portal.html", "<script id='world' class='world'  src='index.js' type='module'></script>", function (err) {
            if (err) throw err;
            console.log('Saved script tag!');
          });
        });
    }
  }, 6000)
}

// find all with userid
exports.findViaUser = (req, res) => {
  const userid = req.params.userid;
    Portal.findAll({
      where: {
        user_id: userid
      }
      })
        .then(data => {
          res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// find all with userid
exports.deleteFile = (req, res) => {
  const portalid = req.body.portal_id;
    Portal.destroy({
      where: {
        id: portalid
      }
      })
      .then(data => {
        var finishRemovingFile = new Promise((resolve, reject) => {
          let path = "../ThreeJsIP/public/upload/"+req.body.user_id+"/"+portalid+"/";
          console.log('removing file')     
          fs.rmSync(path, { recursive: true });  
          resolve(path);
        });
        finishRemovingFile.then(path => {
          console.log(path)     
          res.send(path);
        }, 
        reject => {
          console.error(reject); // Error!
        });
      })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};          
exports.delete = (req, res) => {
  const userid = req.body.user_id;
  const portalid = req.body.portal_id;
    Portal.destroy({
      where: {
        id: portalid
      }
    })
        .then(data => {
          res.send(data)
        })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}; 
