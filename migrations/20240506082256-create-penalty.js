/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('penalties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 1),
      },
      amountDividedBy2: {
        type: Sequelize.INTEGER,
      },
      amountDividedBy4: {
        type: Sequelize.INTEGER,
      },
      amountDividedBy6: {
        type: Sequelize.INTEGER,
      },
      resultPercent25: {
        type: Sequelize.INTEGER,
      },
      resultPercent50: {
        type: Sequelize.INTEGER,
      },
      resultPercent75: {
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      datePenalty: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('penalties');
  },
};
