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
//find all portals
exports.findAll = (req, res) => {
    Portal.findAll().then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
  };


  exports.create = (req, res, next) => {
    // //add update and delete later


    Portal.create({
        user_id: req.body.user_id,
        portal_name: req.body.name,
        description: req.body.description,
        portal_script: req.body.filename,
      })
      .then(data => {
        var finishSavingFile = new Promise((resolve, reject) => {
          let path = "../client/public/upload/"+req.body.user_id+"/"+data.id+"/";
          let portalPath = "../client/views/portals/";
          let portalFile = portalFile(req.body.user_id,data.id);
          console.log(portalFile(req.body.user_id,data.id))
          let file = req.body.file;
          file = file.split(';base64,').pop();
          if(!fs.existsSync(path))
          {
            fs.mkdirSync(path, { recursive: true });  
            fs.writeFile(path+req.body.filename, file, {encoding: 'base64'}, function(err) {
              console.log('File created');
            });
          }
          if(!fs.existsSync(portalPath))
          {
            fs.mkdirSync(portalPath, { recursive: true });  
            fs.writeFile(portalPath+req.body.filename, portalFile, function(err) {
              console.log('File created');
            });
          }
          resolve(path);
        });
        finishSavingFile.then(path => {
          unzipFunction(path,req.body.filename);  
        }, 
        reason => {
          console.error(reason); // Error!
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
function portalFile(user_id,portal_id){
  let file="asd "+user_id+"dsa"+portal_id;
  return file;

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