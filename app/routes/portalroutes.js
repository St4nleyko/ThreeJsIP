const { authJwt } = require("../middleware");
const controller = require("../controllers/portalController");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get("/api/getallportals/:userid", controller.findAll);
    app.get("/api/getuserportal/:userid", controller.findViaUser);
    app.post("/api/saveportal/", controller.create);
    // app.post("/api/saveportalfile/", controller.createPortalFile);
    app.post("/api/deleteportal/", controller.delete);
    // app.post("/api/removeportalfile/", controller.deleteFile);
};