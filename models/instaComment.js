const Sequelize = require("sequelize")

module.exports = sequelize.define("instaComment", {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey:true,
	},
	content: Sequelize.STRING(300),
	createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
})