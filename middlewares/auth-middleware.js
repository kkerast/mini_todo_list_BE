const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  console.log("0 :", req.cookies);
  const { authorization } = req.cookies;
  console.log("1 :", authorization);
  const [tokenType, token] = (authorization ?? "").split(" ");

  //console.log("1-1 :", tokenType, token);
  if (tokenType !== "Bearer" || !token) {
    return res.status(401).json({
      message: "토큰 타입이 일치하지 않거나 토큰이 존재하지 않습니다.",
    });
  }
  //console.log("1-2 :", tokenType, token);
  try {
    const decodedToken = jwt.verify(token, "customized_secret_key");
    //console.log("1-3 :", decodedToken);
    const userId = decodedToken.userId;
    //console.log("1-4 :", userId);
    const user = await Users.findOne({ where: { userId } });
    //console.log("1-5 :", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "토큰에 해당하는 사용자가 존재하지 않습니다," });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "비정상적인 접근입니다." });
  }
};
