module.exports = (sequelize, Sequelize) => {
  const Position = sequelize.define(
    "position",
    {
      position_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },

    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: "position",
    }
  );
  return Position;
};
