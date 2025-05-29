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

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const hotkeysData = await getHotkeys();
    const shortcuts = hotkeysData.shortcuts || {};

    Object.keys(shortcuts).forEach((key, index) => {
      const { link, shortcutKey } = shortcuts[key];
      const newIndex = index + 1;

      settingsListContainer.insertAdjacentHTML('beforeend', `
        <div id="settingsRow_${newIndex}" class="settings-row-c">

          <div class="form-wrapper">
            <input type="text" class="h-input primary link-input" value="${link}" placeholder="Put link here">
          </div>

          <div class="form-wrapper">
            <input type="text" class="h-input primary shortcut-input" value="${shortcutKey}" placeholder="Hotkey (e.g. Ctrl+Shift+L)" readonly>
          </div>

          <div class="btn-container">
            <button class="h-btn primary delete-hotkey-button" data-id="${newIndex}">Delete</button>
          </div>

        </div>
      `);
    });

  } catch (err) {
    console.error("Error loading hotkeys on DOMContentLoaded:", err);
  }
});

const addHotkeyButton = document.getElementById('addHotkeyButton');

// Add new hotkey row
addHotkeyButton.addEventListener('click', () => {
  const newIndex = settingsListContainer.children.length + 1;

  settingsListContainer.insertAdjacentHTML('beforeend', `
    <div id="settingsRow_${newIndex}" class="settings-row-c">

      <div class="form-wrapper">
        <input type="text" class="h-input primary link-input" placeholder="Put link here">
      </div>

      <div class="form-wrapper">
        <input type="text" class="h-input primary shortcut-input" placeholder="Hotkey (e.g. Ctrl+Shift+L)" readonly>
      </div>

      <div class="btn-container">
        <button class="h-btn primary delete-hotkey-button" data-id="${newIndex}">Delete</button>
      </div>

    </div>
  `);
});

const settingsListContainer = document.getElementById('settingsListContainer');

// Input validator function (basic example)
function inputValidator(e) {
  e.preventDefault();

  const keys = [];
  if (!(e.ctrlKey || e.shiftKey || e.altKey)) {
    e.target.value = "❌ Must start with Ctrl, Shift, or Alt";
    return;
  }

  if (e.ctrlKey) keys.push("Ctrl");
  if (e.shiftKey) keys.push("Shift");
  if (e.altKey) keys.push("Alt");

  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

  if (["Control", "Shift", "Alt"].includes(key)) return;

  keys.push(key);
  e.target.value = keys.join("+");
}

// Delete function
function deleteHotkeyButtonFunction(e) {
  const btn = e.target;
  const row = btn.closest('.settings-row-c');
  if (row) row.remove();
}

// Event delegation for shortcut input keydown
settingsListContainer.addEventListener('keydown', (e) => {
  if (e.target && e.target.classList.contains('shortcut-input')) {
    inputValidator(e);
  }
});

// Event delegation for delete buttons
settingsListContainer.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('delete-hotkey-button')) {
    deleteHotkeyButtonFunction(e);
  }
});

const saveHotkeysButton = document.getElementById('saveHotkeysButton');

saveHotkeysButton.addEventListener("click", () => {
  const rows = settingsListContainer.querySelectorAll(".settings-row-c");
  const newHotkeys = {};

  rows.forEach((row) => {
    let link = row.querySelector(".link-input").value.trim();
    const shortcutKey = row.querySelector(".shortcut-input").value.trim();

    // 🛡️ Skip if incomplete
    if (!link || !shortcutKey) return;

    // 🌐 Ensure https:// is present
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }

    newHotkeys[shortcutKey] = {
      shortcutKey,
      link
    };
  });

  const updatedData = {
    mainSettings: {
      isOverride: false
    },
    shortcuts: newHotkeys
  };

  chrome.storage.local.set({ hotkeys: updatedData }, () => {
    console.log("✅ Hotkeys saved with valid links.");
  });
});