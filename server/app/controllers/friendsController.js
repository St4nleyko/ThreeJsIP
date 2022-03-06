const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Friend = db.friends;

  exports.getMyFriends = (req, res) => {
    let userid = req.params.userid;

    User.findOne({
        where: {
            id: userid,
        },
        include: [{
          model:  db.user, as: "friends",
          attributes: {
            exclude: ['password','createdAt','updatedAt']
        },
          // through: {
          //   where: {
          //     accepted: 1
          //   }
          // }
        }]
        
    })
    .then(data => {
        res.send(data.friends);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
  };
  
  exports.searchUsers = (req, res) => {
    let query = req.params.query;

    User.findAll({
      limit: 5,
      where: {
          username: {
              [Op.like]: '%' + query + '%'
          }
      }
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


  exports.getUsersFriends = (req, res) => {
    let userid = req.params.userid;
    
    User.findOne({
        where: {
            id: userid,
        },
        include: [{
          model:  db.user, as: "userFriends",
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
        res.send(data.userFriends);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
  };

  exports.getFriendRequests = (req, res) => {
    let userid = req.params.userid;
    Friend.findAll({
      where: {
        friend_id: userid,
        accepted:0
      },    
    })
    .then(data => {
        let requestsArr=[]
        data.forEach(freq => {
          requestsArr.push(freq.user_id)      
        });
        User.findAll({
          where: {
              id: requestsArr
          }
        }).then(user => {
          res.send(200,user)
        })

      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      });
  };
  
  exports.saveFriendRequest = (req, res) => {
    Friend.create({
      user_id: req.body.user_id,
      friend_id: req.body.friend_id,
      accepted: 0,
    })
    .then(data => {
      res.send({ message: "Friend request sent" });    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };


  exports.acceptFriendRequest = (req, res) => {
    let userid = req.body.user_id; // toto som ja neexistuje moj row 
    let friendid = req.body.friend_id; //posielatel uz existuje posielatel-prijmatel accept 0
    Friend.create({
      user_id: userid,
      friend_id: friendid,
      accepted: 1,
    })
    .then(data => {
      Friend.update(
        {
          accepted:1 
        },
        {
          where: {
            user_id: friendid,
            friend_id: userid,
            } 
          }
      )
    })
    .then(data => {
      res.send({ message: "Friend request accepted" });    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };


  exports.cancelFriendRequest = (req, res) => {
    let userid = req.body.user_id;
    let friendid = req.body.friend_id;
    console.log(userid+'canceling'+friendid)
    Friend.destroy({
      where: {
        user_id:userid,
        friend_id:friendid
      }
    })
    .then(data => {
      res.send({ message: "Friend request canceled" });    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

  exports.declineFriendRequest = (req, res) => {
    let userid = req.body.user_id;
    let friendid = req.body.friend_id;
    console.log(userid+'canceling'+friendid)
    Friend.destroy({
      where: {
        user_id:userid,
        friend_id:friendid
      }
    })
    .then(data => {
      res.send({ message: "Friend request declined" });    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

  exports.removeFriend = (req, res) => {
    let userid = req.body.user_id;
    let friendid = req.body.friend_id;
    console.log(userid+'canceling'+friendid)
    Friend.destroy({
      where: {
        user_id:userid,
        friend_id:friendid
      }
    })
    .then(data => {
      Friend.destroy({
        where: {
          user_id:friendid,
          friend_id:userid
        }
      })
      res.send({ message: "Friend removed" });    
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };
