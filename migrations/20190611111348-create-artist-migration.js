'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("artists", {
     id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey:true
    },
    name: Sequelize.STRING(150),
    website: Sequelize.STRING(150),
    spotify: Sequelize.STRING(150),
    youtube: Sequelize.STRING(150),
    soundcloud: Sequelize.STRING(150),
    facebook: Sequelize.STRING(150),
    instagram: Sequelize.STRING(150),
    ticketmaster: Sequelize.STRING(150),
    wikipedia: Sequelize.STRING(150),
    musicbrainz: Sequelize.STRING(150),
    pitchfork: Sequelize.STRING(150),
    genius: Sequelize.STRING(150),
    bandsintown: Sequelize.STRING(150),
    twitter: Sequelize.STRING(150),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
    })
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable("artists");
  }
};
