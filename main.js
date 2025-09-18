// Simple WoWS T10/T11 Randomizer
// Works from file:// (embedded data) and http(s):// (optional ships.json fetch)

// Known classes and nations for filters (used even before enrichment)
const KNOWN_CLASSES = ["Battleship", "Cruiser", "Destroyer", "Carrier", "Submarine"];
const KNOWN_NATIONS = [
  "USA", "USSR", "Japan", "Germany", "UK", "France", "Italy", "Europe",
  "Pan-Asia", "Pan-America", "Netherlands", "Spain", "Commonwealth", "Poland"
];

const embeddedShips = [
  // === TIER X BATTLESHIPS ===
  { name: "Yamato", tier: 10, nation: "Japan", class: "Battleship" },
  { name: "Shikishima", tier: 10, nation: "Japan", class: "Battleship" },
  { name: "ARP Yamato", tier: 10, nation: "Japan", class: "Battleship" },
  { name: "Montana", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Ohio", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Großer Kurfürst", tier: 10, nation: "Germany", class: "Battleship" },
  { name: "Conqueror", tier: 10, nation: "UK", class: "Battleship" },
  { name: "Thunderer", tier: 10, nation: "UK", class: "Battleship" },
  { name: "St. Vincent", tier: 10, nation: "UK", class: "Battleship" },
  { name: "République", tier: 10, nation: "France", class: "Battleship" },
  { name: "Bourgogne", tier: 10, nation: "France", class: "Battleship" },
  { name: "Kremlin", tier: 10, nation: "USSR", class: "Battleship" },
  { name: "Slava", tier: 10, nation: "USSR", class: "Battleship" },
  { name: "Cristoforo Colombo", tier: 10, nation: "Italy", class: "Battleship" },
  { name: "Pommern", tier: 10, nation: "Germany", class: "Battleship" },
  { name: "Mecklenburg", tier: 10, nation: "Germany", class: "Battleship" },
  { name: "Vermont", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Preußen", tier: 10, nation: "Germany", class: "Battleship" },
  { name: "Louisiana", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Schlieffen", tier: 10, nation: "Germany", class: "Battleship" },
  
  // === TIER XI BATTLESHIPS (SUPERSHIPS) ===
  { name: "Satsuma", tier: 11, nation: "Japan", class: "Battleship" },
  { name: "Incomparable", tier: 11, nation: "UK", class: "Battleship" },
  { name: "Hannover", tier: 11, nation: "Germany", class: "Battleship" },
  
  // === TIER X CRUISERS ===
  { name: "Zao", tier: 10, nation: "Japan", class: "Cruiser" },
  { name: "Yoshino", tier: 10, nation: "Japan", class: "Cruiser" },
  { name: "Yoshino B", tier: 10, nation: "Japan", class: "Cruiser" },
  { name: "Des Moines", tier: 10, nation: "USA", class: "Cruiser" },
  { name: "Salem", tier: 10, nation: "USA", class: "Cruiser" },
  { name: "Hindenburg", tier: 10, nation: "Germany", class: "Cruiser" },
  { name: "Minotaur", tier: 10, nation: "UK", class: "Cruiser" },
  { name: "Goliath", tier: 10, nation: "UK", class: "Cruiser" },
  { name: "Henri IV", tier: 10, nation: "France", class: "Cruiser" },
  { name: "Moskva", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Petropavlovsk", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Nevsky", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Venezia", tier: 10, nation: "Italy", class: "Cruiser" },
  { name: "Puerto Rico", tier: 10, nation: "USA", class: "Cruiser" },
  { name: "Worcester", tier: 10, nation: "USA", class: "Cruiser" },
  { name: "Austin", tier: 10, nation: "USA", class: "Cruiser" },
  { name: "Stalingrad", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Smolensk", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Smolensk B", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Napoli", tier: 10, nation: "Italy", class: "Cruiser" },
  { name: "Ruggiero di Lauria", tier: 10, nation: "Italy", class: "Battleship" },
  { name: "Sicilia", tier: 10, nation: "Italy", class: "Battleship" },
  { name: "Wisconsin", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Rhode Island", tier: 10, nation: "USA", class: "Battleship" },
  { name: "Plymouth", tier: 10, nation: "UK", class: "Cruiser" },
  { name: "Gibraltar", tier: 10, nation: "UK", class: "Cruiser" },
  { name: "Colbert", tier: 10, nation: "France", class: "Cruiser" },
  { name: "Yodo", tier: 10, nation: "Japan", class: "Cruiser" },
  { name: "Gouden Leeuw", tier: 10, nation: "Netherlands", class: "Cruiser" },
  { name: "Jinan", tier: 10, nation: "Pan-Asia", class: "Cruiser" },
  { name: "Álvaro de Bazán", tier: 10, nation: "Spain", class: "Cruiser" },
  { name: "Attilio Regolo", tier: 10, nation: "Italy", class: "Cruiser" },
  { name: "Sevastopol", tier: 10, nation: "USSR", class: "Cruiser" },
  { name: "Defence", tier: 10, nation: "UK", class: "Cruiser" },
  { name: "Komissar", tier: 10, nation: "USSR", class: "Cruiser" },

  // === TIER XI CRUISERS (SUPERSHIPS) ===
  { name: "Annapolis", tier: 11, nation: "USA", class: "Cruiser" },
  { name: "Marseille", tier: 11, nation: "France", class: "Cruiser" },
  { name: "Conde", tier: 11, nation: "France", class: "Cruiser" },
  
  // === TIER X DESTROYERS ===
  { name: "Shimakaze", tier: 10, nation: "Japan", class: "Destroyer" },
  { name: "Harugumo", tier: 10, nation: "Japan", class: "Destroyer" },
  { name: "Hayate", tier: 10, nation: "Japan", class: "Destroyer" },
  { name: "Gearing", tier: 10, nation: "USA", class: "Destroyer" },
  { name: "Forrest Sherman", tier: 10, nation: "USA", class: "Destroyer" },
  { name: "Somers", tier: 10, nation: "USA", class: "Destroyer" },
  { name: "Z-52", tier: 10, nation: "Germany", class: "Destroyer" },
  { name: "Elbing", tier: 10, nation: "Germany", class: "Destroyer" },
  { name: "Z-42", tier: 10, nation: "Germany", class: "Destroyer" },
  { name: "Daring", tier: 10, nation: "UK", class: "Destroyer" },
  { name: "Druid", tier: 10, nation: "UK", class: "Destroyer" },
  { name: "Kléber", tier: 10, nation: "France", class: "Destroyer" },
  { name: "Marceau", tier: 10, nation: "France", class: "Destroyer" },
  { name: "Grozovoi", tier: 10, nation: "USSR", class: "Destroyer" },
  { name: "Khabarovsk", tier: 10, nation: "USSR", class: "Destroyer" },
  { name: "Delny", tier: 10, nation: "USSR", class: "Destroyer" },
  { name: "Paolo Emilio", tier: 10, nation: "Italy", class: "Destroyer" },
  { name: "Halland", tier: 10, nation: "Europe", class: "Destroyer" },
  { name: "Småland", tier: 10, nation: "Europe", class: "Destroyer" },
  { name: "Yueyang", tier: 10, nation: "Pan-Asia", class: "Destroyer" },
  { name: "Vampire II", tier: 10, nation: "Commonwealth", class: "Destroyer" },
  { name: "Tromp", tier: 10, nation: "Netherlands", class: "Destroyer" },
  { name: "Ragnar", tier: 11, nation: "Europe", class: "Destroyer" },
  
  // === TIER XI DESTROYERS ===
  { name: "Yamagiri", tier: 11, nation: "Japan", class: "Destroyer" },
  
  // === TIER X CARRIERS ===
  { name: "Hakuryū", tier: 10, nation: "Japan", class: "Carrier" },
  { name: "Shinano", tier: 10, nation: "Japan", class: "Carrier" },
  { name: "Midway", tier: 10, nation: "USA", class: "Carrier" },
  { name: "Franklin D. Roosevelt", tier: 10, nation: "USA", class: "Carrier" },
  { name: "Manfred von Richthofen", tier: 10, nation: "Germany", class: "Carrier" },
  { name: "Audacious", tier: 10, nation: "UK", class: "Carrier" },
  { name: "Malta", tier: 10, nation: "UK", class: "Carrier" },
  { name: "Nakhimov", tier: 10, nation: "USSR", class: "Carrier" },
  
  // === TIER XI CARRIERS ===
  { name: "Max Immelmann", tier: 11, nation: "Germany", class: "Carrier" },
  { name: "Eagle", tier: 11, nation: "UK", class: "Carrier" },
  { name: "United States", tier: 11, nation: "USA", class: "Carrier" },
  
  // === TIER X SUBMARINES ===
  { name: "Balao", tier: 10, nation: "USA", class: "Submarine" },
  { name: "U-4501", tier: 10, nation: "Germany", class: "Submarine" },
  { name: "U-2501", tier: 10, nation: "Germany", class: "Submarine" },
  { name: "I-56", tier: 10, nation: "Japan", class: "Submarine" },
  { name: "Thrasher", tier: 10, nation: "UK", class: "Submarine" },
];

async function loadShips() {
  // First try to load from ships.json
  try {
    const response = await fetch('./ships.json');
    if (response.ok) {
      const externalShips = await response.json();
      if (externalShips && externalShips.length > 0) {
        console.log(`Loaded ${externalShips.length} ships from ships.json`);
        return externalShips;
      }
    }
  } catch (e) {
    console.warn('Failed to load ships.json, using embedded data:', e);
  }
  
  // Fallback to embedded data if ships.json fails or is empty
  console.log(`Using embedded data: ${embeddedShips.length} ships`);
  return embeddedShips;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function displayShip(ship) {
  const resultSection = document.getElementById("result");
  const nameEl = document.getElementById("shipName");
  const metaEl = document.getElementById("shipMeta");

  if (!ship) {
    nameEl.textContent = "No ships match your filters";
    metaEl.innerHTML = "";
    resultSection.classList.remove("hidden");
    return;
  }

  nameEl.textContent = ship.name;
  
  // Create beautiful badges
  const badges = [];
  if (ship.tier) {
    const tierIcon = ship.tier === 11 ? "⭐" : "🏆";
    badges.push(`<span class="badge badge-tier">${tierIcon} Tier ${ship.tier}</span>`);
  }
  if (ship.class && ship.class !== "Unknown") {
    const classIcon = getClassIcon(ship.class);
    const classLower = ship.class.toLowerCase();
    badges.push(`<span class="badge badge-class ${classLower}">${classIcon} ${ship.class}</span>`);
  }
  if (ship.nation && ship.nation !== "Unknown") {
    const flagIcon = getNationFlag(ship.nation);
    badges.push(`<span class="badge badge-nation">${flagIcon} ${ship.nation}</span>`);
  }
  metaEl.innerHTML = badges.join("");
  
  resultSection.classList.remove("hidden");
}

function getClassIcon(shipClass) {
  const icons = {
    'Battleship': '🚢',
    'Cruiser': '⚔️',
    'Destroyer': '💨',
    'Carrier': '✈️',
    'Submarine': '🐟'
  };
  return icons[shipClass] || '⚓';
}

function getNationFlag(nation) {
  const flags = {
    'USA': '🇺🇸',
    'USSR': '🇷🇺',
    'Japan': '🇯🇵',
    'Germany': '🇩🇪',
    'UK': '🇬🇧',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Poland': '🇵🇱',
    'Pan-Asia': '🌏',
    'Pan-America': '🌎',
    'Netherlands': '🇳🇱',
    'Spain': '🇪🇸',
    'Commonwealth': '🇦🇺',
    'Europe': '🇪🇺'
  };
  return flags[nation] || '🏴';
}


function updateExcludedShipsList(excluded) {
  const excludedList = document.getElementById("excludedList");
  const emptyExcluded = document.getElementById("emptyExcluded");
  
  if (!excludedList) return;
  
  const excludedNames = Object.keys(excluded).filter(name => excluded[name]);
  
  if (excludedNames.length === 0) {
    excludedList.innerHTML = `
      <div class="empty-excluded" id="emptyExcluded">
        No ships excluded yet.<br>
        <small>Ships you exclude will appear here.</small>
      </div>
    `;
    return;
  }
  
  const excludedItems = excludedNames.map(name => `
    <div class="excluded-item">
      <span class="excluded-item-name">${name}</span>
      <button class="btn-restore" onclick="restoreShip('${name.replace(/'/g, "\\'")}')">Restore</button>
    </div>
  `).join('');
  
  excludedList.innerHTML = excludedItems;
}

function restoreShip(shipName) {
  const EXCL_KEY = "wowsExcluded";
  const excluded = loadCache(EXCL_KEY);
  delete excluded[shipName];
  saveCache(EXCL_KEY, excluded);
  updateExcludedShipsList(excluded);
  
  // Update exclude button if this is the currently selected ship
  const excludeBtn = document.getElementById("excludeBtn");
  const currentShip = document.getElementById("shipName")?.textContent;
  if (currentShip === shipName) {
    updateExcludeButton(excludeBtn, excluded, shipName);
  }
}

(async function init() {
  const randomizeBtn = document.getElementById("randomizeBtn");
  const tier10 = document.getElementById("tier10");
  const tier11 = document.getElementById("tier11");
  const noRepeat = document.getElementById("noRepeat");
  const classFiltersRoot = document.getElementById("classFilters");
  const nationFiltersRoot = document.getElementById("nationFilters");
  const enrichBtn = document.getElementById("enrichBtn");
  const copyBtn = document.getElementById("copyBtn");
  const excludeBtn = document.getElementById("excludeBtn");

  const ships = await loadShips();

  // Cache for enriched metadata
  const cacheKey = "wowsMetaCache";
  const metaCache = loadCache(cacheKey);
  applyCacheToShips(ships, metaCache);

  // Exclusion persistence
  const EXCL_KEY = "wowsExcluded";
  const excluded = loadCache(EXCL_KEY); // { ShipName: true }

  // Render filter checkboxes
  renderFilterCheckboxes(classFiltersRoot, KNOWN_CLASSES, "class-");
  renderFilterCheckboxes(nationFiltersRoot, KNOWN_NATIONS, "nation-");

  function filterShips() {
    const allowedTiers = new Set([
      ...(tier10.checked ? [10] : []),
      ...(tier11.checked ? [11] : []),
    ]);
    const selectedClasses = getSelectedValues(classFiltersRoot, "class-");
    const selectedNations = getSelectedValues(nationFiltersRoot, "nation-");

    return ships.filter(s => {
      if (!allowedTiers.has(s.tier)) return false;
      // If no class filters selected, accept all classes (including Unknown)
      if (selectedClasses.size > 0) {
        if (!s.class || s.class === "Unknown" || !selectedClasses.has(s.class)) return false;
      }
      // If no nation filters selected, accept all nations (including Unknown)
      if (selectedNations.size > 0) {
        if (!s.nation || s.nation === "Unknown" || !selectedNations.has(s.nation)) return false;
      }
      if (excluded[s.name]) return false;
      return true;
    });
  }

  let lastPickedName = null;
  randomizeBtn.addEventListener("click", () => {
    const filtered = filterShips();
    if (filtered.length === 0) {
      displayShip(null);
      return;
    }
    let choice = pickRandom(filtered);
    if (noRepeat && noRepeat.checked && filtered.length > 1) {
      let guard = 0;
      while (choice.name === lastPickedName && guard++ < 20) {
        choice = pickRandom(filtered);
      }
    }
    lastPickedName = choice.name;
    displayShip(choice);
    updateExcludeButton(excludeBtn, excluded, lastPickedName);
  });

  // Spacebar shortcut to randomize
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat) {
      e.preventDefault();
      randomizeBtn.click();
    }
  });

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const nameEl = document.getElementById("shipName");
      const text = nameEl?.textContent?.trim();
      if (!text || text === "—" || text === "No ships match your filters") return;
      try {
        await navigator.clipboard.writeText(text);
        flashButton(copyBtn, "Copied!", 900);
      } catch (e) {
        console.warn("Clipboard failed", e);
      }
    });
  }

  // Exclude current ship toggle
  if (excludeBtn) {
    excludeBtn.addEventListener("click", () => {
      if (!lastPickedName) return;
      if (excluded[lastPickedName]) {
        delete excluded[lastPickedName];
      } else {
        excluded[lastPickedName] = true;
      }
      saveCache(EXCL_KEY, excluded);
      updateExcludeButton(excludeBtn, excluded, lastPickedName);
      updateExcludedShipsList(excluded);
    });
  }

  // View 3D Model button
  const view3DBtn = document.getElementById("view3DBtn");
  if (view3DBtn) {
    view3DBtn.addEventListener("click", () => {
      if (!lastPickedName) return;
      // Try multiple 3D model sources
      const shipName = lastPickedName.replace(/\s+/g, '_');
      const urls = [
        `https://wiki.wargaming.net/en/Ship:${encodeURIComponent(shipName)}`,
        `https://www.wowsft.com/ship?index=${encodeURIComponent(lastPickedName)}`,
        `https://gamemodels3d.com/worldofwarships/ships/${encodeURIComponent(shipName.toLowerCase())}`
      ];
      
      // Open the first available URL
      window.open(urls[0], '_blank');
    });
  }

  // Clear all excluded ships
  const clearAllExcluded = document.getElementById("clearAllExcluded");
  if (clearAllExcluded) {
    clearAllExcluded.addEventListener("click", () => {
      if (Object.keys(excluded).length === 0) return;
      
      if (confirm(`Clear all ${Object.keys(excluded).length} excluded ships?`)) {
        Object.keys(excluded).forEach(key => delete excluded[key]);
        saveCache(EXCL_KEY, excluded);
        updateExcludedShipsList(excluded);
        updateExcludeButton(excludeBtn, excluded, lastPickedName);
      }
    });
  }

  // Initialize excluded ships display
  updateExcludedShipsList(excluded);

  if (enrichBtn) {
    enrichBtn.addEventListener("click", async () => {
      enrichBtn.disabled = true;
      const originalText = enrichBtn.textContent;
      try {
        const updated = await enrichMetadata(ships, metaCache, (done, total, currentName) => {
          enrichBtn.textContent = `Enriching ${done}/${total}… ${currentName || ""}`;
        });
        saveCache(cacheKey, updated);
        // Re-render by just picking again (filters will now show enriched badges)
        enrichBtn.textContent = "Enriched ✓";
      } catch (e) {
        console.warn(e);
        alert("Enrichment failed or was blocked by the browser (CORS). Try serving over HTTP.");
        enrichBtn.textContent = originalText;
      } finally {
        setTimeout(() => {
          enrichBtn.disabled = false;
          enrichBtn.textContent = originalText;
        }, 1500);
      }
    });
  }
})();

