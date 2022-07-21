const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const handlePlayBtnClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleVideoPasue = () => {
  playIcon.classList.replace("fa-pause", "fa-play");
};
const handleVideoPlay = () => {
  playIcon.classList.replace("fa-play", "fa-pause");
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
    muteIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
    volumeRange.value = 0;
  } else {
    muteIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
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
    muteIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
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
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleVideoMousemove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, controlsDelay);
};

const handleVideoMouseleave = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  controlsTimeout = setTimeout(hideControls, controlsDelay);
};

const handleFullScreenChange = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    videoContainer.classList.add("fullscreen");
  } else {
    videoContainer.classList.remove("fullscreen");
  }
};

// Set Default
let volumeValue = 0.5;
let controlsTimeout = null;

const controlsDelay = 1500;

video.volume = volumeValue;
currentTime.innerText = formatTime(0);

video.addEventListener("click", handlePlayBtnClick);
playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("pause", handleVideoPasue);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("volumechange", handleVideoVolumeChange);
video.addEventListener("timeupdate", handleVideoTimeUpdate);
video.addEventListener("mousemove", handleVideoMousemove);
video.addEventListener("mouseleave", handleVideoMouseleave);
volumeRange.addEventListener("input", handleVolumeRangeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handlefullScreenBtnClick);
document.addEventListener("fullscreenchange", handleFullScreenChange);

video.readyState
  ? handleMetadata()
  : video.addEventListener("loadedmetadata", handleMetadata);
