import multer from "multer";

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

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
});
