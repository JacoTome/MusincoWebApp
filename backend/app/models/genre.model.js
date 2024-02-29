module.exports = (sequelize, Sequelize) => {
  const Genre = sequelize.define(
    "genre",
    {
      genre_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      genre_name: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "genre",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Genre;
};
