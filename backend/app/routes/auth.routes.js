const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const jenaController = require("../jena_auth/auth.controller");
const { authJena } = require("../jena_auth/checkSignUp");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers", // TODO: check if this is needed
      "x-access-token, Origin, Content-Type, Accept",
      "Access.Control-Allow-Origin", // TODO: check if this is needed
      "http://localhost:3000"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post(
    "/api/auth/jena/signup",
    [authJena.checkDuplicateUsernameOrEmail],
    jenaController.signup
  );

  app.post("/api/auth/jena/signin", jenaController.signin);
  app.post("/api/auth/refresh", controller.refresh);

  app.post("/api/auth/signin", controller.signin);
};
