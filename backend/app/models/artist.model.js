const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Artist = sequelize.define(
    "artist",
    {
      artist_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_name: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "artist",
    }
  );

  return Artist;
};
