const STORAGE_KEY = "internet-junk-drawer.state";
const MAX_ARCHIVED_ARTIFACTS = 6;

const elements = {
  artifactName: document.getElementById("artifact-name"),
  artifactDescription: document.getElementById("artifact-description"),
  artifactCategory: document.getElementById("artifact-category"),
  artifactVibe: document.getElementById("artifact-vibe"),
  artifactThreat: document.getElementById("artifact-threat"),
  artifactUsefulness: document.getElementById("artifact-usefulness"),
  artifactHabitat: document.getElementById("artifact-habitat"),
  artifactRitual: document.getElementById("artifact-ritual"),
  artifactSigil: document.getElementById("artifact-sigil"),
  history: document.getElementById("artifact-history"),
  spinCount: document.getElementById("spin-count"),
  archiveCount: document.getElementById("archive-count"),
  drawerMood: document.getElementById("drawer-mood"),
  generateButton: document.getElementById("generate-button"),
  archiveButton: document.getElementById("archive-button"),
  clearButton: document.getElementById("clear-button")
};

const adjectives = [
  "Solar-Powered",
  "Emergency",
  "Ceremonial",
  "Invisible",
  "Low-Budget",
  "Overengineered",
  "Unauthorized",
  "Pocket-Sized",
  "Biodegradable",
  "Caffeinated",
  "Museum-Grade",
  "Suburban",
  "Portable",
  "Polite"
];

const nouns = [
  "Inbox Goblin",
  "Browser Shrine",
  "Tab Fossil",
  "JPEG Museum",
  "Mood Spreadsheet",
  "Wi-Fi Totem",
  "Deadline Mirage",
  "Cursor Oracle",
  "Side Quest Engine",
  "Notification Harp",
  "Portable Ritual",
  "Desktop Weather System"
];

const categories = [
  "Domestic myth",
  "Soft threat",
  "Office folklore",
  "Browser wildlife",
  "Tiny machine",
  "Ceremonial clutter",
  "Digital keepsake"
];

const vibes = [
  "Warm absurdity",
  "Gentle menace",
  "Administrative whimsy",
  "Low-stakes prophecy",
  "Glorified side quest",
  "Curated nonsense"
];

const habitats = [
  "near forgotten tabs",
  "inside shared folders nobody owns",
  "between two unfinished side projects",
  "under the glow of a late-night monitor",
  "next to screenshots with no context",
  "behind a very confident desktop shortcut"
];

const powers = [
  "converts unread pings into decorative confidence",
  "makes procrastination feel like archival practice",
  "adds ceremonial weight to tiny bad ideas",
  "turns ordinary files into suspiciously meaningful relics",
  "makes the desktop feel 14% more haunted in a useful way",
  "relabels clutter as if it had a curator"
];

const consequences = [
  "someone mistakes it for a serious tool",
  "the room becomes emotionally better organized",
  "a stranger assumes there is a deeper system",
  "you accidentally start believing in its workflow",
  "the repo gains one more unexplained feature",
  "nobody can remember why it is charming, only that it is"
];

const threatLevels = [
  "Decorative menace",
  "Harmless if respected",
  "Mildly destabilizing",
  "Questionably legal in spirit",
  "Safe for office folklore"
];

const usefulnessLevels = [
  "Strangely practical",
  "Mostly ceremonial",
  "Useful under moonlight",
  "Suspiciously efficient",
  "Excellent for morale"
];

