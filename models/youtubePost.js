const Sequelize = require("sequelize");

module.exports = sequelize.define("youtubeVideo", {
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
	video_id: Sequelize.STRING(100),
	post_date: Sequelize.STRING(100)
})