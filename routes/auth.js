const express = require("express");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

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
  try {
    const { email, password } = req.body;
    //이메일 검증
    //password 검증

    const user = await Users.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      "miniproject_key_256"
    );
    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공" });
  } catch (error) {
    return res.json({ message: "로그인에 실패하였습니다." });
  }
});

//로그아웃 API
authos_router.post("/logout", async (req, res, next) => {
  return res.status(200).json({ message: "로그아웃 성공" });
});

module.exports = authos_router;
