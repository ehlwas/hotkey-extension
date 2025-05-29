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


const hotkeysData = {
  mainSettings: {
    isOverride: false,
  },
  shortcuts: {
    "Control+H": {
      shortcutKey: "Ctrl+H",
      link: "https://facebook.com"
    },
    "A+S+1": {
      shortcutKey: "A+S+1",
      link: "https://hyperbet.live"
    }
  }
}


// 2. Set up listener immediately
document.addEventListener("keydown", (e) => {
  const keys = [];

  if (e.ctrlKey) keys.push("Control");
  if (e.shiftKey) keys.push("Shift");
  if (e.altKey) keys.push("Alt");
  if (e.metaKey) keys.push("Meta");

  let mainKey = e.code;

  if (mainKey.startsWith("Key")) mainKey = mainKey.slice(3);
  else if (mainKey.startsWith("Digit")) mainKey = mainKey.slice(5);
  else mainKey = mainKey.toUpperCase();

  if (!["Control", "Shift", "Alt", "Meta"].includes(mainKey)) {
    keys.push(mainKey);
  }

  const combo = keys.join("+");
  console.log("Detected combo:", combo);

  if (hotkeysData.shortcuts[combo]) {
    e.preventDefault();
    const shortcut = hotkeysData.shortcuts[combo];
    console.log("🎯 Shortcut matched:", combo);

    chrome.runtime.sendMessage({ shortcutPressed: true, url: shortcut.link });
  }
});
