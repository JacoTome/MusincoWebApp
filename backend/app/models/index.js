const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "mysql://squinkis:jaco@204.216.223.231:3306/musinco"
// );

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  dialectOptions: {
    connectTimeout: 20000,
  },
  //   operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.friend = require("../models/friend.model.js")(sequelize, Sequelize);
db.instrument = require("../models/instruments.model.js")(sequelize, Sequelize);
db.genre = require("../models/genre.model.js")(sequelize, Sequelize);
db.artist = require("../models/artist.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.participation = require("../models/participation.model.js")(
  sequelize,
  Sequelize
);
db.event = require("../models/event.model.js")(sequelize, Sequelize);
db.position = require("../models/position.model.js")(sequelize, Sequelize);
db.settings = require("../models/settings.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});
db.friend.belongsToMany(db.user, {
  through: "friendships",
});
db.instrument.belongsToMany(db.user, {
  through: "user_has_instrument",
});
db.user.belongsToMany(db.instrument, {
  through: "user_has_instrument",
});
db.genre.belongsToMany(db.user, {
  through: "user_plays_genre",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
