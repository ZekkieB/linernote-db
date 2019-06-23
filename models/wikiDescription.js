const Sequelize = require("sequelize");

module.exports = sequelize.define("wikiDescription", {
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
	wiki_description: Sequelize.STRING(1000)
})