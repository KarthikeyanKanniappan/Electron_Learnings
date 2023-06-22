const { BrowserWindow } = require("electron");

let offScreenWindow;
function takeScreenShot() {
  offScreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });
  const currentWindow = BrowserWindow.getFocusedWindow();
  console.log(currentWindow);
  offScreenWindow.webContents.capturePage().then((image) => {
    let screenshot = image;
    // console.log(screenshot);
    //   offScreenWindow.webContents.send("full-screen", screenshot);
    //   callback({ screenshot });
    //   offScreenWindow.close();
    //   offScreenWindow = null;
  });
}

module.exports = {
  takeScreenShot,
};
