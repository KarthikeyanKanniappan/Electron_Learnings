const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  ipcMain,
  Menu,
  desktopCapturer,
} = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const { createOffscreenWindow } = require("./readItem.js");

let win, tray;
let trayMenu = Menu.buildFromTemplate([
  {
    label: "full screen",
    click: () => screenShot(),
  },
  {
    role: "quit",
  },
]);

async function screenShot() {
  try {
    let dataImage = await desktopCapturer.getSources({
      types: ["window"],
      thumbnailSize: { width: 1920, height: 1080 },
    });
    // console.log(dataImage);
    let pic = dataImage[0].thumbnail.toDataURL();
    win.webContents.send("full-screen", pic);
  } catch (err) {
    console.log(err);
  }
}
function createTray() {
  let trayIcon = path.join(__dirname, "worldTemplate@2x.png");
  tray = new Tray(trayIcon);
  tray.setToolTip("addItems");
  tray.setContextMenu(trayMenu);
}

const createWindow = () => {
  // Window state Keeper
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650,
  });

  win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minHeight: 300,
    minWidth: 350,
    maxWidth: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // manage new window
  state.manage(win);
  win.loadFile("./renderer/main.html");

  win.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createWindow();
  createTray();

  ipcMain.on("new-item", (event, value) => {
    createOffscreenWindow(value, (item) => {
      event.sender.send("item-success", item);
      // console.log(item);
    });
  });

  // ipcMain.send("full-screen", dataImage);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
