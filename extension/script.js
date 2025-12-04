/* ----------------- SEARCH ENGINES ----------------- */
const searchEngines = {
  Google: "https://www.google.com/search?q=",
  Bing: "https://www.bing.com/search?q=",
  DuckDuckGo: "https://duckduckgo.com/?q=",
  Perplexity: "https://www.perplexity.ai/search?q=",
  Ecosia: "https://www.ecosia.org/search?q="
};

let currentEngine = "Google";
const engineSelector = document.getElementById("engineSelector");

for (const key in searchEngines) {
  const btn = document.createElement("button");
  btn.textContent = key;
  btn.onclick = () => setEngine(key);
  if (key === currentEngine) btn.classList.add("active");
  engineSelector.appendChild(btn);
}

function setEngine(engine) {
  currentEngine = engine;
  document.querySelectorAll(".engine-selector button").forEach(btn => btn.classList.remove("active"));
  [...engineSelector.children].find(b => b.textContent === engine).classList.add("active");
  document.getElementById("query").placeholder = `Search with ${engine}...`;
}

document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();
  if (query) window.location.href = searchEngines[currentEngine] + encodeURIComponent(query);
});

/* ----------------- SIDE PANEL CUSTOMIZATION ----------------- */
const iconChoices = [
  { name: "TikTok", url: "https://tiktok.com", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/tiktok-white-icon.png" },
  { name: "YouTube", url: "https://youtube.com", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/youtube-app-white-icon.png" },
  { name: "Discord", url: "https://discord.com/app", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/discord-white-icon.png" },
  { name: "Twitch", url: "https://twitch.com", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/twitch-white-icon.png" },
  { name: "X", url: "https://x.com", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/x-social-media-white-icon.png" },
  { name: "Snapchat", url: "https://web.snapchat.com", icon: "https://zcjwfvaivdwflqajavrm.supabase.co/storage/v1/object/public/CDN/2ManyTabs/snapchat-line-icon.png" }
];

const leftPanel = document.getElementById("leftPanel");
const rightPanel = document.getElementById("rightPanel");

let leftPanelData = [0,1,2];
let rightPanelData = [3,4,5];

function renderPanels() {
  leftPanel.innerHTML = "";
  rightPanel.innerHTML = "";

  leftPanelData.forEach((idx,i) => addButton(leftPanel, idx, "left", i));
  rightPanelData.forEach((idx,i) => addButton(rightPanel, idx, "right", i));
}

function addButton(panel, idx, side, slot) {
  const a = document.createElement("a");
  a.href = iconChoices[idx].url;
  const img = document.createElement("img");
  img.src = iconChoices[idx].icon;
  a.appendChild(img);

  a.onclick = (e) => {
    if (document.body.classList.contains("editing")) {
      e.preventDefault();
      editingSlot = { side, slot };
      editPopup.classList.remove("hide");
      editPopup.classList.add("show");
    }
  }

  panel.appendChild(a);
}

// Load saved selections
const savedLeft = JSON.parse(localStorage.getItem("leftPanel"));
const savedRight = JSON.parse(localStorage.getItem("rightPanel"));
if(savedLeft) leftPanelData = savedLeft;
if(savedRight) rightPanelData = savedRight;

renderPanels();

/* ----------------- EDIT MODE ----------------- */
const editBtn = document.getElementById("editToggle");
const editPopup = document.getElementById("editPopup");
const appSelect = document.getElementById("appSelect");
let editingSlot = null;

// Populate dropdown
iconChoices.forEach((choice,i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = choice.name;
  appSelect.appendChild(opt);
});

// Toggle edit mode
editBtn.onclick = () => {
  document.body.classList.toggle("editing");
  editPopup.classList.remove("show");
  editPopup.classList.add("hide");
}

// Save selection
document.getElementById("saveApp").onclick = () => {
  if (!editingSlot) return;
  const newIndex = parseInt(appSelect.value);

  if(editingSlot.side === "left") leftPanelData[editingSlot.slot] = newIndex;
  else rightPanelData[editingSlot.side === "right" ? editingSlot.slot : editingSlot.slot] = newIndex;

  localStorage.setItem("leftPanel", JSON.stringify(leftPanelData));
  localStorage.setItem("rightPanel", JSON.stringify(rightPanelData));

  renderPanels();

  // Animate popup out
  editPopup.classList.remove("show");
  editPopup.classList.add("hide");
}
