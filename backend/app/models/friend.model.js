module.exports = (sequelize, Sequelize) => {
  const Friend = sequelize.define(
    "friends",
    {
      friendship_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user1_id: {
        type: Sequelize.INTEGER,
      },
      user2_id: {
        type: Sequelize.INTEGER,
      },
      status_user1: {
        type: Sequelize.BOOLEAN,
      },
      status_user2: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      tableName: "friendships",
    }
  );

  return Friend;
};
