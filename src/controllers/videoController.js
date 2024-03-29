import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { useAWS, s3 } from "../middlewares";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (err) {
    return res.render("server-error", err);
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: [{ path: "owner" }],
    });
  if (!video) {
    req.flash("error", "Video Not Found");
    return res.status(404).redirect("/");
  }
  return res.render("watch", { pageTitle: `${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Video Not Found");
    return res.status(404).redirect("/");
  }
  if (String(video.owner) !== String(_id)) {
    await req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    await req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: useAWS ? `${video[0].location}` : `/${video[0].path}`,
      thumbUrl: useAWS ? `${thumb[0].location}` : `/${thumb[0].path}`,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  const bucketParams = {
    Bucket: "wetube-ice0208",
    Key: `videos/${video.fileUrl.split("/")[4]}`,
  };
  const bucketParams2 = {
    Bucket: "wetube-ice0208",
    Key: `videos/${video.thumbUrl.split("/")[4]}`,
  };
  try {
    await s3.send(new DeleteObjectCommand(bucketParams));
    await s3.send(new DeleteObjectCommand(bucketParams2));
  } catch (err) {
    console.log("Error", err);
    return;
  }

  const videoComments = video.comments;
  for (const commentId of videoComments) {
    await Comment.findByIdAndDelete(commentId);
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    })
      .sort({ createdAt: "desc" })
      .populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos, keyword });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id: commentId },
    session: {
      user: { _id: userId },
    },
  } = req;
  const comment = await Comment.findById(commentId).populate("video");

  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) !== String(userId)) {
    return res.sendStatus(403);
  }

  // ? Delete a Comment
  // delete at video's comment list
  comment.video.comments = comment.video.comments.filter((id) => {
    return String(id) !== String(commentId);
  });
  await comment.video.save();
  // delete this comment oneself
  await Comment.findByIdAndDelete(commentId);

  res.sendStatus(200);
};
