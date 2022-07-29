const deleteBtn = document.querySelector(".delete-btn");
const deleteBtnArea = document.querySelector(".delete-btn-area");
const deleteExtend = document.querySelector(".delete-btn-extend");
const cancelBtn = document.querySelector(".delete-cancel-btn");

const displayNoneClass = "display-none";
let displayNoneTimer;

const displayNone = () => {
  deleteExtend.classList.add(displayNoneClass);
};
const clearTimer = () => {
  if (displayNoneTimer) {
    clearTimeout(displayNoneTimer);
    displayNoneTimer = null;
  }
};

const handleDeleteBtn = () => {
  clearTimer();
  deleteExtend.classList.toggle(displayNoneClass);
  displayNoneTimer = setTimeout(displayNone, 3000);
};

const handleMouseMove = () => {
  clearTimer();
  displayNoneTimer = setTimeout(displayNone, 3000);
};

const handleMouseLeave = () => {
  clearTimer();
  displayNoneTimer = setTimeout(displayNone, 3000);
};

const handleCancelClick = () => {
  clearTimer();
  deleteExtend.classList.add(displayNoneClass);
};

deleteBtnArea.addEventListener("click", handleDeleteBtn);
deleteBtn.addEventListener("mouseleave", handleMouseLeave);
deleteBtn.addEventListener("mousemove", handleMouseMove);
cancelBtn.addEventListener("click", handleCancelClick);
window.addEventListener("scroll", displayNone);
