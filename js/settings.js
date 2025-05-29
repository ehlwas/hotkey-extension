const defaultHotkeysSettings = {
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

chrome.storage.local.get(["hotkeys"], (result) => {
  console.log(result.hotkeys)
  
  if (!result.hotkeys) {
    chrome.storage.local.set({ hotkeys: defaultHotkeysSettings });
  }
});