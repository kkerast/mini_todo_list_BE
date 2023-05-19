const express = require("express");
const todos_router = express.Router();

// ◎ Todo 리스트 조회 API
todos_router.get("/todo", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 리스트" });
});

// ◎ Todo 리스트 추가 API
todos_router.post("/todo", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 리스트 추가" });
});

// ◎ Todo 할일 삭제 API
todos_router.delete("/todo/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 리스트 삭제" });
});

// ◎ Todo 할일 완료하기 API
todos_router.patch("/todo/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 할일 완료하기" });
});

// ◎ Todo 할일 상세보기 API
todos_router.post("/detail/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 할일 상세보기" });
});

// ◎ Todo 할일 수정하기 API
todos_router.put("/detail/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 할일 수정하기" });
});

// ◎ Todo 완료페이지 완료리스트 API
todos_router.get("/", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 완료리스트" });
});

// ◎ Todo 완료페이지 취소 API
todos_router.post("/cancel/:id", async (req, res, next) => {
  return res.status(200).json({ message: "Todo 취소" });
});

module.exports = todos_router;
