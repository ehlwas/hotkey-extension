// ANOTHER WAY TO INJECT CONTENT SCRIPTS

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
//     chrome.scripting.executeScript({
//       target: { tabId },
//       files: ["js/contentScript.js"]
//     }).then(() => {
//       console.log("✅ Auto-injected into:", tab.url);
//     }).catch(err => {
//       console.error("❌ Injection failed:", err);
//     });
//   }
// });

// END ANOTHER WAY TO INJECT CONTENT SCRIPTS


// Default hotkeys settings
const defaultHotkeysSettings = {
    mainSettings: {
        isOverride: false,
    },
    shortcuts: {
        "Ctrl+Shift+F": {
            shortcutKey: "Ctrl+Shift+F",
            link: "https://facebook.com/"
        }
    }
};

function getHotkeys() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["hotkeys"], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (typeof result.hotkeys === "undefined") {
        // Set default
        chrome.storage.local.set({ hotkeys: defaultHotkeysSettings }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            // console.log("Default hotkeys saved.");
            resolve(defaultHotkeysSettings);
          }
        });
      } else {
        resolve(result.hotkeys);
      }
    });
  });
}

// (async () => {
//   try {
//     const hotkeysData = await getHotkeys();
//     console.log("Hotkeys loaded:", hotkeysData);
//   } catch (err) {
//     console.error("Error loading hotkeys:", err);
//   }
// })();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.shortcutPressed) {
        // console.log("🚀 Opening link from background...");
        chrome.tabs.create({ url: msg.url });
    }

    // Optional: send acknowledgment back
    sendResponse({ success: true });

    // Needed if you use sendResponse asynchronously
    return true;
});
