import { initPanel } from "./panel.js";

document.addEventListener("DOMContentLoaded", () => {
  initPanel();
});

// 마우스 움직임 감지로 툴바 자동 표시/숨김 기능
const toolbar = document.querySelector(".toolbar");
let hideTimeout = null;

document.addEventListener("mousemove", () => {
  if (!toolbar) return;
  toolbar.classList.add("toolbar--visible");

  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    toolbar.classList.remove("toolbar--visible");
  }, 2000);
});

// 본인 오디오/비디오 on/off 토글 기능
const micBtn = document.querySelector(".btn-mic");
const micIcon = document.querySelector(".btn-mic .icon-mic");
const videoBtn = document.querySelector(".btn-video");
const videoIcon = document.querySelector(".btn-video .icon-video");
const myCard = document.querySelector(".participant--self");

if (micBtn && micIcon) {
  let micOff = false;
  micBtn.addEventListener("click", () => {
    micOff = !micOff;
    micIcon.src = micOff
      ? "./assets/icons/icon-mic-off.svg"
      : "./assets/icons/icon-mic.svg";
    myCard.classList.toggle("is-mic-off", micOff);
  });
}

if (videoBtn && videoIcon) {
  let videoOff = false;
  videoBtn.addEventListener("click", () => {
    videoOff = !videoOff;
    videoIcon.src = videoOff
      ? "./assets/icons/icon-video-off.svg"
      : "./assets/icons/icon-video.svg";
    myCard.classList.toggle("is-video-off", videoOff);
  });
}

// 참가자 수에 맞춰 열 개수 자동 조절 기능
const grid = document.querySelector(".video-grid");
const count = grid.querySelectorAll(".participant").length;

const cols = Math.min(count, 3);
grid.style.setProperty("--cols", cols);
