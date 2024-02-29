const { authJwt } = require("../middleware");
const userController = require("../controllers/user.controller");
const publicController = require("../controllers/public.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    console.log(req.url);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", userController.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );

  app.get(
    "/api/users/:id/friends",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.userFriends
  );

  app.get(
    "/api/users/:id",
    [authJwt.verifyToken],
    /*
     * #swagger.tags = ['User']
     */
    userController.userInfo
  );

  app.get("/api/instruments/:id", publicController.getInstruments);

  app.get("/api/genres/:id", publicController.getGenres);

  app.get(
    "/api/suggestedUsers/:id",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.suggestedUser
  );

  app.get(
    "/api/hourmood/:id",
    [authJwt.verifyToken],
    publicController.getHourMood
  );

  app.get(
    "/api/users/:id/message/:chatID",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.userMessages
  );

  app.get(
    "/api/genremood/:id",
    [authJwt.verifyToken],
    publicController.getGenreMood
  );

  app.get(
    "/api/hourMoodGenre/:id",
    [authJwt.verifyToken],
    publicController.getHourMoodGenre
  );

  app.get(
    "/api/instrGenre/:id",
    [authJwt.verifyToken],
    publicController.instrGenre
  );

  app.get(
    "/api/users/:id/participation",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.userParticipation
  );

  app.get(
    "/api/users/:id/settings",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.userSettings
  );

  app.post(
    "/api/users/:id/settings",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.updateUserSettings
  );

  app.post(
    "/api/users/:id/resetMusPref",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.resetMusPreferences
  );

  app.post(
    "/api/users/:id/addfriend",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.addFriend
  );
  app.post(
    "/api/users/:id/acceptfriend",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.acceptFriend
  );
  app.get(
    "/api/users/:id/friendsRequest",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.userFriendRequestsList
  );
  app.get(
    "/api/users/:id/friendsRequestSent",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.pendingFriendRequests
  );
  app.get(
    "/api/event/search/:name",
    [authJwt.verifyToken],
    publicController.searchEvent
  );
  app.get(
    "/api/instruments/search/:name",
    [authJwt.verifyToken],
    publicController.searchInstrument
  );

  app.get(
    "/api/city/search/:name",
    [authJwt.verifyToken],
    publicController.searchCity
  );

  app.get(
    "/api/genres/search/:name",
    [authJwt.verifyToken],
    publicController.searchGenre
  );
  app.post(
    "/api/users/search",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.searchUser
  );
  app.post(
    "/api/users/:id",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.updateUserInfo
  );

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken],
    /**
     * #swagger.tags = ['User']
     */
    userController.deleteUserInfo
  );
};
