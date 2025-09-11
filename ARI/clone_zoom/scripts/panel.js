export function initPanel() {
  // 참가자·채팅 토글로 오른쪽 패널의 열림/닫힘과 단일·분할 배치를 제어하는 기능
  const appRoot = document.querySelector(".app");
  const sidePanel = document.querySelector(".side-panel");
  const secParticipants = document.querySelector(
    ".side-panel__section--participants"
  );
  const secChat = document.querySelector(".side-panel__section--chat");

  const btnParticipants = document.querySelector(".btn-participants");
  const btnChat = document.querySelector(".btn-chat");

  function updatePanelState() {
    const isParticipantsOpen =
      btnParticipants?.getAttribute("aria-pressed") === "true";
    const isChatOpen = btnChat?.getAttribute("aria-pressed") === "true";

    // 섹션 열림/닫힘
    secParticipants?.classList.toggle("is-open", !!isParticipantsOpen);
    secChat?.classList.toggle("is-open", !!isChatOpen);

    const open = !!(isParticipantsOpen || isChatOpen);
    appRoot?.classList.toggle("app--panel-open", open);
    sidePanel?.setAttribute("aria-hidden", String(!open));

    // 높이 배분(single/split)
    sidePanel?.classList.remove("side-panel--single", "side-panel--split");
    if (open) {
      sidePanel?.classList.add(
        isParticipantsOpen && isChatOpen
          ? "side-panel--split"
          : "side-panel--single"
      );
    }
  }

  // 패널 열림/닫힘 (toggle/X 버튼)
  function togglePressed(btn) {
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!pressed));
    updatePanelState();
  }

  btnParticipants?.addEventListener("click", () =>
    togglePressed(btnParticipants)
  );
  btnChat?.addEventListener("click", () => togglePressed(btnChat));

  sidePanel
    ?.querySelectorAll(".side-panel__section .btn-close")
    ?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const section = e.currentTarget.closest(".side-panel__section");

        if (section?.classList.contains("side-panel__section--participants")) {
          btnParticipants?.setAttribute("aria-pressed", "false");
        }
        if (section?.classList.contains("side-panel__section--chat")) {
          btnChat?.setAttribute("aria-pressed", "false");
        }

        updatePanelState();
      });
    });

  // 초기 반영
  updatePanelState();

  // 사이드 패널 채팅 기능
  const textarea = document.querySelector(".chat__input");
  const list = document.querySelector(".chat__messages");

  const msgTime = (d = new Date()) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const text = textarea.value.trim();
    if (!text) return;

    // 내 메시지 DOM
    const wrap = document.createElement("div");
    wrap.className = "message message--me";
    wrap.innerHTML = `
      <img
        src="./assets/images/profile1.png"
        alt=""
        class="message__avatar"
      />
      <div class="message__body">
        <div class="message__meta">
          <span class="message__sender">사용자</span>
          <time class="message__time">${msgTime()}</time>
        </div>
        <div class="message__text">${escapeHtml(text)}</div>
      </div>
    `;
    list.appendChild(wrap);
    list.scrollTop = list.scrollHeight;
    textarea.value = "";
  }

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}
