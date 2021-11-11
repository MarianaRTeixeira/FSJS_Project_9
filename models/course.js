'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
  }

  Courses.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a valid title for the course",
          },
          notEmpty: {
            msg: "Please enter a title for the course",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a valid description for the course",
          },
          notEmpty: {
            msg: "Please provide a description for the course",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Courses',
    }
  );

  //Model Associations
  Courses.associate = (models) => {
    Courses.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId'
      }
    })
  };
  return Courses;
};