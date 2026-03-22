const artifactName = document.getElementById("artifact-name");
const artifactDescription = document.getElementById("artifact-description");
const generateButton = document.getElementById("generate-button");

const adjectives = [
  "Solar-Powered",
  "Emergency",
  "Ceremonial",
  "Invisible",
  "Low-Budget",
  "Overengineered",
  "Polite",
  "Unauthorized",
  "Biodegradable",
  "Caffeinated"
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
  "Notification Harp"
];

const descriptions = [
  "A suspiciously cheerful helper that turns unread notifications into decorative confetti.",
  "A browser relic designed to make procrastination feel historically significant.",
  "An elegant machine for converting ordinary tabs into personal mythology.",
  "A tiny monument to the strange confidence of publishing random things in public.",
  "A soft-launch device for ideas that are not ready to justify themselves.",
  "A ceremonial web object that exists mostly to create questions and avoid answers.",
  "A desktop-adjacent curiosity with no roadmap, no KPI, and excellent posture.",
  "A public-facing side quest disguised as a harmless little internet experiment."
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateArtifact() {
  artifactName.textContent = `${pick(adjectives)} ${pick(nouns)}`;
  artifactDescription.textContent = pick(descriptions);
}

generateButton.addEventListener("click", generateArtifact);
