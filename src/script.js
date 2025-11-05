/* KisaanHal Frontend – ultra-premium UI + robust logic (EN/HI) */

const API_BASE = "http://localhost:8080"; // backend proxy (CORS allows 5500)

const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => [...el.querySelectorAll(sel)];
const on = (el, ev, fn) => el.addEventListener(ev, fn);

/* ---------- Language/i18n ---------- */
const dict = {
  en: {
    tagline: "Smart Farming AI",
    "nav.soil": "Soil Advisor",
    "nav.leaf": "Leaf Scanner",
    "nav.compare": "Crop Comparison",

    "hero.h1a": "AI + IoT for",
    "hero.h1b": "Smarter Farming",
    "hero.sub":
      "Soil insights, leaf disease diagnosis, irrigation and fertilizer guidance — in English and Hindi.",
    "hero.tryLeaf": "Try Leaf Scanner",
    "hero.compare": "Compare Crops",
    "badge.offline": "Offline-ready UI",
    "badge.bilingual": "Bilingual",

    "soil.title": "Soil Advisor",
    "soil.desc": "Enter soil parameters to get crop & fertilizer suggestions.",
    "soil.ph": "Soil pH",
    "soil.n": "Nitrogen (N)",
    "soil.p": "Phosphorus (P)",
    "soil.k": "Potassium (K)",
    "soil.moisture": "Moisture %",
    "soil.type": "Soil Type",
    "soil.analyze": "Analyze Soil",
    "soil.suggested": "Suggested Crops",
    "soil.fert": "Fertilizer Plan",
    "soil.irrig": "Irrigation Advice",

    "leaf.title": "Leaf Disease Scanner",
    "leaf.desc":
      "Upload a leaf image. We’ll diagnose using Gemini 2.5 Flash and suggest remedies.",
    "leaf.hint": "Drag & drop or click to upload",
    "leaf.scan": "Scan Leaf",
    "leaf.change": "Change Image",
    "leaf.diagnosis": "Diagnosis",
    "leaf.disease": "Disease",
    "leaf.conf": "Confidence",
    "leaf.symptoms": "Symptoms",
    "leaf.organic": "Organic Solution",
    "leaf.chemical": "Chemical Solution",
    "leaf.schedule": "Schedule",
    "leaf.warning": "Warning",
    "leaf.loading": "Analyzing image…",

    "compare.title": "Crop Comparison",
    "compare.desc":
      "Compare two crops for season, irrigation, fertilizer, and soil preferences.",
    "compare.cropA": "Crop A",
    "compare.cropB": "Crop B",
    "compare.overview": "Overview",
    "compare.irrig": "Irrigation",
    "compare.fert": "Fertilizer",
    "common.reset": "Reset",
    "btn.demo": "Live Demo",
  },
  hi: {
    tagline: "स्मार्ट फार्मिंग एआई",
    "nav.soil": "मृदा सलाह",
    "nav.leaf": "पत्ती स्कैनर",
    "nav.compare": "फसल तुलना",

    "hero.h1a": "एआई + आईओटी के साथ",
    "hero.h1b": "स्मार्ट खेती",
    "hero.sub":
      "मिट्टी की जानकारी, पत्ती रोग पहचान, सिंचाई व उर्वरक मार्गदर्शन — हिंदी और अंग्रेज़ी में।",
    "hero.tryLeaf": "पत्ती स्कैनर आज़माएँ",
    "hero.compare": "फसल तुलना करें",
    "badge.offline": "ऑफ़लाइन-रेडी UI",
    "badge.bilingual": "द्विभाषी",

    "soil.title": "मृदा सलाह",
    "soil.desc": "मिट्टी के पैरामीटर दर्ज करें और फसल/उर्वरक सुझाव पाएं।",
    "soil.ph": "मिट्टी का pH",
    "soil.n": "नाइट्रोजन (N)",
    "soil.p": "फास्फोरस (P)",
    "soil.k": "पोटैशियम (K)",
    "soil.moisture": "नमी %",
    "soil.type": "मिट्टी का प्रकार",
    "soil.analyze": "मिट्टी विश्लेषण",
    "soil.suggested": "अनुशंसित फसलें",
    "soil.fert": "उर्वरक योजना",
    "soil.irrig": "सिंचाई सलाह",

    "leaf.title": "पत्ती रोग स्कैनर",
    "leaf.desc":
      "पत्ती की फोटो अपलोड करें। Gemini 2.5 Flash से विश्लेषण और उपचार सुझाव मिलेगा।",
    "leaf.hint": "ड्रैग-ड्रॉप करें या क्लिक करके अपलोड करें",
    "leaf.scan": "स्कैन करें",
    "leaf.change": "इमेज बदलें",
    "leaf.diagnosis": "निदान",
    "leaf.disease": "रोग",
    "leaf.conf": "विश्वास स्तर",
    "leaf.symptoms": "लक्षण",
    "leaf.organic": "जैविक उपचार",
    "leaf.chemical": "रासायनिक उपचार",
    "leaf.schedule": "शेड्यूल",
    "leaf.warning": "चेतावनी",
    "leaf.loading": "इमेज का विश्लेषण हो रहा है…",

    "compare.title": "फसल तुलना",
    "compare.desc":
      "दो फसलों की ऋतु, सिंचाई, उर्वरक और मृदा पसंद की तुलना करें।",
    "compare.cropA": "फसल A",
    "compare.cropB": "फसल B",
    "compare.overview": "सारांश",
    "compare.irrig": "सिंचाई",
    "compare.fert": "उर्वरक",
    "common.reset": "रीसेट",
    "btn.demo": "लाइव डेमो",
  },
};

