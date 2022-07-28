const deleteBtn = document.querySelector(".delete-btn");
const deleteBtnArea = document.querySelector(".delete-btn-area");
const deleteExtend = document.querySelector(".delete-btn-extend");
const cancelBtn = document.querySelector(".delete-cancel-btn");

const displayNoneClass = "display-none";

const handleDeleteBtn = () => {
  deleteExtend.classList.toggle(displayNoneClass);
};

const handleMouseLeave = () => {
  deleteExtend.classList.add(displayNoneClass);
};

const handleCancelClick = () => {
  deleteExtend.classList.add(displayNoneClass);
};

deleteBtnArea.addEventListener("click", handleDeleteBtn);
deleteBtn.addEventListener("mouseleave", handleMouseLeave);
cancelBtn.addEventListener("click", handleCancelClick);
