import mongoose from "mongoose";
import { getKST } from "../init";

// Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: {
    type: Date,
    required: true,
    default: getKST,
  },
});

// Model
const Comment = mongoose.model("Comment", commentSchema);

// Export
export default Comment;
