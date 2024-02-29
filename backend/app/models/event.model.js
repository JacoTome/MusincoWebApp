module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define(
    "musical_event",
    {
      event_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: "musical_event",
    }
  );
  return Event;
};
