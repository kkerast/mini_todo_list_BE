import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { Todos } from "../models/todos";
import { Users } from "../models/users";

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "Asia/Seoul",
  dialectOptions: {
    timezone: "local", // 추가됨.
  },
  logging: false,
  models: [Todos, Users],
});

export default connection;
