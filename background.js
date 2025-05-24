let otpWindowId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "open_otp_window") {
    if (otpWindowId !== null) {
      chrome.windows.update(otpWindowId, { focused: true });
      sendResponse({ status: "focused" });
      return;
    }

    chrome.windows.create({
      url: "index.html",
      type: "popup",
      width: 450,
      height: 700,
      focused: true
    }, (win) => {
      otpWindowId = win.id;

      chrome.windows.onRemoved.addListener(function listener(windowId) {
        if (windowId === otpWindowId) {
          otpWindowId = null;
          chrome.storage.local.remove("siteName");
          chrome.storage.local.remove("noOtpSite");
          chrome.storage.local.remove("otpMenuVisible");
          chrome.windows.onRemoved.removeListener(listener);
        }
      });

      sendResponse({ status: "opened" });
    });

    return true; // keep sendResponse async
  }
});
