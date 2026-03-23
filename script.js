const STORAGE_KEY = "internet-junk-drawer.state";
const MAX_ARCHIVED_ARTIFACTS = 6;
const GUESTBOOK_PREFIX = "Guestbook:";

const repoConfig = {
  owner: document.body.dataset.githubOwner,
  repo: document.body.dataset.githubRepo
};

const dailyFallbackDateKey = ArtifactEngine.getUtcDateKey();
const initialDailyArtifact = globalThis.INTERNET_JUNK_DRAWER_DAILY
  || ArtifactEngine.createArtifactForDate(dailyFallbackDateKey);

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
  clearButton: document.getElementById("clear-button"),
  useDailyButton: document.getElementById("use-daily-button"),
  dailyName: document.getElementById("daily-name"),
  dailyDescription: document.getElementById("daily-description"),
  dailyDate: document.getElementById("daily-date"),
  dailyCategory: document.getElementById("daily-category"),
  dailyVibe: document.getElementById("daily-vibe"),
  dailyHabitat: document.getElementById("daily-habitat"),
  dailyRitual: document.getElementById("daily-ritual"),
  dailySigil: document.getElementById("daily-sigil"),
  guestbookForm: document.getElementById("guestbook-form"),
  guestName: document.getElementById("guest-name"),
  guestOffering: document.getElementById("guest-offering"),
  guestIdea: document.getElementById("guest-idea"),
  guestbookHelper: document.getElementById("guestbook-helper"),
  guestbookEntries: document.getElementById("guestbook-entries"),
  guestbookRefresh: document.getElementById("guestbook-refresh")
};

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

function renderArtifact(target, artifact) {
  target.name.textContent = artifact.name;
  target.description.textContent = artifact.description;
  target.category.textContent = artifact.category;
  target.vibe.textContent = artifact.vibe;
  target.habitat.textContent = ArtifactEngine.toTitleCase(artifact.habitat);
  target.ritual.textContent = artifact.ritual;
  target.sigil.textContent = artifact.sigil;

  if (target.threat) {
    target.threat.textContent = artifact.threat;
  }

  if (target.usefulness) {
    target.usefulness.textContent = artifact.usefulness;
  }

  if (target.date) {
    target.date.textContent = ArtifactEngine.formatDateKey(artifact.dateKey || dailyFallbackDateKey);
  }
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
  renderArtifact({
    name: elements.artifactName,
    description: elements.artifactDescription,
    category: elements.artifactCategory,
    vibe: elements.artifactVibe,
    threat: elements.artifactThreat,
    usefulness: elements.artifactUsefulness,
    habitat: elements.artifactHabitat,
    ritual: elements.artifactRitual,
    sigil: elements.artifactSigil
  }, state.current);
  renderHistory();
  renderStats();
  saveState();
}

