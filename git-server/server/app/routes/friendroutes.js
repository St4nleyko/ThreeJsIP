const { authJwt } = require("../middleware");
const controller = require("../controllers/friendsController");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get("/api/getmyfriendlist/:userid",
      [
       authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.getMyFriends
    );

    app.get("/api/getfriendlist/:userid",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.getUsersFriends
    );

    app.get("/api/getfriendrequests/:userid",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.getFriendRequests
    );

    app.post("/api/sendfriendrequest/",
      [
       authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.saveFriendRequest
    );

    app.post("/api/cancelfriendrequest/",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.cancelFriendRequest
    );

    app.post("/api/declinefriendrequest/",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.declineFriendRequest
    );

    app.post("/api/acceptfriendrequest/",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
        controller.acceptFriendRequest
    );

    app.post("/api/removefriend/",
      [
       authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.removeFriend
    );

    app.get("/api/searchusers/:query",
      [
        authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
      ],
      controller.searchUsers
    );
  

};