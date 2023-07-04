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
  shell,
} = require("electron");
// const { shell } = require('electron');
const path = require("path");
const { exec, execSync } = require("child_process");
const fs = require("fs");
const windowStateKeeper = require("electron-window-state");
const { createOffscreenWindow } = require("./readItem.js");
const { createtrayWindow } = require("./trayWindow.js");
// const { showNotification } = require("./notification.js");

let secondaryWindow = false;
let win, tray, final;

// function showNotification() {
//   let notify = new Notification("Electron App", {
//     body: "screen shot is taken",
//   });
//   console.log(notify);
// }

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
    let dataImage = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: { width: 1920, height: 1080 },
    });
    let pic = dataImage[0].thumbnail.toDataURL();
    win.webContents.send("full-screen", pic);
    // showNotification();
  } catch (err) {
    console.log(err);
  }
}

function createTray() {
  // let trayIcon = path.join(, "worldTemplate@2x.png");
  tray = new Tray(
    "/Users/user/Documents/3.Electron/build/worldTemplate@2x.png"
  );
  tray.setToolTip("addItems");
  // tray.setContextMenu(trayMenu);
  // let final;
  tray.on("click", (e, bounds, position) => {
    if (secondaryWindow) {
      final.close();
      secondaryWindow = false;
    } else {
      final = createtrayWindow(bounds.x, bounds.height);
      secondaryWindow = true;
    }
  });
}

function getIconPath() {
  const iconPath = "/Users/user/Documents/3.Electron/mySnapIcon.icns";
  const notificationScript = `
  osascript -e display notification "Notification Body" with title "Notification Title" giving up after 5 with icon POSIX file "${iconPath}"
    `;
  // 'display notification "hello world!"'
  //
  console.log(notificationScript);
  exec(notificationScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing AppleScript: ${error}`);
      return;
    }
    console.log(`AppleScript executed successfully: ${stdout}`);
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

  // win.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createWindow();
  createTray();

  //offScreenWindow
  ipcMain.on("new-item", (event, value) => {
    createOffscreenWindow(value, (item) => {
      event.sender.send("item-success", item);
      console.log(item);
    });
  });

  //newScreen-Shot
  ipcMain.on("newScreenShot", (event, value) => {
    if (value === "click") {
      secondaryWindow = false;
      setTimeout(() => {
        screenShot();
      }, 150);
    }

    final.on("hide", () => {
      final.close();
    });
  });

  //Notification for ScreenShot
  ipcMain.on("show-notification", (event, { title, body }) => {
    // const iconImage = nativeImage.createFromPath(
    //   "/Users/user/Documents/3.Electron/mySnapIcon.png"
    // );
    // const iconSize = { width: 125, height: 125 };
    // const resizedIcon = iconImage.resize(iconSize);
    // const notification = new Notification({ title, body, icon: resizedIcon });
    // notification.show();
    getIconPath();
    // showNotification(
    //   "mysnap",
    //   "Screen shot taken",
    //   "/Users/user/Documents/3.Electron/mySnapIcon.icns"
    // );
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
