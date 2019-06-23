'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.createTable("instagramPosts", {
         id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey:true
  },
  shortCode:Sequelize.STRING(20),
  likes:Sequelize.INTEGER(11),
  timestamp:Sequelize.INTEGER(11),
  html:Sequelize.STRING(10000),
  artistId: Sequelize.INTEGER(11),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
     })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable("instagramPosts");
  }
};


