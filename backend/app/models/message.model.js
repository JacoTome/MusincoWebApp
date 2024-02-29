module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define(
    "chat_messages",
    {
      message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message_content: {
        type: Sequelize.STRING,
      },
      sender_id: {
        type: Sequelize.INTEGER,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
      },
      timestamp: {
        type: Sequelize.DATE,
      },
    },
    { createdAt: false, updatedAt: false, tableName: "chat_messages" }
  );
  return Message;
};