function updateExcludeButton(btn, excluded, shipName) {
  if (!btn || !shipName) return;
  const isExcluded = excluded[shipName];
  btn.innerHTML = isExcluded ? "✅ Include Ship" : "🚫 Exclude Ship";
  btn.title = isExcluded ? "Remove this ship from exclusions" : "Exclude this ship from future rolls";
  btn.className = isExcluded ? "btn-secondary" : "btn-danger";
}

function flashButton(btn, text, ms) {
  const prev = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, ms || 800);
}

// ---------- UI helpers ----------
function renderFilterCheckboxes(root, values, idPrefix) {
  if (!root) return;
  root.innerHTML = values.map(v => {
    const id = `${idPrefix}${v.replace(/\s+/g, '-')}`;
    return `
      <label class="checkbox">
        <input type="checkbox" id="${id}" data-value="${v}">
        <span>${v}</span>
      </label>
    `;
  }).join("");
}

function getSelectedValues(root, idPrefix) {
  const set = new Set();
  if (!root) return set;
  const inputs = root.querySelectorAll(`input[id^="${idPrefix}"]`);
  inputs.forEach(inp => { if (inp.checked) set.add(inp.getAttribute("data-value")); });
  return set;
}

// ---------- Cache helpers ----------
function loadCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

function saveCache(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
}

