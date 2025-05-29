
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

(async () => {
  const hotkeysData = await getHotkeys();

  let customShortcut = Object.keys(hotkeysData.shortcuts); // default fallback

  // 1. Load saved shortcut from chrome.storage
  chrome.storage?.local.get("customShortcut", (data) => {
    if (data?.customShortcut) {
      customShortcut = data.customShortcut;
      // console.log("🔧 Loaded shortcut from storage:", customShortcut);
    } else {
      // console.log("⚙️ Using default shortcut:", customShortcut);
    }
  });

  // 2. Key listener already below this (do not touch, working fine)
  // 2. Set up listener immediately
  document.addEventListener("keydown", (e) => {
    const keys = [];

    if (e.ctrlKey) keys.push("Ctrl");
    if (e.shiftKey) keys.push("Shift");
    if (e.altKey) keys.push("Alt");
    if (e.metaKey) keys.push("Meta");

    let mainKey = e.code;

    if (mainKey.startsWith("Key")) mainKey = mainKey.slice(3);
    else if (mainKey.startsWith("Digit")) mainKey = mainKey.slice(5);
    else mainKey = mainKey.toUpperCase();

    if (!["Ctrl", "Shift", "Alt", "Meta"].includes(mainKey)) {
      keys.push(mainKey);
    }

    const combo = keys.join("+");
    // console.log("Detected combo:", combo);

    if (hotkeysData.shortcuts[combo]) {
      e.preventDefault();
      const shortcut = hotkeysData.shortcuts[combo];
      // console.log("🎯 Shortcut matched:", combo);

      chrome.runtime.sendMessage({ shortcutPressed: true, url: shortcut.link });
    }
  });

})();
