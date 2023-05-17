const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);
const { authosRouter, todosRouter } = require("./routes");

app.use(express.json());

app.use("/api", [authosRouter, todosRouter]);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