function applyCacheToShips(ships, cache) {
  ships.forEach(s => {
    const c = cache[s.name];
    if (!c) return;
    if (c.nation) s.nation = c.nation;
    if (c.class) s.class = c.class;
    if (c.tier) s.tier = c.tier;
  });
}

// ---------- Enrichment (online) ----------
async function enrichMetadata(ships, cache, onProgress) {
  const updated = { ...cache };
  const targets = ships.filter(s => s.nation === "Unknown" || s.class === "Unknown");
  const total = targets.length;
  for (let i = 0; i < targets.length; i++) {
    const s = targets[i];
    onProgress && onProgress(i + 1, total, s.name);
    try {
      const meta = await fetchShipMeta(s.name);
      if (meta) {
        if (meta.nation) s.nation = meta.nation;
        if (meta.class) s.class = meta.class;
        if (meta.tier) s.tier = meta.tier;
        updated[s.name] = { nation: s.nation, class: s.class, tier: s.tier };
      }
      await delay(120);
    } catch (e) {
      console.warn("Enrich failed for", s.name, e);
    }
  }
  return updated;
}

async function fetchShipMeta(name) {
  const url = `https://wiki.wargaming.net/en/Ship:${encodeURIComponent(name.replace(/\s+/g, '_'))}`;
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) return null;
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const info = doc.querySelector('table.infobox, table.infobox.vcard');
  if (!info) return null;
  const getField = (label) => {
    const rows = info.querySelectorAll('tr');
    for (const row of rows) {
      const th = row.querySelector('th');
      const td = row.querySelector('td');
      if (!th || !td) continue;
      const key = th.textContent.trim().toLowerCase();
      if (key === label) return td.textContent.trim();
    }
    return null;
  };
  const tierRaw = getField('tier') || getField('ship tier');
  const nationRaw = getField('nation') || getField('country');
  const classRaw = getField('type') || getField('ship type') || getField('class');

  const tier = parseTier(tierRaw);
  const nation = normalizeNation(nationRaw);
  const sclass = normalizeClass(classRaw);
  return { tier, nation, class: sclass };
}