const rituals = [
  "Double-click at dusk",
  "Whisper a filename and refresh",
  "Offer it one broken bookmark",
  "Spin once before making plans",
  "Launch only after coffee",
  "Ask nothing from it directly"
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildSigil() {
  const glyphs = ["<>", "{}", "[]", "()", "~~", "::", "##", "++", "//", "\\\\"];
  const rowA = `${pick(glyphs)} ${pick(glyphs)} ${pick(glyphs)}`;
  const rowB = `${pick(glyphs)} 00 ${pick(glyphs)}`;
  const rowC = `${pick(glyphs)} ${pick(glyphs)} ${pick(glyphs)}`;

  return [rowA, rowB, rowC].join("\n");
}

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `artifact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createArtifact() {
  const name = `${pick(adjectives)} ${pick(nouns)}`;
  const category = pick(categories);
  const vibe = pick(vibes);
  const habitat = pick(habitats);
  const power = pick(powers);
  const consequence = pick(consequences);

  return {
    id: makeId(),
    name,
    category,
    vibe,
    description: `A ${vibe.toLowerCase()} ${category.toLowerCase()} that ${power} until ${consequence}. It is usually found ${habitat}.`,
    threat: pick(threatLevels),
    usefulness: pick(usefulnessLevels),
    habitat,
    ritual: pick(rituals),
    sigil: buildSigil(),
    archivedAt: null
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === "object") {
      return {
        spinCount: typeof parsed.spinCount === "number" ? parsed.spinCount : 0,
        archived: Array.isArray(parsed.archived) ? parsed.archived : [],
        current: parsed.current && typeof parsed.current === "object" ? parsed.current : null
      };
    }
  } catch (error) {
    console.warn("Could not read drawer state.", error);
  }

  return {
    spinCount: 0,
    archived: [],
    current: null
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getDrawerMood() {
  if (state.archived.length >= 5) {
    return "Museum mode";
  }

  if (state.spinCount >= 12) {
    return "Chaotic good";
  }

  if (state.spinCount >= 5) {
    return "Nicely unhinged";
  }

  if (state.archived.length > 0) {
    return "Shelf-aware";
  }

  return "Warm";
}

function renderArtifact(artifact) {
  elements.artifactName.textContent = artifact.name;
  elements.artifactDescription.textContent = artifact.description;
  elements.artifactCategory.textContent = artifact.category;
  elements.artifactVibe.textContent = artifact.vibe;
  elements.artifactThreat.textContent = artifact.threat;
  elements.artifactUsefulness.textContent = artifact.usefulness;
  elements.artifactHabitat.textContent = artifact.habitat;
  elements.artifactRitual.textContent = artifact.ritual;
  elements.artifactSigil.textContent = artifact.sigil;
}

function renderHistory() {
  elements.history.replaceChildren();

  if (state.archived.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "No relics archived yet. Keep the first good accident.";
    elements.history.append(empty);
    return;
  }

  state.archived.forEach((artifact) => {
    const item = document.createElement("li");
    item.className = "history-item";

    const title = document.createElement("strong");
    title.textContent = artifact.name;

    const summary = document.createElement("span");
    summary.textContent = `${artifact.category} / ${artifact.vibe}`;

    const time = document.createElement("time");
    time.textContent = artifact.archivedAt
      ? `Archived ${new Date(artifact.archivedAt).toLocaleDateString()}`
      : "Archived recently";

    item.append(title, summary, time);
    elements.history.append(item);
  });
}

function renderStats() {
  elements.spinCount.textContent = String(state.spinCount);
  elements.archiveCount.textContent = String(state.archived.length);
  elements.drawerMood.textContent = getDrawerMood();
}

function refresh() {
  renderArtifact(state.current);
  renderHistory();
  renderStats();
  saveState();
}

function spinGenerator() {
  state.spinCount += 1;
  state.current = createArtifact();
  refresh();
}

function archiveCurrentArtifact() {
  const alreadyArchived = state.archived.some((artifact) => artifact.id === state.current.id);
  if (alreadyArchived) {
    return;
  }

  state.archived.unshift({
    ...state.current,
    archivedAt: new Date().toISOString()
  });
  state.archived = state.archived.slice(0, MAX_ARCHIVED_ARTIFACTS);
  refresh();
}

function clearShelf() {
  state.archived = [];
  refresh();
}

const state = loadState();

if (!state.current) {
  state.current = createArtifact();
}

renderArtifact(state.current);
renderHistory();
renderStats();
saveState();

elements.generateButton.addEventListener("click", spinGenerator);
elements.archiveButton.addEventListener("click", archiveCurrentArtifact);
elements.clearButton.addEventListener("click", clearShelf);
