module.exports = (sequelize, Sequelize) => {
  const Participation = sequelize.define(
    "participating_in",
    {
      participation_key: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.INTEGER,
      },
      displayed_mood: {
        type: Sequelize.STRING,
      },
      displayed_emotion: {
        type: Sequelize.STRING,
      },
      felt_mood: {
        type: Sequelize.STRING,
      },
      felt_emotion: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: "participating_in",
    }
  );

  return Participation;
};
