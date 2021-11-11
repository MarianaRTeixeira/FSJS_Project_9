'use strict'
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) =>{
    class User extends Model { };
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please provide a valid first name'
                },
                notEmpty: {
                  msg: 'The first name is required to complete the registration'
                }
              }
           
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Please provide a valid last name'
                },
                notEmpty: {
                  msg: 'The last name is required to complete the registration'
                }
              }
        }, 
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'That email is already in use'
            },
            validate: {
                notNull: {
                  msg: 'Please provide a valid email address'
                },
                notEmpty: {
                  msg: 'The email is required to complete the registration'
                }
              } 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
              }, 
              validate: {
                notEmpty: {
                msg: 'Choose a password to complete the registration'
                }, 
                notNull: {
                  msg: 'Please provide a password'
                }  
            }
        }


    }, { sequelize , modelName: 'User'});
    
     // define association here
     User.associate = (models) => {
      User.hasMany(models.Courses, {
          as: 'user',
          foreignKey: {
              fieldName: 'userId',
              allowNull: false
          }
      })
  };

  return User;

}
