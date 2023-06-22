const { ipcRenderer, contextBridge, desktopCapturer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchData: (text) => ipcRenderer.send("new-item", text),
  getData: (cb) => ipcRenderer.on("item-success", cb),
  takeScreen: (call) => ipcRenderer.on("capture-screenshot", call),
  command: (callback) => ipcRenderer.on("full-screen", callback),
  // toMain:(text) => ipcRenderer.send("newScreenShot", text)
});
