import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Todos from "./todos";

@Table({
  timestamps: false,
  tableName: "users",
})
export class Users extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  nickname!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  age!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: string;

  @HasMany(() => Todos)
  todos!: Todos[];
}

export default Users;
