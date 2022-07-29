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
  img.src = userData.avatarUrl;
  const div = document.createElement("div");
  div.className = "video__comment__info";

  newComment.appendChild(img);
  newComment.appendChild(div);

  const nameSpan = document.createElement("span");
  nameSpan.className = "video__comment__name";
  nameSpan.innerText = userData.name;
  const textSpan = document.createElement("span");
  textSpan.className = "video__comment__text";
  textSpan.innerText = text;

  div.appendChild(nameSpan);
  div.appendChild(textSpan);

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
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
