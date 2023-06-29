document.getElementById("btn").addEventListener("click", () => {
  window.electronAPI.toMiniWindow("close");
  window.electronAPI.toMain("click");
  window.electronAPI.showNotification("mySnap", "Screen-Shot has been taken");
});
