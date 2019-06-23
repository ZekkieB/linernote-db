const Sequelize = require("sequelize");

module.exports = sequelize.define("userFollow",{
	userId: Sequelize.INTEGER(11),
	artistId: Sequelize.INTEGER(11)
});