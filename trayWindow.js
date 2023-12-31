const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  ipcMain,
  Menu,
  desktopCapturer,
  systemPreferences,
  Notification,
} = require("electron");
const path = require("path");

let win;
const createtrayWindow = (valueX, valueY) => {
  win = new BrowserWindow({
    x: valueX - 150,
    y: valueY + 10,

    width: 300,
    height: 150,
    minHeight: 150,
    minWidth: 300,
    maxWidth: 300,
    maxHeight: 150,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("trayWindow.html");
  win.setWindowButtonVisibility(false);
  return win;
  //   win.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  ipcMain.on("close", (event, value) => {
    if (value === "close") {
      win.close();
    }
  });
  win.restore();
  win.focus();
});

module.exports = {
  createtrayWindow,
};
