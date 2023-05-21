import { RequestHandler } from "express";

import { Todos } from "../models/todos";
import { Users } from "../models/users";
// const { Todos, Users } = require("../models");

// ◎ Todo 리스트 조회 API
export const getAllToDo: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const todoAll = await Todos.findAll({
      attributes: [
        "todoId",
        "title",
        "content",
        "done",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
      where: { userId },
    })
      .then(function (results) {
        console.log(results);
        return res.status(200).json({ todoList: results });
      })
      .catch((error) => {
        throw new error();
      });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
};

// ◎ Todo 리스트 추가 API
export const createToDo: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    if (typeof title !== "string" || title === "") {
      return res.status(412).json({ message: "제목을 확인해 주세요" });
    }
    if (typeof content !== "string" || content === "") {
      return res.status(412).json({ message: "작성 내용을 확인해 주세요" });
    }
    let date = new Date();
    const koreantime = date.setHours(date.getHours() + 9);
    const todo = await Todos.create({
      userId: userId,
      title,
      content,
      done: false,
      createdAt: koreantime,
      updatedAt: koreantime,
    });
    res.status(201).json({ data: todo, message: "Todo 리스트 추가 성공" });
  } catch (error) {
    res.status(400).json({ message: "게시글 등록 실패" });
    console.error(error);
  }
};

// ◎ Todo 할일 삭제 API
export const deleteToDo: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; //Todos.todoId
    const { userId } = res.locals.user; //Users.userId

    const existTodo = await Todos.findOne({
      where: { todoId: id },
    });

    if (!existTodo) {
      return res.status(404).json({ message: "할일 존재하지 않습니다." });
    }

    if (existTodo.userId !== userId) {
      // 문제있음
      return res
        .status(403)
        .json({ message: "할일의 삭제 권한이 존재하지 않습니다." });
    }

    await Todos.destroy({
      where: { todoId: id, userId: userId },
    })
      .then(() => {
        return res.status(200).json({ message: "게시글을 삭제하였습니다." });
      })
      .catch(() => {
        return res.status(401).json({ message: "할일 삭제에 실패하였습니다." });
      });
    // return res.status(200).json({ message: "Todo 리스트 삭제" });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "할일 삭제에 실패하였습니다." });
  }
};

// ◎ Todo 할일 완료하기 API
export const finishToDo: RequestHandler = async (req, res, next) => {
  const { userId } = res.locals.user;
  const { id } = req.params;

  try {
    const targetTodo = await Todos.findOne({
      where: { todoId: id },
    });

    if (!targetTodo) {
      return res
        .status(412)
        .json({ message: "완료/취소할 할일이 존재하지 않습니다." });
    } else if (targetTodo.userId !== userId) {
      return res
        .status(412)
        .json({ message: "완료/취소 권한이 존재하지 않습니다." });
    } else if (targetTodo.userId === userId) {
      let date = new Date();
      const koreantime = date.setHours(date.getHours() + 9);
      await Todos.update(
        { done: !targetTodo.done, doneAt: koreantime },
        { where: { todoId: id } }
      );

      return res.status(200).json({ message: "완료/취소 성공!" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "완료/취소에 실패하였습니다." });
  }
};

// ◎ Todo 할일 상세보기 API
export const getTodoById: RequestHandler = async (req, res, next) => {
  const { userId } = res.locals.user;
  const { id } = req.params;

  try {
    const todo = await Todos.findOne({
      attributes: ["todoId", "title", "content", "createdAt"],
      include: [
        {
          model: Users,
          attributes: ["userId", "nickname"],
        },
      ],
      where: { userId: userId, todoId: id },
    });

    if (!todo) {
      res.status(400).json({
        message: "존재하지 않는 할일번호이거나 상세보기 권한이 없습니다.",
      });
      return;
    } else if (todo) {
      let result = {
        todoId: todo.todoId,
        userId: todo.users.userId,
        nickname: todo.users.nickname,
        title: todo.title,
        content: todo.content,
        createdAt: todo.createdAt,
      };
      res.status(200).json({ todo: result, message: "할일 상세보기 성공" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "할일 상세조회에 실패하였습니다." });
  }
};

// ◎ Todo 할일 수정하기 API
export const updateToDo: RequestHandler = async (req, res, next) => {
  const { userId } = res.locals.user;
  const { id } = req.params;
  const { title, content } = req.body;

  // id값으로 찾은 Todos의 userId가 로그인한 userId와 같은지 확인
  const todo = await Todos.findOne({ where: { todoId: id } });
  if (!todo || todo.userId !== userId) {
    return res
      .status(403)
      .json({ message: "할일이 존재하지 않거나 수정 권한이 없습니다." });
  }
  let date = new Date();
  const koreantime = date.setHours(date.getHours() + 9);
  await todo.update({ title, content, updatedAt: koreantime });

  return res.status(200).json({ message: "Todo 할일 수정완료" });
};

// ◎ Todo 완료페이지 완료리스트 API
export const getFinishedToDo: RequestHandler = async (req, res, next) => {
  const { userId } = res.locals.user;

  try {
    const doneList = await Todos.findAll({
      attributes: [
        "userId",
        "todoId",
        "title",
        "content",
        "createdAt",
        "updatedAt",
      ],
      where: { userId: userId, done: true },
      order: [["createdAt", "DESC"]],
    });

    if (doneList.length > 0) {
      res.status(200).json({ doneList: doneList });
    } else if (doneList.length === 0) {
      res.status(400).json({ message: "완료한 할일이 존재하지 않습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "완료리스트 조회 실패" });
  }
};
