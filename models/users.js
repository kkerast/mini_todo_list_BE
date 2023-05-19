"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.hasMany(models.Todos, {
        // 2. Todos 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "userId", // 4. Posts 모델의 userId 컬럼과 연결합니다.
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true,
      },
      age: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
