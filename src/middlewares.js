import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.error_messages = req.flash("error");
  res.locals.info_messages = req.flash("info");
  next();
};

export const protectorMiddleware = async (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    req.session.save(() => {
      return res.redirect("/login");
    });
  }
};

export const publicOnlyMiddleware = async (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    req.session.save(() => {
      return res.redirect("/");
    });
  }
};

// export const isHeroku = process.env.NODE_ENV === "production";
export const useAWS = true;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
  region: "us-west-1",
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-ice0208",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `images/${Date.now().toString()}`);
  },
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-ice0208",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `videos/${Date.now().toString()}`);
  },
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: useAWS ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
  storage: useAWS ? s3VideoUploader : undefined,
});
