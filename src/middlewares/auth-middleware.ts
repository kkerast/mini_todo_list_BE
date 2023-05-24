import { RequestHandler } from "express";
import { Users } from "../models/users";
// import jwt, { JwtPayload } from "jsonwebtoken";
import { INTEGER } from "sequelize";
const jwt = require("jsonwebtoken");

export const auth_router: RequestHandler = async (req, res, next) => {
  // try {

  const { authorization } = req.cookies;

  console.log(req.cookies);
  if (typeof authorization === "string") {
    const [tokenType, token] = authorization.split(" "); // 중괄호{} 를 대괄호[]로 수정
    // # 403 Cookie가 존재하지 않을 경우
    if (!authorization) {
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }
    if (tokenType !== "Bearer") {
      return res.status(401).json({
        errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
      });
    }

    const decodedToken = jwt.verify(token, "miniproject_key_256");
    const userId = decodedToken.userId;
    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("authorization");
      return res.status(403).json({
        errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.!",
      });
    }
    res.setHeader("Access-Control-Allow-origin", "*"); // 모든 출처(orogin)을 허용
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // 모든 HTTP 메서드 허용
    res.setHeader("Access-Control-Allow-Credentials", "true"); // 클라이언트와 서버 간에 쿠키 주고받기 허용
    res.locals.user = user;

    next();
    // } catch (error) {
    //   res.clearCookie("authorization");
    //   return res.status(403).json({
    //     authorization: "asdf",
    //     errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
    //   });
    // }
  } else {
    return res.status(403).json({
      errorMessage: "authorization 타입에 문제있습니다.",
      authorization: authorization,
    });
  }
};

export default auth_router;
