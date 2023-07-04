const ffi = require("ffi-napi");
// const ref = require("ref-napi");

// const voidType = ref.types.void;
// const charPtr = ref.types.CString;

const lib = ffi.Library(
  "/Users/user/Documents/3.Electron/NotificationModule.dylib",
  {
    ShowNotification: ["void", ["string", "string", "string"]],
  }
);

function showNotification(title, body, iconPath) {
  lib.ShowNotification(title, body, iconPath);
}

module.exports = { showNotification };
