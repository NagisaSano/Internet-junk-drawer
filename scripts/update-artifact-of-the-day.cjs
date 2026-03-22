const fs = require("node:fs");
const path = require("node:path");
const ArtifactEngine = require("../artifact-engine.js");

const targetDate = process.argv[2] || ArtifactEngine.getUtcDateKey();
const artifact = ArtifactEngine.createArtifactForDate(targetDate);

const payload = {
  ...artifact,
  publishedAt: new Date().toISOString()
};

const outputDirectory = path.join(__dirname, "..", "data");
const outputFile = path.join(outputDirectory, "artifact-of-the-day.js");

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  outputFile,
  `window.INTERNET_JUNK_DRAWER_DAILY = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8"
);

process.stdout.write(`Updated artifact of the day for ${targetDate}\n`);
