let videos = [
  {
    title: "First video",
    rating: 5,
    comments: 1,
    createdAt: "2 minutes ago",
    views: 4,
    id: 1,
  },
  {
    title: "Second video",
    rating: 4,
    comments: 44,
    createdAt: "7 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third video",
    rating: 4,
    comments: 23,
    createdAt: "25 minutes ago",
    views: 543,
    id: 3,
  },
];

export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
