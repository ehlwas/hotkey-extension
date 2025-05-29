// Open options page on click
document.getElementById("openOptions").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Load hotkeys from storage and render them
function renderHotkeys(hotkeysData) {
  const container = document.getElementById("hotkeysList");
  container.innerHTML = "";

  if (!hotkeysData || !hotkeysData.shortcuts || Object.keys(hotkeysData.shortcuts).length === 0) {
    container.textContent = "No hotkeys saved.";
    return;
  }

  Object.values(hotkeysData.shortcuts).forEach(({ shortcutKey, link }) => {
    const item = document.createElement("div");
    item.classList.add("hotkey-item");

    // Shortcut key display
    const keySpan = document.createElement("span");
    keySpan.classList.add("shortcut-key");
    keySpan.textContent = shortcutKey;

    // Link display (clickable)
    const linkAnchor = document.createElement("a");
    linkAnchor.classList.add("shortcut-link");
    linkAnchor.href = link;
    linkAnchor.target = "_blank";
    linkAnchor.rel = "noopener noreferrer";
    linkAnchor.textContent = link;

    item.appendChild(keySpan);
    item.appendChild(linkAnchor);

    container.appendChild(item);
  });
}

// Load hotkeys on popup load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["hotkeys"], (result) => {
    renderHotkeys(result.hotkeys);
  });
});
