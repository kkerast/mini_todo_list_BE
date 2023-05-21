import express from "express";
import connection from "./db/config";
import { json, urlencoded } from "body-parser";
import todoRoutes from "./routes/todos";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", todoRoutes, authRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

connection
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.log("Err", err);
  });

app.listen(3000);
