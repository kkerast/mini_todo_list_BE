const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.set("port", process.env.PORT || 3000);
//const connect = require("./schemas/");
const { authosRouter, todosRouter } = require("./routes");
//connect();

app.use(express.json());
app.use(cookieParser);
app.use("/api", [authosRouter, todosRouter]);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
