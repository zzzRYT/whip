document.getElementById("toolbar").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const cmd = btn.dataset.cmd;
  const fmt = btn.dataset.format;
  editor.focus();

  if (cmd) {
    document.execCommand(cmd, false, null);
    return;
  }

  if (fmt) {
    document.execCommand("formatBlock", false, fmt === "P" ? "P" : fmt);
    return;
  }
});

document.getElementById("bulletsBtn").addEventListener("click", () => {
  editor.focus();
  document.execCommand("insertUnorderedList");
});

document.getElementById("numbersBtn").addEventListener("click", () => {
  editor.focus();
  document.execCommand("insertOrderedList");
});

document.getElementById("codeBtn").addEventListener("click", () => {
  editor.focus();
  document.execCommand("formatBlock", false, "PRE");
});

document.getElementById("quoteBtn").addEventListener("click", () => {
  editor.focus();
  document.execCommand("formatBlock", false, "BLOCKQUOTE");
});

document.getElementById("todoBtn").addEventListener("click", () => {
  const box = document.createElement("div");
  box.innerHTML = '<label><input type="checkbox"> <span>To-do</span></label>';
  const sel = window.getSelection();
  if (!sel.rangeCount) {
    editor.appendChild(box);
  } else {
    sel.getRangeAt(0).insertNode(box);
  }
});
