(function createArtifactEngine(globalScope, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  globalScope.ArtifactEngine = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function buildArtifactEngine() {
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

  function pick(list, random) {
    return list[Math.floor(random() * list.length)];
  }

  function buildSigil(random) {
    const glyphs = ["<>", "{}", "[]", "()", "~~", "::", "##", "++", "//", "\\\\"];
    const rowA = `${pick(glyphs, random)} ${pick(glyphs, random)} ${pick(glyphs, random)}`;
    const rowB = `${pick(glyphs, random)} 00 ${pick(glyphs, random)}`;
    const rowC = `${pick(glyphs, random)} ${pick(glyphs, random)} ${pick(glyphs, random)}`;

    return [rowA, rowB, rowC].join("\n");
  }

  function hashSeed(seed) {
    let hash = 2166136261;

    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function createSeededRandom(seed) {
    let state = hashSeed(seed) || 1;

    return function seededRandom() {
      state += 0x6D2B79F5;
      let value = Math.imul(state ^ (state >>> 15), 1 | state);
      value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeId() {
    if (globalScope.crypto && typeof globalScope.crypto.randomUUID === "function") {
      return globalScope.crypto.randomUUID();
    }

    return `artifact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createArtifact(options) {
    const random = options && typeof options.random === "function" ? options.random : Math.random;
    const name = `${pick(adjectives, random)} ${pick(nouns, random)}`;
    const category = pick(categories, random);
    const vibe = pick(vibes, random);
    const habitat = pick(habitats, random);
    const power = pick(powers, random);
    const consequence = pick(consequences, random);

    return {
      id: options && options.id ? options.id : makeId(),
      name,
      category,
      vibe,
      description: `A ${vibe.toLowerCase()} ${category.toLowerCase()} that ${power} until ${consequence}. It is usually found ${habitat}.`,
      threat: pick(threatLevels, random),
      usefulness: pick(usefulnessLevels, random),
      habitat,
      ritual: pick(rituals, random),
      sigil: buildSigil(random),
      archivedAt: null
    };
  }

  function createRandomArtifact() {
    return createArtifact();
  }

  function createArtifactForDate(dateKey) {
    const random = createSeededRandom(`daily:${dateKey}`);

    return {
      ...createArtifact({
        random,
        id: `daily-${dateKey}`
      }),
      dateKey
    };
  }

  function getUtcDateKey(date) {
    return (date || new Date()).toISOString().slice(0, 10);
  }

  function formatDateKey(dateKey) {
    return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
      dateStyle: "long",
      timeZone: "UTC"
    });
  }

  function toTitleCase(value) {
    return value.replace(/\b\w/g, function upperCaseLetter(letter) {
      return letter.toUpperCase();
    });
  }

  return {
    createRandomArtifact,
    createArtifactForDate,
    formatDateKey,
    getUtcDateKey,
    makeId,
    toTitleCase
  };
}));
