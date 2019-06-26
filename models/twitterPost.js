const Sequelize = require("sequelize");

module.exports = sequelize.define("twitterPost", {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey:true
	},
	artistId: {
		type: Sequelize.INTEGER(11),
		allowNull:false,
	},
	html: Sequelize.STRING(10000),
	twitter_id: Sequelize.STRING(100),
	url: Sequelize.STRING(100),
	twitter_user_name:Sequelize.STRING(100),
	post_date: Sequelize.STRING(100)
})