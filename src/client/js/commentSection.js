// ! Count of Comments
const countSpan = document.querySelector(".comments__count");
let commentsCount = parseInt(countSpan.dataset.count);

const plusCount = () => {
  commentsCount = commentsCount + 1;
  countSpan.innerText = `${commentsCount} Comments`;
};
const minusCount = () => {
  commentsCount = commentsCount - 1;
  countSpan.innerText = `${commentsCount} Comments`;
};

// ! Add a Comment
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const getUserData = async () => {
  const data = await (
    await fetch("/api/users", {
      method: "GET",
    })
  ).json();
  return data;
};

const addComment = async (text, id) => {
  const userData = await getUserData();
  if (userData === {}) return;

  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;

  const img = document.createElement("img");
  if (userData.avatarUrl) {
    img.src = userData.avatarUrl;
  }
  img.className = "video__comment__avatar";
  const div = document.createElement("div");
  div.className = "video__comment__info";

  newComment.appendChild(img);
  newComment.appendChild(div);

  const nameA = document.createElement("a");
  nameA.href = `/users/${userData.id}`;
  nameA.className = "video__comment__name";
  nameA.innerText = userData.name;
  const textSpan = document.createElement("span");
  textSpan.className = "video__comment__text";
  textSpan.innerText = text;

  div.appendChild(nameA);
  div.appendChild(textSpan);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList = "fa-regular fa-trash-can";
  deleteIcon.addEventListener("click", handleDeleteBtn);
  newComment.appendChild(deleteIcon);

  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim();
  const videoId = videoContainer.dataset.id;
  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    plusCount();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

// ! Delete a Comment

const commentList = document.querySelector(".video__comments-list");
const deleteBtns = document.querySelectorAll(".video__comment .deleteBtn");

const handleDeleteBtn = async (event) => {
  const {
    target: { parentElement: targetMsg },
  } = event;
  const {
    dataset: { id: targetId },
  } = targetMsg;

  const response = await fetch(`/api/comments/${targetId}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    commentList.removeChild(targetMsg);
    minusCount();
  }
};

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", handleDeleteBtn);
});
