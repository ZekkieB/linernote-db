const Sequelize = require("sequelize");

module.exports = sequelize.define("user", {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey:true
	},
	email: {
		type: Sequelize.STRING(100),
		allowNull:false,
		unique: true
	},
	token: {
		type: Sequelize.STRING(120),
		allowNull:false,
		unique: true,
	},
	refresh_token: {
		type: Sequelize.STRING(120),
		allowNull: false,
		unique: true
	}

})