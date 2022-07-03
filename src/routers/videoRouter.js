import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id").get(watch);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
