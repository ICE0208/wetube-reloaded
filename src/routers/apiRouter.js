import express, { application } from "express";
import { getSessionUser } from "../controllers/userController";
import {
  createComment,
  deleteComment,
  registerView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.get("/users", getSessionUser);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);

export default apiRouter;
