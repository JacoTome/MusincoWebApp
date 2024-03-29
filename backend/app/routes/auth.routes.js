const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers", // TODO: check if this is needed
      "x-access-token, Origin, Content-Type, Accept",
      "Access.Control-Allow-Origin",
      "*"
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

  app.post("/api/auth/refresh", controller.refresh);

  app.post("/api/auth/signin", controller.signin);
};
