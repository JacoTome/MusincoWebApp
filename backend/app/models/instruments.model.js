module.exports = (sequelize, Sequelize) => {
  const Instrument = sequelize.define(
    "instruments",
    {
      instrument_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      instrument_name: {
        type: Sequelize.STRING,
      },
      manufacturer: {
        type: Sequelize.STRING,
      },
      year_of_manufacture: {
        type: Sequelize.INTEGER,
      },
    },
    {
      tableName: "instruments",
      createdAt: false,
      updatedAt: false,
    }
  );

  return Instrument;
};
