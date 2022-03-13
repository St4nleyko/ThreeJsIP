const { authJwt } = require("../middleware");
const controller = require("../controllers/userController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/getuser",
    [authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser],
    controller.loggedInUser
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isCreator],
    controller.creatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/getuserlist",
    [authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser],
    controller.getAllUsers
  );
  app.get("/api/getuserprofile/:userid",
  [
   authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
  ],
  controller.getUserFriends
  );
  app.put("/api/updateuserdata/:userid",
  [
   authJwt.verifyToken, authJwt.isCreatorOrAdminOrUser
  ],
  controller.updateUserData
  );
};
