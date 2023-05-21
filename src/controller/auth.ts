import { RequestHandler } from "express";

import { Users } from "../models/users";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";

// @ 회원가입 api
export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, nickname, age } = req.body;

  try {
    // 닉네임으로 중복가입 여부 확인

    const isExistNick = await Users.findOne({
      where: { nickname: nickname },
    });
    if (isExistNick) {
      // 이미 해당 닉네임으로 가입했다면,
      res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
      return;
    }
    const isExistEmail = await Users.findOne({
      where: { email: email },
    });
    if (isExistEmail) {
      // 이미 해당 이메일로 가입했다면,
      res.status(412).json({ errorMessage: "중복된 이메일입니다." });
      return;
    }

    // 이메일 형식확인
    const emailCheck =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (!emailCheck.test(email)) {
      res
        .status(412)
        .json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
      return;
    }
    // 닉네임 형식확인: 알파벳 대소문자, 숫자, 4~20자
    const nickCheck = /^[0-9a-zA-Z_-]{4,20}$/;
    if (!nickCheck.test(nickname)) {
      res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 올바르지 않습니다." });
      return;
    }

    // 패스워드 형식 확인: 특수문자(@$!%*?&)의무포함, 알파벳 소문자 의무포함, 대문자 가능, 4~20자

    const pwCheck = /^(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,20}$/;

    if (!pwCheck.test(password)) {
      res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 올바르지 않습니다." });
      return;
    }
    // 패스워드가 닉네임 포함하는지 여부 확인
    if (password.includes(nickname)) {
      res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
      return;
    }
    const crypyedPw = crypto
      .createHash("sha512")
      .update(password)
      .digest("base64");
    let date = new Date();
    const koreantime = date.setHours(date.getHours() + 9);
    await Users.create({
      email,
      password: crypyedPw,
      nickname,
      age,
      createdAt: koreantime,
    });
    return res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    // 예상치 못한 에러 대응
    return res.status(400).json({ message: "요청이 올바르지 않습니다." });
  }
};

// ◎ 회원정보 불러오기  api
export const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const userInfo = await Users.findOne({
      attributes: ["email", "nickname", "age"],
      where: { userId: userId },
    });
    console.log(userInfo);
    return res.status(200).json({ userInfo: userInfo });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "회원정보 조회에 실패하였습니다." });
  }
};

// ◎ 로그인  api
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const crypyedPw = crypto
      .createHash("sha512")
      .update(password)
      .digest("base64");

    const user = await Users.findOne({ where: { email } });
    if (!user || user.password !== crypyedPw) {
      return res
        .status(412)
        .json({ errorMessage: "이메일 또는 패스워드를 확인해주세요." });
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
};

// ◎ 로그아웃  api
export const logout: RequestHandler = async (req, res, next) => {
  return res
    .cookie("authorization", "")
    .status(200)
    .json({ message: "로그아웃 성공" });
};
