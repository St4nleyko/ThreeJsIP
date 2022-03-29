const db = require("../models");
const User = db.user;
const Friend = db.friends;
const Portal = db.portal;
var bcrypt = require("bcryptjs");
var fs = require('fs');
const fsExtra = require('fs-extra')

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.send(200, {"user": true})
    // res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
   
    res.status(200).send("Admin Content.");
  };
  
  exports.creatorBoard = (req, res) => {
    res.send(200, {"creator": true})

    // res.status(200).send("Creator Content.");
  };
  exports.loggedInUser = (req, res) => {
    User.findByPk(req.userId)
    .then(data => {
      res.send(200,
        {
          "userID":data.id,
          "email":data.email,
          "username":data.username
      }) 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
  };

  exports.getAllUsers = (req, res) => {
    User.findAll({
      attributes: {
        exclude: ['password','createdAt','updatedAt']
      }
    })
    .then(data => {
      res.send(200,data) 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
  };

  exports.updateUserData = (req, res) => {
    let userid = req.params.userid;
    let fileName = req.body.filename;
    let file = req.body.fileData;
    if(file){
      file = file.split(';base64,').pop();
    }
    User.update(
      {
        password:bcrypt.hashSync(req.body.password,8),
        profile_picture:fileName
      },
      {
        where: {
          id: userid,
        },
      }
    )
    .then(function(user) {
      if(file){
        let pathToProfilePicture = "../public/upload/profilepics/"+userid+"/";
        console.log(pathToProfilePicture+fileName)
        if(!fs.existsSync(pathToProfilePicture))
        {
          fs.mkdirSync(pathToProfilePicture, { recursive: true });  
          fs.writeFile(pathToProfilePicture+fileName, file, {encoding: 'base64'}, function(err) {
            console.log('Profile pic updated');
          });
        }
        else{
          fsExtra.emptyDirSync(pathToProfilePicture)
          fs.writeFile(pathToProfilePicture+fileName, file, {encoding: 'base64'}, function(err) {
            console.log('Profile pic updated');
          });
        }
      }
      res.json(user)
    })
    
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
  };
  
  exports.getUserFriends = (req, res) => {
    let userid = req.params.userid;

    User.findOne({
        attributes: {
          exclude: ['password','createdAt','updatedAt']
        },
        where: {
            id: userid,
        },
        include: [
          {
            model:  db.user, as: "userFriends",
            attributes: {
              exclude: ['password','createdAt','updatedAt']
            },
          },
          {
            model:  db.user, as: "friends",
            attributes: {
              exclude: ['password','createdAt','updatedAt']
            },
          },
            
          {
            model:  Portal,
          }
        
      ]
        
    })
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
  };
