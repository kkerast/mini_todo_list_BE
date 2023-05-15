const express = require("express");
const authos_router = express.Router();

//회원가입 API
authos_router.post("/signup", async (req, res, next) => {
  return res.status(200).json({ message: "회원가입 성공" });
});

//회원정보 불러오기  api
authos_router.get("/auth", async (req, res, next) => {
  return res.status(200).json({ message: "회원정보 불러오기" });
});

//로그인 API
authos_router.post("/login", async (req, res, next) => {
  return res.status(200).json({ message: "로그인 성공" });
});

//로그아웃 API
authos_router.post("/logout", async (req, res, next) => {
  return res.status(200).json({ message: "로그아웃 성공" });
});

module.exports = authos_router;
