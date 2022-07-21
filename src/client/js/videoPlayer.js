console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

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

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleVideoTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = video.currentTime;
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handlefullScreenBtnClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenBtn.innerText = "Enter Full Screen";
    document.exitFullscreen();
  } else {
    fullScreenBtn.innerText = "Exit Full Screen";
    videoContainer.requestFullscreen();
  }
};

// Set Default
let volumeValue = 0.5;
video.volume = volumeValue;

currentTime.innerText = formatTime(0);

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("pause", handleVideoPasue);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("volumechange", handleVideoVolumeChange);
video.addEventListener("timeupdate", handleVideoTimeUpdate);
volumeRange.addEventListener("input", handleVolumeRangeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handlefullScreenBtnClick);

video.readyState
  ? handleMetadata()
  : video.addEventListener("loadedmetadata", handleMetadata);
