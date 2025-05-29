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


// chrome.storage.local.get(["hotkeys"], (result) => {
//   console.log(result.hotkeys)
// });


const hotkeysData = {
    mainSettings: {
        isOverride: false,
    },
    shortcuts: {
        "Ctrl+H": {
            shortcutKey: "Ctrl+H",
            link: "Facebook"
        }
    }
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.shortcutPressed) {

        
        console.log("🚀 Opening link from background...");
        chrome.tabs.create({ url: msg.url });
    }

    // Optional: send acknowledgment back
    sendResponse({ success: true });

    // Needed if you use sendResponse asynchronously
    return true;
});
