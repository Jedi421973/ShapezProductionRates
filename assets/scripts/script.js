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
const matrixCharacters = katakana + latin + hebrew + nums + symbols;

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
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Call the animation function repeatedly
setInterval(draw, 30);

// --- Shapez.io Calculator Script ---

/**
 * Returns the speed multiplier for a given upgrade tier, based on the provided wiki data.
 * This function incorporates the diminishing returns from the footnotes.
 * @param {number} tier - The upgrade tier.
 * @returns {number} The speed multiplier.
 */
function getMultiplierForTier(tier) {
  if (tier >= 1 && tier <= 8) {
    const multipliers = [1, 1.5, 2, 3, 4, 6, 7, 8];
    return multipliers[tier - 1];
  } else if (tier >= 9 && tier <= 28) {
    return 8 + 0.1 * (tier - 8);
  } else if (tier >= 29 && tier <= 58) {
    return 10 + 0.05 * (tier - 28);
  } else if (tier >= 59 && tier <= 108) {
    return 11.5 + 0.025 * (tier - 58);
  } else if (tier >= 109 && tier <= 1000) {
    return 12.75 + 0.0125 * (tier - 108);
  }
  // If tier is outside the defined range (e.g., > 1000), use the last calculated max multiplier
  return getMultiplierForTier(1000);
}

// Base belt speed for Tier 1 (no upgrades)
const BASE_GAME_BELT_SPEED = 2; // items/second

const MACHINE_DATA = {
  Extractor: {
    baseRate: 0.4,
    currentTier: 1,
    maxTier: 1000,
    category: "Extraction",
  },
  Cutter: {
    baseRate: 0.5,
    currentTier: 1,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Rotator: {
    baseRate: 1.0,
    currentTier: 1,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Painter: {
    baseRate: 2 / 6,
    currentTier: 1,
    maxTier: 1000,
    category: "Mixing & Painting",
  },
  Stacker: {
    baseRate: 0.25,
    currentTier: 1,
    maxTier: 1000,
    category: "Cutting, Rotating & Stacking",
  },
  Merger: {
    baseRate: 1.0,
    currentTier: 1,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  Splitter: {
    baseRate: 1.0,
    currentTier: 1,
    maxTier: 1000,
    category: "Belts, Distributor & Tunnels",
  },
  "Color Mixer": {
    baseRate: 0.4,
    currentTier: 1,
    maxTier: 1000,
    category: "Mixing & Painting",
  },
};

// Get elements
const beltSpeedInput = document.getElementById("beltSpeed");
const machineCardsContainer = document.getElementById(
  "machine-cards-container"
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
 * Calculates the machine rate based on its base rate and tier using official multipliers.
 * @param {number} baseRate - The actual rate of the machine at Tier 1 (x1 multiplier).
 * @param {number} tier - The current upgrade tier.
 * @returns {number} The effective rate of the machine.
 */
function calculateMachineRate(baseRate, tier) {
  const multiplier = getMultiplierForTier(tier);
  return baseRate * multiplier;
}

/**
 * Renders (or re-renders) all machine cards.
 */
function renderMachineCards() {
  machineCardsContainer.innerHTML = ""; // Clear existing cards
  const currentBeltSpeed = parseFloat(beltSpeedInput.value);

  if (isNaN(currentBeltSpeed) || currentBeltSpeed <= 0) {
    showMessageBox("Please enter a valid belt speed greater than 0.");
    return;
  }

  for (const machineName in MACHINE_DATA) {
    const machine = MACHINE_DATA[machineName];
    const card = document.createElement("div");
    card.className = "card flex flex-col justify-between"; // Added flex for layout

    const currentMachineRate = calculateMachineRate(
      machine.baseRate,
      machine.currentTier
    );
    const machinesNeeded = Math.ceil(currentBeltSpeed / currentMachineRate);

    card.innerHTML = `
            <div>
                <h3 class="text-xl font-bold mb-2 text-red-300">${machineName}</h3>
                <p class="text-gray-400 mb-1">Current Tier: <span class="font-semibold">${
                  machine.currentTier
                }</span></p>
                <p class="text-400 mb-1">Current Rate: <span class="font-semibold">${currentMachineRate.toFixed(
                  3
                )} items/sec</span></p>
                <p class="text-gray-400 mb-4">Machines for Full Belt: <span class="text-red-300 font-bold">${machinesNeeded}</span></p>
            </div>
            <div class="flex items-center justify-between">
                <div class="tooltip-container">
                    <button class="btn upgrade-btn" data-machine="${machineName}" ${
      machine.currentTier >= machine.maxTier ? "disabled" : ""
    }>
                        Upgrade
                    </button>
                    <span class="tooltip-text">
                        ${
                          machine.currentTier < machine.maxTier
                            ? `Next Tier (${
                                machine.currentTier + 1
                              }): ${Math.ceil(
                                currentBeltSpeed /
                                  calculateMachineRate(
                                    machine.baseRate,
                                    machine.currentTier + 1
                                  )
                              )} machines`
                            : "Max Tier Reached"
                        }
                    </span>
                </div>
            </div>
        `;
    machineCardsContainer.appendChild(card);
  }
}

// Initial setup for calculator elements on window load
window.onload = function () {
  renderMachineCards();
  beltSpeedInput.addEventListener("input", renderMachineCards);
};
