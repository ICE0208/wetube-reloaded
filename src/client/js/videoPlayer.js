console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

// Default Volume
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtnClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleVideoPasue = () => {
  playBtn.innerText = "Play";
};
const handleVideoPlay = () => {
  playBtn.innerText = "Pause";
};

const handleMuteBtnClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
};

const handleVideoVolumeChange = (event) => {
  //   console.log(video.volume);
  if (video.muted) {
    muteBtn.innerText = "Unmute";
    volumeRange.value = 0;
  } else {
    muteBtn.innerText = "Mute";
    volumeValue = video.volume;
    volumeRange.value = volumeValue;
  }
};

const handleVolumeRangeChange = (event) => {
  const {
    target: { value },
  } = event;
  video.volume = value;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("pause", handleVideoPasue);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("volumechange", handleVideoVolumeChange);
volumeRange.addEventListener("input", handleVolumeRangeChange);
