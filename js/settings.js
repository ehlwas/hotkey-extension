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

// chrome.storage.local.get(["hotkeys"], (result) => {
//   console.log(result.hotkeys)
  
//   if (!result.hotkeys) {
//     chrome.storage.local.set({ hotkeys: defaultHotkeysSettings });
//   }
// });

const inputValidator = (e) => {
  e.preventDefault();

  const input = e.target;
  const keys = [];

  // Require Ctrl, Shift, or Alt
  if (!(e.ctrlKey || e.shiftKey || e.altKey)) {
    input.value = "❌ Must start with Ctrl, Shift, or Alt";
    return;
  }

  // Capture modifiers
  if (e.ctrlKey) keys.push("Ctrl");
  if (e.shiftKey) keys.push("Shift");
  if (e.altKey) keys.push("Alt");

  // Skip if it's just a modifier
  if (["ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight"].includes(e.code)) return;

  // Normalize the main key
  let key = "";

  // For letters/numbers
  if (e.code.startsWith("Key")) {
    key = e.code.replace("Key", "").toUpperCase(); // e.g. KeyA → A
  } else if (e.code.startsWith("Digit")) {
    key = e.code.replace("Digit", ""); // e.g. Digit1 → 1
  } else {
    key = e.code; // F1, ArrowUp, etc.
  }

  keys.push(key);

  const shortcut = keys.join(" + ");
  input.value = shortcut;
};

const deleteHotkeyButtonFunction = (e) => {
  const hotkeyId = e.target.dataset.id;
  const settingsRow = document.getElementById(`settingsRow_${hotkeyId}`);
  settingsRow.remove();
}

const shortcutInputs = document.querySelectorAll('#shortcutInput');

shortcutInputs.forEach(input => {
  input.addEventListener('keydown', inputValidator);
});

const addHotkeyButton = document.getElementById('addHotkeyButton');

addHotkeyButton.addEventListener('click', () => {
  const settingsListContainer = document.getElementById('settingsListContainer');

  const newIndex = settingsListContainer.children.length + 1;

  settingsListContainer.innerHTML += `
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
  `;

  // Select the new row container
  const newRow = document.getElementById(`settingsRow_${newIndex}`);

  // Attach events by class within the newRow
  const newShortcutInput = newRow.querySelector('.shortcut-input');
  newShortcutInput.addEventListener('keydown', inputValidator);

  const newDeleteButton = newRow.querySelector('.delete-hotkey-button');
  newDeleteButton.addEventListener('click', deleteHotkeyButtonFunction);
});


const deleteHotkeyButton = document.querySelectorAll('#deleteHotkeyButton');

deleteHotkeyButton.forEach(button => {
  button.addEventListener('click', deleteHotkeyButtonFunction);
});
