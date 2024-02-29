module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define(
    "user_settings",
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      notification_enabled: {
        type: Sequelize.BOOLEAN,
      },
      language: {
        type: Sequelize.STRING,
      },
      timezone: {
        type: Sequelize.STRING,
      },
      email_notifications: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      tableName: "user_settings",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Settings;
};
