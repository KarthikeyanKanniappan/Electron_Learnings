const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  ipcMain,
  Menu,
  desktopCapturer,
  systemPreferences,
} = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const windowStateKeeper = require("electron-window-state");
const { createOffscreenWindow } = require("./readItem.js");
const { createtrayWindow } = require("./trayWindow.js");
let win, tray;
// let trayMenu = Menu.buildFromTemplate([
//   {
//     label: "full screen",
//     click: () => {
//       // captureScreenshot();
//       // takeScreenShot();
//       // screenShot();
//       createtrayWindow();
//     },
//   },
//   {
//     role: "quit",
//   },
// ]);

async function screenShot() {
  try {
    const mediaType = "screen";
    const consentStatus = await systemPreferences.getMediaAccessStatus(
      mediaType
    );
    // const mediaType = "camera";
    // const result = await systemPreferences.askForMediaAccess(mediaType);
    // if (result === "granted") {
    //   // The user has granted consent.
    //   console.log(1111111111);
    // } else {
    //   // The user has denied consent.
    //   return;
    // }
    let dataImage = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: { width: 1920, height: 1080 },
    });
    let pic = dataImage[0].thumbnail.toDataURL();
    win.webContents.send("full-screen", pic);
  } catch (err) {
    console.log(err);
  }
}

// function screenShot() {
//   win.webContents.capturePage().then((image) => {
//     let pic = image.toDataURL();
//     // console.log(pic);
//     win.webContents.send("full-screen", pic);
//   });
// }

function createTray() {
  let trayIcon = path.join(__dirname, "worldTemplate@2x.png");
  tray = new Tray(trayIcon);
  tray.setToolTip("addItems");
  // tray.setContextMenu(trayMenu);
  let final;
  tray.on("click", (e, bounds, position) => {
    console.log(final);
    if (final) {
      final.close();
      final = undefined;
    } else {
      final = createtrayWindow(bounds.x, bounds.height);
    }
  });
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
      console.log(item);
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

{
  /* <button onclick="myFunction()">click</button>
<script>
  function myFunction(){
     console.log('JS magic');
  }
</script> */
}
