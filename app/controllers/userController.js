const db = require("../models");
const User = db.user;

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
      res.status(200).send(data) 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
  };