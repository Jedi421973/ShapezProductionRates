// --- Matrix Rain Background Script ---
const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

// Set the canvas size to the window size - executed immediately as per your working script
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const hebrew = "בראשית ברא אלוהים את השמים ואת הארץאבגדהוזחטיכלמנסעפצקרשת"; //The hebrew for the first line in the bible is in here
const symbols = "!@#$%^&*()+=?><}{][_-";
const matrixCharacters = katakana + latin + hebrew + nums + symbols; // Integrated Hebrew characters

const fontSize = 16;
// Initial calculation of columns based on initial canvas width
const columns = Math.floor(canvas.width / fontSize);
const drops = [];

// Initialize drops for each column
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

// Adjust canvas size and reinitialize on resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const newColumns = Math.floor(canvas.width / fontSize);
  drops.length = newColumns; // Adjust the drops array for the new number of columns
  for (let x = 0; x < newColumns; x++) {
    if (!drops[x]) {
      // Check if drop exists before initializing
      drops[x] = 1;
    }
  }
});

function draw() {
  // Semi-transparent black rectangle to fade out the previous characters
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Original Matrix fade effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the font color and style
  ctx.fillStyle = "#0F0"; // Original Matrix green color
  ctx.font = `${fontSize}px monospace`;

  // Loop through each drop
  for (let i = 0; i < drops.length; i++) {
    const text = matrixCharacters.charAt(
      Math.floor(Math.random() * matrixCharacters.length)
    );

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      // Use canvas.height directly
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Call the animation function repeatedly
setInterval(draw, 30);

// --- Shapez.io Calculator Script ---

// Redefined base rates and categories
const MACHINE_DATA = {
  Extractor: { baseRate: 0.4, maxTier: 1000, category: "Extraction" },
  Cutter: {
    baseRate: 0.5,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Rotator: {
    baseRate: 2.0,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Painter: { baseRate: 2 / 6, maxTier: 1000, category: "Mixing & Painting" },
  Stacker: {
    baseRate: 0.25,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Merger: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  Splitter: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  "Color Mixer": {
    baseRate: 0.4,
    maxTier: 1000,
    category: "Mixing & Painting",
  },
  Balancer: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  Combiner: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  "Smart Splitter": {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  Compactor: {
    baseRate: 0.5,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Filter: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Tunnel: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  Storage: {
    baseRate: 1.0,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
};

// Data for each category, mirroring the game's upgrade screen
const CATEGORY_DATA = {
  "Belts, Distributor & Tunnels": {
    tierRates: {
      1: 1.0,
      2: 1.5,
      3: 2.0,
      4: 3.0,
      5: 4.0,
      6: 6.0,
      7: 7.0,
      8: 8.0,
    },
    maxTier: 1000,
    currentTier: 1,
  },
  Extraction: {
    tierRates: {
      1: 1.0,
      2: 1.5,
      3: 2.0,
      4: 3.0,
      5: 4.0,
      6: 6.0,
      7: 7.0,
      8: 8.0,
    },
    maxTier: 1000,
    currentTier: 1,
  },
  "Cutting, Rotating & Stacking": {
    tierRates: {
      1: 1.0,
      2: 1.5,
      3: 2.0,
      4: 3.0,
      5: 4.0,
      6: 6.0,
      7: 7.0,
      8: 8.0,
    },
    maxTier: 1000,
    currentTier: 1,
  },
  "Mixing & Painting": {
    tierRates: {
      1: 1.0,
      2: 1.5,
      3: 2.0,
      4: 3.0,
      5: 4.0,
      6: 6.0,
      7: 7.0,
      8: 8.0,
    },
    maxTier: 1000,
    currentTier: 1,
  },
};

const BASE_BELT_SPEED = 2.0;

// Get elements
const beltSpeedInput = document.getElementById("beltSpeed");
const categoryCardsContainer = document.getElementById(
  "category-cards-container"
);

/**
 * Shows a custom message box instead of alert().
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");
  messageBox.style.display = "block";
  messageText.textContent = message;
}

/**
 * Loads the saved state from local storage.
 */
function loadState() {
  try {
    const savedCategories = localStorage.getItem("shapezCalculatorTiers");
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      for (const category in parsed) {
        if (CATEGORY_DATA[category]) {
          CATEGORY_DATA[category].currentTier = parsed[category];
        }
      }
    }
    const savedBeltSpeed = localStorage.getItem("shapezCalculatorBeltSpeed");
    if (savedBeltSpeed) {
      beltSpeedInput.value = savedBeltSpeed;
    }
  } catch (e) {
    console.error("Could not load from local storage:", e);
  }
}

/**
 * Saves the current state to local storage.
 */
function saveState() {
  try {
    const tiersToSave = {};
    for (const category in CATEGORY_DATA) {
      tiersToSave[category] = CATEGORY_DATA[category].currentTier;
    }
    localStorage.setItem("shapezCalculatorTiers", JSON.stringify(tiersToSave));
    localStorage.setItem("shapezCalculatorBeltSpeed", beltSpeedInput.value);
  } catch (e) {
    console.error("Could not save to local storage:", e);
  }
}

/**
 * Calculates the speed multiplier for a given category and tier.
 * @param {string} category - The category name.
 * @param {number} tier - The upgrade tier.
 * @returns {number} The speed multiplier.
 */
function getCategoryMultiplier(category, tier) {
  const data = CATEGORY_DATA[category];
  if (!data) return 1;

  // Use specific tier rates if available
  if (data.tierRates[tier]) {
    return data.tierRates[tier];
  }
  // Handle the diminishing returns logic as a fallback for higher tiers
  else if (tier > 8 && tier <= 28) {
    return 8 + 0.1 * (tier - 8);
  } else if (tier > 28 && tier <= 58) {
    return 10 + 0.05 * (tier - 28);
  } else if (tier > 58 && tier <= 108) {
    return 11.5 + 0.025 * (tier - 58);
  } else if (tier > 108 && tier <= 1000) {
    return 12.75 + 0.0125 * (tier - 108);
  }
  return 1; // Default to 1 if tier is outside known range
}

/**
 * Renders the top-level category cards.
 */
function renderCategoryCards() {
  categoryCardsContainer.innerHTML = ""; // Clear existing cards
  for (const category in CATEGORY_DATA) {
    const data = CATEGORY_DATA[category];
    const currentTier = data.currentTier;
    const currentRate = getCategoryMultiplier(category, currentTier);
    const nextRate = getCategoryMultiplier(category, currentTier + 1);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="flex flex-col justify-between h-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-600 rounded-full mr-4"></div>
                        <div>
                            <p class="text-sm font-semibold text-gray-400">TIER ${currentTier}</p>
                            <h3 class="text-xl font-bold text-red-300">${category}</h3>
                        </div>
                    </div>
                </div>
                <div class="text-right mt-auto">
                    <p class="text-gray-400">Speed x${currentRate.toFixed(
                      2
                    )} &#8594; x${nextRate.toFixed(2)}</p>
                    <button class="btn upgrade-btn mt-2" data-category="${category}" ${
      currentTier >= data.maxTier ? "disabled" : ""
    }>
                        <span class="text-sm">UPGRADE</span>
                    </button>
                    <br>
                    <label for="tier-input-${category.replace(
                      /\s/g,
                      "-"
                    )}" class="text-gray-400 text-xs mt-2 block">Manual Tier:</label>
                    <input type="number" id="tier-input-${category.replace(
                      /\s/g,
                      "-"
                    )}" value="${currentTier}" class="input-field-sm text-right mt-1 w-20" min="1">
                </div>
            </div>
        `;
    categoryCardsContainer.appendChild(card);
  }
}

/**
 * Calculates and renders the individual machine cards based on the selected category's tier.
 * @param {string} category - The selected category name.
 */
function renderIndividualMachineCards(category) {
  const currentBeltSpeed = parseFloat(beltSpeedInput.value);
  if (isNaN(currentBeltSpeed) || currentBeltSpeed <= 0) {
    showMessageBox("Please enter a valid belt speed greater than 0.");
    return;
  }

  const categoryMultiplier = getCategoryMultiplier(
    category,
    CATEGORY_DATA[category].currentTier
  );
  const machines = Object.keys(MACHINE_DATA).filter(
    (name) => MACHINE_DATA[name].category === category
  );

  // Hide category cards and show machine cards
  categoryCardsContainer.classList.add("hidden");
  const machineCardsContainer = document.getElementById(
    "machine-cards-container"
  );
  machineCardsContainer.classList.remove("hidden");
  machineCardsContainer.innerHTML = "";

  const backButton = document.createElement("button");
  backButton.className = "btn mb-4";
  backButton.textContent = "← Back to Categories";
  backButton.onclick = () => {
    machineCardsContainer.classList.add("hidden");
    categoryCardsContainer.classList.remove("hidden");
  };
  machineCardsContainer.appendChild(backButton);

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-4 text-red-400 col-span-full";
  title.textContent = `${category} Machines`;
  machineCardsContainer.appendChild(title);

  for (const machineName of machines) {
    const machine = MACHINE_DATA[machineName];

    // Calculate both base and effective rates and machine counts
    const effectiveRate = machine.baseRate * categoryMultiplier;
    const machinesNeeded = Math.ceil(currentBeltSpeed / effectiveRate);

    const baseRate = machine.baseRate * getCategoryMultiplier(category, 1);
    const baseMachinesNeeded = Math.ceil(currentBeltSpeed / baseRate);

    const card = document.createElement("div");
    card.className = "card flex flex-col justify-between";
    card.innerHTML = `
            <div>
                <h3 class="text-xl font-bold mb-2 text-red-300">${machineName}</h3>
                <p class="text-gray-400 mb-1">Machines for Full Belt: <span class="text-red-300 font-bold">${machinesNeeded}</span></p>
                <p class="text-gray-400 mb-1">Base Machines: <span class="text-gray-400 font-bold">${baseMachinesNeeded}</span></p>
                <p class="text-gray-400 mb-1">Effective Rate: <span class="font-semibold">${effectiveRate.toFixed(
                  3
                )} items/sec</span></p>
            </div>
        `;
    machineCardsContainer.appendChild(card);
  }
}

// Initial setup on window load
window.onload = function () {
  loadState();
  renderCategoryCards();
  saveState(); // Save initial or loaded state

  // Event listeners
  beltSpeedInput.addEventListener("input", () => {
    saveState();
  });

  // Use event delegation for category cards and inputs
  categoryCardsContainer.addEventListener("click", (event) => {
    const target = event.target.closest(".card, .upgrade-btn, .input-field-sm");
    if (!target) return;

    const category =
      target.dataset.category || target.closest(".card").dataset.category;

    // Handle "UPGRADE" button click
    if (target.classList.contains("upgrade-btn") && !target.disabled) {
      const currentTier = CATEGORY_DATA[category].currentTier;
      if (currentTier < CATEGORY_DATA[category].maxTier) {
        CATEGORY_DATA[category].currentTier = currentTier + 1;
        saveState();
        renderCategoryCards();
      }
    }
    // Handle card click to show individual machines
    else if (target.classList.contains("card")) {
      renderIndividualMachineCards(category);
    }
  });

  // Handle manual tier input with event delegation
  categoryCardsContainer.addEventListener("input", (event) => {
    const target = event.target.closest("input");
    if (target && target.classList.contains("input-field-sm")) {
      const category = target.id.replace("tier-input-", "").replace(/-/g, " ");
      const newTier = parseInt(target.value, 10);
      if (!isNaN(newTier) && newTier > 0) {
        CATEGORY_DATA[category].currentTier = newTier;
        saveState();
        renderCategoryCards();
      }
    }
  });
};