let lang = "en";
const setLang = (L) => {
  lang = L;
  qsa("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = dict[L][key] ?? el.textContent;
  });
  // Toggle selected state
  qsa(".pill").forEach((p) => p.classList.toggle("selected", p.dataset.lang === L));
};
qsa(".pill").forEach((p) => on(p, "click", () => setLang(p.dataset.lang)));

/* ---------- Nav / Section switching ---------- */
const sections = {
  soil: qs("#section-soil"),
  leaf: qs("#section-leaf"),
  compare: qs("#section-compare"),
};
qsa(".nav-link").forEach((btn) =>
  on(btn, "click", () => {
    const sec = btn.dataset.section;
    qsa(".nav-link").forEach((b) => b.classList.toggle("active", b === btn));
    Object.values(sections).forEach((s) => s.classList.remove("active"));
    sections[sec].classList.add("active");
    sections[sec].scrollIntoView({ behavior: "smooth", block: "start" });
  })
);
qsa("[data-scroll]").forEach((b) =>
  on(b, "click", () => {
    const id = b.getAttribute("data-scroll");
    qs(`#section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    qsa(".nav-link").forEach((n) => n.classList.toggle("active", n.dataset.section === id));
  })
);

/* ---------- Soil Advisor (simple heuristic + crops.json) ---------- */
const soilForm = qs("#soilForm");
const soilOut = qs("#soilOutput");
const cropList = qs("#cropList");
const fertPlan = qs("#fertPlan");
const irrPlan = qs("#irrigationPlan");

// robust fetch that tries multiple paths to /data/crops.json no matter where index.html is served from
async function loadCropDB() {
  const candidates = ["../data/crops.json", "./data/crops.json", "/data/crops.json"];
  for (const path of candidates) {
    try {
      const res = await fetch(path);
      if (res.ok) return res.json();
    } catch (e) { /* try next */ }
  }
  return [];
}
let CROPS = [];
loadCropDB().then((db) => (CROPS = db || []));

function analyzeSoil({ ph, n, p, k, moisture, type }) {
  const moistureCategory =
    moisture < 30 ? "low" : moisture <= 60 ? "medium" : "high";

  const phScore = ph >= 6 && ph <= 7.8 ? 2 : ph >= 5 && ph <= 8.5 ? 1 : 0;

  const cropScores = Object.entries(CROPS).map(([key, crop]) => {
    let score = 0;

    if (crop.best_soils?.includes(type)) score += 3;
    if (crop.water_need === moistureCategory) score += 2;
    score += phScore;
    score += crop.profit_index * 0.3; // small boost for profit crops

    return {
      name: crop.names[lang],
      key,
      score,
      notes: crop[`notes_${lang}`],
    };
  });

  const sorted = cropScores.sort((a, b) => b.score - a.score).slice(0, 5);

  // Fertilizer recommendation
  let fert = "";
  fert += ph < 6 ? (lang === "hi"
      ? "मिट्टी अम्लीय है, 1-2 टन चूना डालें।\n"
      : "Soil is acidic, apply 1–2 tons lime.\n")
    : ph > 7.8
    ? (lang === "hi"
      ? "मिट्टी क्षारीय है, जिप्सम/जैविक खाद डालें।\n"
      : "Soil is alkaline, add gypsum/organic compost.\n")
    : (lang === "hi"
      ? "pH अच्छा है, जैविक खाद मिलाते रहें।\n"
      : "pH good, keep adding organic manure.\n");

  fert += (lang === "hi"
    ? `N:${n} P:${p} K:${k} का संतुलन रखें, गोबर खाद और नीम खली मिलाएँ।`
    : `Balance N:${n} P:${p} K:${k}, add compost & neem cake.`);

  // Irrigation plan
  let irrig =
    moisture < 30
      ? (lang === "hi"
          ? "तुरंत सिंचाई करें, मल्चिंग करें।"
          : "Irrigate immediately, apply mulching.")
      : moisture > 60
      ? (lang === "hi"
          ? "पानी निकास सुधारें, जलभराव से बचें।"
          : "Improve drainage, avoid waterlogging.")
      : (lang === "hi"
          ? "नमी उचित है, नियमित निगरानी करें।"
          : "Moisture good, monitor weekly.");

  return {
    crops: sorted,
    fertilizer: fert,
    irrigation: irrig,
  };
}


on(soilForm, "submit", (e) => {
  e.preventDefault();
  
  const ph = parseFloat(qs("#ph").value || "6.5");
  const n = parseInt(qs("#nitrogen").value || "40");
  const p = parseInt(qs("#phosphorus").value || "25");
  const k = parseInt(qs("#potassium").value || "30");
  const moisture = parseInt(qs("#moisture").value || "40");
  const type = qs("#soilType").value || "loamy";

  const res = analyzeSoil({ ph, n, p, k, moisture, type });

  cropList.innerHTML = res.crops
    .map(c => `<li><strong>${c.name}</strong> — <small>${c.notes}</small></li>`)
    .join("");

  fertPlan.textContent = res.fertilizer;
  irrPlan.textContent = res.irrigation;

  soilOut.classList.remove("hidden");
});


/* ---------- Leaf Scanner ---------- */
const leafInput = qs("#leafInput");
const dropZone = qs("#dropZone");
const scanBtn = qs("#scanBtn");
const previewWrap = qs("#preview");
const previewImg = qs("#previewImg");
const changeImg = qs("#changeImg");
const leafLoader = qs("#leafLoader");
const leafResult = qs("#leafResult");

let currentBase64 = null;

function enableScan(state) {
  scanBtn.disabled = !state;
  scanBtn.textContent = state ? (dict[lang]["leaf.scan"]) : (lang === "hi" ? "अपलोड करें…" : "Uploading…");
}
function setLoader(show){
  leafLoader.classList.toggle("hidden", !show);
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function handleFile(file) {
  if (!file || !file.type?.startsWith("image/")) return;
  currentBase64 = await toBase64(file);
  previewImg.src = currentBase64;
  previewWrap.classList.remove("hidden");
  enableScan(true);
}

on(dropZone, "click", () => leafInput.click());
on(leafInput, "change", () => handleFile(leafInput.files?.[0]));

["dragenter", "dragover"].forEach((ev) =>
  on(dropZone, ev, (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(83,255,177,.7)";
  })
);
["dragleave", "drop"].forEach((ev) =>
  on(dropZone, ev, (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--stroke)";
  })
);
on(dropZone, "drop", async (e) => handleFile(e.dataTransfer.files?.[0]));
on(changeImg, "click", () => {
  currentBase64 = null;
  previewWrap.classList.add("hidden");
  enableScan(false);
});

async function callAnalyze() {
  if (!currentBase64) return;
  enableScan(false);
  setLoader(true);
  leafResult.classList.add("hidden");

  const crop = qs("#cropSelect").value || "";
  try {
    const resp = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: currentBase64, crop, lang }),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    renderLeafResult(data);
  } catch (err) {
    renderLeafResult({
      disease: lang === "hi" ? "त्रुटि" : "Error",
      confidence: "—",
      symptoms: [lang === "hi" ? "विश्लेषण असफल" : "Analysis failed"],
      organic_solution: "-",
      chemical_solution: "-",
      schedule: "-",
      warning: err.message || "Request failed",
    });
  } finally {
    setLoader(false);
    enableScan(true);
  }
}
on(scanBtn, "click", callAnalyze);

function renderLeafResult(r) {
  const ensureArr = (v) => Array.isArray(v) ? v : (typeof v === "string" ? v.split(/[•,\n]/).map(s=>s.trim()).filter(Boolean) : []);
  qs("#resDisease").textContent = r.disease || "—";
  qs("#resConf").textContent = r.confidence ? `${r.confidence}%` : "—";

  const symptoms = ensureArr(r.symptoms);
  qs("#resSymptoms").innerHTML = symptoms.length ? symptoms.map(s => `<li>${s}</li>`).join("") : "<li>—</li>";

  qs("#resOrganic").textContent = r.organic_solution || "—";
  qs("#resChemical").textContent = r.chemical_solution || "—";
  qs("#resSchedule").textContent = r.schedule || "—";
  qs("#resWarning").textContent = r.warning || "—";

  leafResult.classList.remove("hidden");
}

/* ---------- Crop Comparison ---------- */
const cropA = qs("#cropA");
const cropB = qs("#cropB");
const cmpOut = qs("#compareOutput");
const cmpOverview = qs("#cmpOverview");
const cmpIrr = qs("#cmpIrrigation");
const cmpFert = qs("#cmpFertilizer");

function populateCropSelects() {
  const names = (CROPS || []).map((c) => c.name);
  [cropA, cropB].forEach((sel) => {
    sel.innerHTML = `<option value="">—</option>` + names.map(n => `<option>${n}</option>`).join("");
  });
}
setTimeout(populateCropSelects, 600); // after DB load

[cropA, cropB].forEach((sel) =>
  on(sel, "change", () => {
    const A = CROPS.find((c) => c.name === cropA.value);
    const B = CROPS.find((c) => c.name === cropB.value);
    if (!A || !B) return (cmpOut.classList.add("hidden"));
    cmpOverview.textContent = `${A.name} vs ${B.name}\n• Seasons: ${A.season ?? "-"} vs ${B.season ?? "-"}\n• Soil: ${A.soil_types?.join(", ") ?? "-"} vs ${B.soil_types?.join(", ") ?? "-"}`;
    cmpIrr.textContent = `• ${A.name}: ${A.irrigation ?? "-"}\n• ${B.name}: ${B.irrigation ?? "-"}`;
    cmpFert.textContent = `• ${A.name}: ${A.fertilizer ?? "-"}\n• ${B.name}: ${B.fertilizer ?? "-"}`;
    cmpOut.classList.remove("hidden");
  })
);

/* ---------- Demo / defaults ---------- */
setLang("en");
on(qs("#demoBtn"), "click", (e) => {
  e.preventDefault();
  sections.leaf.scrollIntoView({ behavior: "smooth" });
});
