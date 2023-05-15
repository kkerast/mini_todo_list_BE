const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  todoId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  doneAt: {
    type: Date,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Todos", todoSchema);
