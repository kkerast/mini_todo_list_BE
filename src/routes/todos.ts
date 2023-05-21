import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";

import {
  getAllToDo,
  createToDo,
  deleteToDo,
  finishToDo,
  getTodoById,
  updateToDo,
  getFinishedToDo,
} from "../controller/todos";

const router = Router();

router.get("/todo", authMiddleware, getAllToDo);
router.post("/todo", authMiddleware, createToDo);
router.delete("/todo/:id", authMiddleware, deleteToDo);
router.patch("/todo/:id", authMiddleware, finishToDo);
router.get("/detail/:id", authMiddleware, getTodoById);
router.put("/detail/:id", authMiddleware, updateToDo);
router.get("/", authMiddleware, getFinishedToDo);

export default router;