function parseTier(val) {
  if (!val) return null;
  const m = val.match(/\b(XI|X|11|10)\b/i);
  if (!m) return null;
  return /XI|11/i.test(m[1]) ? 11 : 10;
}

function normalizeNation(n) {
  if (!n) return null;
  const map = {
    'U.S.A.': 'USA', 'USA': 'USA', 'United States': 'USA',
    'U.S.S.R.': 'USSR', 'U.S.S.R': 'USSR', 'Soviet Union': 'USSR',
    'Japan': 'Japan', 'Germany': 'Germany', 'U.K.': 'UK', 'UK': 'UK', 'Great Britain': 'UK',
    'France': 'France', 'Poland': 'Poland', 'Pan-Asia': 'Pan-Asia', 'Pan Asia': 'Pan-Asia',
    'Italy': 'Italy', 'Europe': 'Europe', 'Commonwealth': 'Commonwealth',
    'Pan-America': 'Pan-America', 'Pan America': 'Pan-America', 'Spain': 'Spain', 'Netherlands': 'Netherlands'
  };
  return map[n.trim()] || n.trim();
}

function normalizeClass(c) {
  if (!c) return null;
  const map = {
    'Aircraft Carrier': 'Carrier', 'Aircraft carrier': 'Carrier', 'Carrier': 'Carrier',
    'Battleship': 'Battleship', 'Cruiser': 'Cruiser', 'Destroyer': 'Destroyer', 'Submarine': 'Submarine'
  };
  return map[c.trim()] || c.trim();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
