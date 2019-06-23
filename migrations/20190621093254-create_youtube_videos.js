'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable("youtubeVideos",{
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
    post_date: Sequelize.STRING(100),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
     })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("youtubeVideos");
  }
};
