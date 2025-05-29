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

chrome.storage.local.get(["hotkeys"], (result) => {
  console.log(result.hotkeys)
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.shortcutPressed) {
    console.log("🚀 Opening link from background...");
    chrome.tabs.create({ url: "https://facebook.com" });
  }

  // Optional: send acknowledgment back
  sendResponse({ success: true });

  // Needed if you use sendResponse asynchronously
  return true;
});
