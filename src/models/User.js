import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  location: String,
});

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
