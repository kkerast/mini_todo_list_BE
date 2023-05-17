const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const { tokenType, token } = authorization.split(" ");

    // # 403 Cookie가 존재하지 않을 경우
    if (!authorization) {
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }

    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    const decodedToken = jwt.verify(token, "miniproject_key_256");
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("authorization");
      return res
        .status(403)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie("authorization");
    return res.status(403).json({
      errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
    });
  }
};
