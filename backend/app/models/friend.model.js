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
        },
        {
            tableName: "friendships",
        }
    );

    return Friend;
}