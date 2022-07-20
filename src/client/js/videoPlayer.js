console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handlePasue = () => {
  playBtn.innerText = "Play";
};
const handlePlay = () => {
  playBtn.innerText = "Pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
};

const handleVolume = (e) => {
  if (video.muted) {
    muteBtn.innerText = "Unmute";
    volumeRange.value = 0;
  } else {
    muteBtn.innerText = "Mute";
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePasue);
video.addEventListener("play", handlePlay);
video.addEventListener("volumechange", handleVolume);
