const express = require("express");
const jwt = require("jsonwebtoken");
const { Users, UserInfos } = require("../models");
const authos_router = express.Router();

//회원가입 API
authos_router.post("/signup", async (req, res, next) => {
  const { email, password, nickname, age } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ email, password, nickname, age });

  return res.status(200).json({ message: "회원가입 성공" });
});

//회원정보 불러오기  api
authos_router.get("/auth", async (req, res, next) => {
  return res.status(200).json({ message: "회원정보 불러오기" });
});

//로그인 API
authos_router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res
      .status(401)
      .json({ message: "해당하는 사용자가 존재하지 않습니다." });
  } else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });
  }
  console.log(user);
  console.log(user.email);
  //jwt 생상
  //console.log("1: ", user.userId);
  const token = jwt.sign(
    {
      userId: user.email,
    },
    "customized_secret_key"
  );
  //console.log(token);
  //쿠키를 발급
  res.cookie("authorization", `Bearer ${token}`);
  //response 할당
  return res.status(200).json({ message: "로그인 성공" });
});

//로그아웃 API
authos_router.post("/logout", async (req, res, next) => {
  //cookie 삭제
  return res.cookie("user", "").status(200).json({ message: "로그아웃 성공" });
  return res.status(200).json({ message: "로그아웃 성공" });
});

module.exports = authos_router;
