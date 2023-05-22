import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { Todos } from "../models/todos";
import { Users } from "../models/users";

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  logging: false,
  // timezone: "Asia/Seoul",
  models: [Todos, Users],
});

export default connection;
