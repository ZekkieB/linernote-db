'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable("wikiDescriptions", {
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
    wiki_description: Sequelize.STRING(1000),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
     }

     )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("wikiDescriptions")
  }
};
