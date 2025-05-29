chrome.storage.local.get(["hotkeys"], (result) => {
  console.log("Value is:", result.key);
});

let customShortcut = "Ctrl+H"; // default fallback

// 1. Load saved shortcut from chrome.storage
chrome.storage?.local.get("customShortcut", (data) => {
  if (data?.customShortcut) {
    customShortcut = data.customShortcut;
    console.log("🔧 Loaded shortcut from storage:", customShortcut);
  } else {
    console.log("⚙️ Using default shortcut:", customShortcut);
  }
});

// 2. Set up listener immediately
document.addEventListener("keydown", (e) => {
  const combo = (
    (e.ctrlKey ? "Ctrl+" : "") +
    (e.shiftKey ? "Shift+" : "") +
    (e.altKey ? "Alt+" : "") +
    e.key
  ).toUpperCase();
  
  if (combo === customShortcut.toUpperCase()) {
    e.preventDefault(); // Prevent default action if needed

    console.log("Shortcut matched:", combo);
    chrome.runtime.sendMessage({ shortcutPressed: true });
  }
});
