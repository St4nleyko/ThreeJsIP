const db = require("../models");
const User = db.user;
const Friend = db.friends;
const Portal = db.portal;

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
