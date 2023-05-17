"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1. Todos 모델에서
      this.belongsTo(models.User, {
        // 2. User 모델에게 N:1 관계 설정을 합니다.
        targetKey: "userId", // 3. User 모델의 userId 컬럼을
        foreignKey: "userId", // 4. Todos 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }
  Todos.init(
    {
      todoId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userId",
        },
        //onUpdate: "CASCADE",
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      doneAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      done: {
        type: DataTypes.BOOLEAN,
      },
    },

    {
      sequelize,
      modelName: "Todos",
    }
  );
  return Todos;
};
