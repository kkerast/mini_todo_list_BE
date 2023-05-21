import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Users from "./users";

@Table({
  timestamps: false,
  tableName: "todos",
})
export class Todos extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  todoId!: number;

  @ForeignKey(() => Users)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  title!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  content!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  doneAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  done!: Boolean;

  @BelongsTo(() => Users)
  users!: Users;
}

export default Todos;