function spinGenerator() {
  state.spinCount += 1;
  state.current = ArtifactEngine.createRandomArtifact();
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

function sendDailyArtifactToStage() {
  state.current = {
    ...dailyArtifact,
    id: ArtifactEngine.makeId()
  };
  refresh();
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSectionValue(body, sectionTitle) {
  const pattern = new RegExp(`## ${escapeForRegex(sectionTitle)}\\s+([\\s\\S]*?)(?=\\n## |$)`);
  const match = body.match(pattern);
  return match ? match[1].trim() : "";
}

function renderGuestbookEntries(entries) {
  elements.guestbookEntries.replaceChildren();
  elements.guestbookEntries.removeAttribute("aria-busy");
  elements.guestbookRefresh.disabled = false;
  elements.guestbookRefresh.textContent = "Refresh Wall";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "No guestbook entries yet. The wall is waiting for its first browser ghost.";
    elements.guestbookEntries.append(empty);
    return;
  }

  entries.forEach((issue) => {
    const item = document.createElement("li");
    item.className = "guestbook-entry";

    const title = document.createElement("strong");
    title.textContent = issue.title.replace(GUESTBOOK_PREFIX, "").trim() || "Unnamed browser ghost";

    const offering = document.createElement("span");
    const offeringText = getSectionValue(issue.body || "", "Offering To The Drawer")
      || "Left behind a mysterious offering.";
    offering.textContent = offeringText;

    const idea = document.createElement("span");
    const ideaText = getSectionValue(issue.body || "", "Terrible Idea For Next Feature");
    idea.textContent = ideaText
      ? `Terrible idea: ${ideaText}`
      : "Terrible idea: none recorded, which feels suspicious.";

    const time = document.createElement("time");
    time.textContent = `Signed ${new Date(issue.created_at).toLocaleDateString()}`;

    const link = document.createElement("a");
    link.href = issue.html_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open on GitHub";

    item.append(title, offering, idea, time, link);
    elements.guestbookEntries.append(item);
  });
}

async function loadGuestbookEntries() {
  elements.guestbookEntries.replaceChildren();
  elements.guestbookEntries.setAttribute("aria-busy", "true");
  elements.guestbookRefresh.disabled = true;
  elements.guestbookRefresh.textContent = "Refreshing...";

  const loading = document.createElement("li");
  loading.className = "history-empty";
  loading.textContent = "Loading guestbook entries...";
  elements.guestbookEntries.append(loading);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}/issues?state=all&per_page=20&sort=created&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const issues = await response.json();
    const entries = issues
      .filter((issue) => !issue.pull_request)
      .filter((issue) => issue.title.startsWith(GUESTBOOK_PREFIX))
      .slice(0, 6);

    renderGuestbookEntries(entries);
    elements.guestbookHelper.textContent = entries.length > 0
      ? "Wall refreshed. Fresh browser ghosts have been pinned to the drawer."
      : "Wall refreshed. The drawer is still waiting for its first browser ghost.";
  } catch (error) {
    console.warn("Could not load guestbook entries.", error);
    elements.guestbookEntries.removeAttribute("aria-busy");
    elements.guestbookRefresh.disabled = false;
    elements.guestbookRefresh.textContent = "Refresh Wall";

    const failed = document.createElement("li");
    failed.className = "history-empty";
    failed.textContent = "The wall could not load right now. GitHub may be rate-limiting or briefly unavailable.";
    elements.guestbookEntries.replaceChildren(failed);
    elements.guestbookHelper.textContent = "Wall refresh failed. GitHub may be rate-limiting the drawer right now.";
  }
}

function buildGuestbookIssueUrl() {
  const alias = elements.guestName.value.trim() || "Unnamed browser ghost";
  const offering = elements.guestOffering.value.trim()
    || "I leave behind a tab with no title and a screenshot I no longer understand.";
  const idea = elements.guestIdea.value.trim()
    || "Add a button that only appears when nobody needs it.";
  const issueTitle = `${GUESTBOOK_PREFIX} ${alias}`;
  const issueBody = [
    "## Alias",
    alias,
    "",
    "## Offering To The Drawer",
    offering,
    "",
    "## Terrible Idea For Next Feature",
    idea,
    "",
    "## Signature",
    `Posted from the site on ${new Date().toUTCString()}.`
  ].join("\n");

  return `https://github.com/${repoConfig.owner}/${repoConfig.repo}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}&labels=${encodeURIComponent("guestbook")}`;
}

function handleGuestbookSubmit(event) {
  event.preventDefault();

  const issueUrl = buildGuestbookIssueUrl();
  window.open(issueUrl, "_blank", "noopener");
  elements.guestbookHelper.textContent = "Prefilled issue opened in a new tab. Submit it on GitHub, then refresh the wall to pin it to the drawer.";
}

const dailyArtifact = {
  ...ArtifactEngine.createArtifactForDate(initialDailyArtifact.dateKey || dailyFallbackDateKey),
  ...initialDailyArtifact
};

const state = loadState();

if (!state.current) {
  state.current = ArtifactEngine.createRandomArtifact();
}

renderArtifact({
  name: elements.dailyName,
  description: elements.dailyDescription,
  category: elements.dailyCategory,
  vibe: elements.dailyVibe,
  habitat: elements.dailyHabitat,
  ritual: elements.dailyRitual,
  sigil: elements.dailySigil,
  date: elements.dailyDate
}, dailyArtifact);

refresh();
loadGuestbookEntries();

elements.generateButton.addEventListener("click", spinGenerator);
elements.archiveButton.addEventListener("click", archiveCurrentArtifact);
elements.clearButton.addEventListener("click", clearShelf);
elements.useDailyButton.addEventListener("click", sendDailyArtifactToStage);
elements.guestbookForm.addEventListener("submit", handleGuestbookSubmit);
elements.guestbookRefresh.addEventListener("click", loadGuestbookEntries);
