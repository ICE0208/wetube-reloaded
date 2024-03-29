import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { useAWS, s3 } from "../middlewares";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password Confirm does not match",
    });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username is already taken.",
    });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This Email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    req.flash("info", "Join Completed");
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.flash("info", "Login Completed");
  req.session.loggedIn = true;
  req.session.user = user;
  req.session.save(() => {
    return res.redirect("/");
  });
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name || userData.login,
        username: userData.login,
        email: emailObj.email,
        password: " ",
        socialOnly: true,
        location: userData.location,
      });
      req.flash("info", "Login Completed");
      req.session.loggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        return res.redirect("/");
      });
    } else {
      req.flash("info", "Login Completed");
      req.session.loggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        return res.redirect("/");
      });
    }
  } else {
    res.redirect("/login");
  }
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  if (username !== req.session.user.username) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(400).render("edit-profile", {
        pageTitle,
        errorMessage: "This username is already taken.",
      });
    }
  }
  if (email !== req.session.user.email) {
    const socialOnly = req.session.user.socialOnly;
    if (socialOnly) {
      return res.status(400).render("edit-profile", {
        pageTitle,
        errorMessage: "You can't change the social account's email.",
      });
    }
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(400).render("edit-profile", {
        pageTitle,
        errorMessage: "This Email is already taken.",
      });
    }
  }
  const oldUser = await User.findById(_id);
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (useAWS ? file.location : `/${file.path}`) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );

  req.session.user = updatedUser;

  // ? 기존 프로필 이미지 삭제
  if (oldUser.avatarUrl && oldUser.avatarUrl !== updatedUser.avatarUrl) {
    const bucketParams = {
      Bucket: "wetube-ice0208",
      Key: `images/${oldUser.avatarUrl.split("/")[4]}`,
    };
    try {
      await s3.send(new DeleteObjectCommand(bucketParams));
    } catch (err) {
      return;
    }
  }

  req.flash("info", "Profile Updated");
  req.session.save(() => {
    return res.redirect(`/users/${_id}`);
  });
};
export const logout = async (req, res) => {
  req.flash("info", "Logout Completed");
  req.session.user = null;
  req.session.loggedIn = false;
  req.session.save(() => {
    return res.redirect("/");
  });
};

export const getChangePassword = async (req, res) => {
  if (req.session.user.socialOnly === true) {
    await req.flash("error", "Can't change password.");
    res.write(
      "<script>alert(\"You can't change the social account's password\")</script>"
    );
    res.write('<script>window.location="/users/edit"</script>');
    return;
  }

  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newConfirmation },
  } = req;

  if (newPassword !== newConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "The Password does not match the confirmation",
    });
  }
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "The current password is incorrect",
    });
  }

  user.password = newPassword;
  req.flash("info", "Password Updated");
  await user.save();

  return res.redirect("/");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(400).render("404", { pageTitle: "404" });
  }
  let videos = user.videos.reverse();
  videos.forEach((video) => (video.owner.name = user.name));

  return res.render("users/profile", {
    pageTitle: user.name,
    videos,
    user,
  });
};

export const getSessionUser = (req, res) => {
  const user = req.session.user;
  return res.json(
    user ? { name: user.name, avatarUrl: user.avatarUrl, id: user._id } : {}
  );
};
