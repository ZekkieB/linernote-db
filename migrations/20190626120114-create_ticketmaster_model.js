'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ticketmasterEvents", {
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
    url: Sequelize.STRING(240),
    country: Sequelize.STRING(240),
    city: Sequelize.STRING(240),
    start_date: Sequelize.STRING(240),
    image: Sequelize.STRING(240),
    event_name: Sequelize.STRING(240),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ticketmasterEvents");
  }
};
