const video = document.querySelector("video");
const source = document.querySelector("source");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
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

function isMobile() {
  var UserAgent = navigator.userAgent;

  if (
    UserAgent.match(
      /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
    ) != null ||
    UserAgent.match(/LG|SAMSUNG|Samsung/) != null
  ) {
    return true;
  } else {
    return false;
  }
}

const handleVolumeRangeChange = (event) => {
  if (isMobile()) {
    volume.value = 1;
  }
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
  const beforeVolume = video.volume;
  video.volume = value;
  volumeValue = value;
  if (beforeVolume === video.volume) {
    volume.value = beforeVolume;
  }
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
const showCursor = () => {
  videoContainer.classList.add("hiddenCursor");
};

const handleVideoMousemove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  videoContainer.classList.remove("hiddenCursor");
  controlsTimeout = setTimeout(() => {
    hideControls();
    showCursor();
  }, controlsDelay);
};

const handleVideoMouseleave = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  controlsTimeout = setTimeout(() => {
    hideControls();
    showCursor();
  }, controlsDelay);
};

const handleFullScreenChange = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    videoContainer.classList.add("fullscreen");
    fullScreenIcon.classList.replace("fa-expand", "fa-compress");
  } else {
    videoContainer.classList.remove("fullscreen");
    fullScreenIcon.classList.replace("fa-compress", "fa-expand");
  }
};

const handleVideoDoubleClick = () => {
  handlefullScreenBtnClick();
};

const handleKeyDown = (e) => {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
    handlePlayBtnClick();
  }
};

const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

// Set Default
let volumeValue = null;
if (isMobile()) {
  video.playsInline = false;
  volumeValue = 1;
} else {
  video.playsInline = true;
  volumeValue = 0.5;
}
let controlsTimeout = null;

const controlsDelay = 1500;

video.volume = volumeValue;
volume.value = volumeValue;
currentTime.innerText = formatTime(0);

video.addEventListener("click", handlePlayBtnClick);
playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("pause", handleVideoPasue);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("volumechange", handleVideoVolumeChange);
video.addEventListener("timeupdate", handleVideoTimeUpdate);
video.addEventListener("dblclick", handleVideoDoubleClick);
video.addEventListener("ended", handleVideoEnded);
videoContainer.addEventListener("mousemove", handleVideoMousemove);
videoContainer.addEventListener("mouseleave", handleVideoMouseleave);
volumeRange.addEventListener("input", handleVolumeRangeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handlefullScreenBtnClick);
document.addEventListener("fullscreenchange", handleFullScreenChange);
window.addEventListener("keydown", handleKeyDown);

video.readyState
  ? handleMetadata()
  : video.addEventListener("loadedmetadata", handleMetadata);
