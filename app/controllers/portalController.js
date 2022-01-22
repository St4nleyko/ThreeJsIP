const db = require("../models");
const User = db.user;
const Portal = db.portal;
const Op = db.Sequelize.Op;
var fs = require('fs');

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

  exports.create = (req, res) => {
    Portal.create({
        user_id: req.body.user_id,
        portal_name: req.body.name,
        description: req.body.description,
        portal_script: req.body.file,
      })
    .then(data => {
        res.send(data);
      })
            .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

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