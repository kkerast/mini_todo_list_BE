const express = require("express");
const todos_router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Todo } = require("../models");
const { Op } = require("sequelize");
//Todo 리스트 조회 API
todos_router.get("/todo", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 리스트" });
});

//Todo 리스트 추가 API
todos_router.post("/todo", authMiddleware, async (req, res, next) => {
  console.log(res.locals);
  console.log(res.locals.user);
  const { email } = res.locals.user;
  const { title, content, date } = req.body;

  const todo_add = await Todo.create({
    email: email,
    title,
    content,
    date,
  });
  console.log(todo_add);
  return res.status(200).json({ message: "Todo 리스트 추가" });
});

//Todo 할일 삭제 API
todos_router.delete("/todo/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 리스트 삭제" });
});

//Todo 할일 완료하기 API
todos_router.patch("/todo/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 할일 완료하기" });
});

//Todo 할일 상세보기 API
todos_router.post("/detail/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 할일 상세보기" });
});

//Todo 할일 수정하기 API
todos_router.put("/detail/:id", async (req, res, next) => {
  const { userId } = res.locals.user;
  const { id } = req.params;
  const { title, content, date } = req.body;

  // id값으로 찾은 Todos의 userId가 로그인한 userId와 같은지 확인
  const todo = await Todo.findOne({ where: { id } });
  if (todo.userId !== userId) {
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  }

  await Posts.update(
    { title, content, date },
    {
      where: {
        [Op.and]: [{ id }],
      },
    }
  );

  return res.status(200).json({ message: "Todo 할일 수정하기" });
});

//Todo 완료페이지 완료리스트 API
todos_router.get("/", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 완료리스트" });
});

//Todo 완료페이지 취소 API
todos_router.post("/cancel/:id", async (req, res, next) => {
  const { id } = req.params;
  const todo_cancel = await Todo.update({ done: false }, { where: { id: id } });
  console.log(todo_cancel);
  return res.status(200).json({ message: "Todo 취소" });
});

module.exports = todos_router;
