/* ==========================================================================
   AI 프로젝트 마스터 - 북마크 대시보드
   ==========================================================================

   TODO: 실제 링크로 교체 필요한 항목 (현재 url: "#")
   ------------------------------------------------------------------------
   1. [수업 자료] 용어사전 → 실제 링크로 교체
   2. [수업 자료] 수강생 깃허브 → 실제 링크로 교체
   3. [수업 자료] 이슈로그 → 실제 링크로 교체
   ------------------------------------------------------------------------
*/

// ---------------------------------------------------------------------------
// 데이터
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    id: "genai",
    icon: "🤖",
    title: "생성형 AI 서비스",
    sites: [
      { name: "ChatGPT", desc: "OpenAI의 대화형 AI 서비스", url: "https://chatgpt.com" },
      { name: "Claude", desc: "Anthropic의 대화형 AI 서비스", url: "https://claude.ai" },
      { name: "Gemini", desc: "Google의 대화형 AI 서비스", url: "https://gemini.google.com" },
      { name: "Qwen", desc: "Alibaba의 대화형 AI 서비스", url: "https://chat.qwen.ai" },
      { name: "퍼플렉시티", desc: "검색 기반 AI 답변 서비스", url: "https://www.perplexity.ai" },
    ],
  },
  {
    id: "tools",
    icon: "💻",
    title: "실습 도구",
    sites: [
      { name: "Google Colab", desc: "클라우드 기반 파이썬 노트북 실습 환경", url: "https://colab.research.google.com" },
      { name: "OpenRouter", desc: "다양한 LLM 모델을 한 번에 사용하는 API 게이트웨이", url: "https://openrouter.ai" },
      { name: "GitHub", desc: "코드 저장 및 버전 관리 플랫폼", url: "https://github.com" },
      { name: "OpenAI API Keys", desc: "OpenAI API 키 발급 및 관리 페이지", url: "https://platform.openai.com/api-keys" },
      { name: "Streamlit Apps", desc: "파이썬 기반 웹앱 빠른 제작 도구", url: "https://streamlit.io" },
    ],
  },
  {
    id: "design",
    icon: "🎨",
    title: "UX/UI 디자인",
    sites: [
      { name: "Figma", desc: "UI/UX 디자인 및 프로토타이핑 툴", url: "https://figma.com" },
      { name: "Dribbble", desc: "디자인 영감을 얻는 레퍼런스 플랫폼", url: "https://dribbble.com" },
      { name: "Coolors", desc: "컬러 팔레트 생성 도구", url: "https://coolors.co" },
      { name: "Canva", desc: "간편한 그래픽 디자인 제작 툴", url: "https://canva.com" },
      { name: "Material Design", desc: "구글 머티리얼 디자인 시스템 가이드", url: "https://m3.material.io" },
    ],
  },
  {
    id: "class",
    icon: "📚",
    title: "수업 자료",
    sites: [
      { name: "수업용 교안", desc: "커리큘럼 강의 교안", url: "https://note26.colabstart.workers.dev/" },
      { name: "학생작품 갤러리", desc: "수강생 프로젝트 결과물 모음", url: "https://class-project-gallery-2606.vercel.app/" },
      { name: "용어사전", desc: "AI/개발 용어 정리", url: "#" },
      { name: "수강생 깃허브", desc: "수강생 저장소 모음", url: "#" },
      { name: "이슈로그", desc: "수업 중 발생한 이슈 기록", url: "#" },
    ],
  },
  {
    id: "info",
    icon: "📊",
    title: "정보/유틸리티",
    sites: [
      { name: "AI 뉴스", desc: "AI 관련 최신 뉴스 모음", url: "https://ai-new.up.railway.app/" },
      { name: "경제 뉴스", desc: "경제 관련 최신 뉴스 모음", url: "https://biz-news-2607.up.railway.app/" },
      { name: "유튜브 인사이트", desc: "유튜브 트렌드/인사이트 분석", url: "https://yt-insight-100m-2608.vercel.app/" },
      { name: "URL 줄이기", desc: "긴 URL을 짧은 링크로 변환", url: "https://biz-link.click/" },
      { name: "코드붐", desc: "수업용 코드 실습 도구", url: "https://frontierall.github.io/CodeBom-2608/" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 사용자 추가 사이트 (localStorage)
// ---------------------------------------------------------------------------

const CUSTOM_SITES_KEY = "bookmarkDashboard.customSites";

function loadCustomSites() {
  try {
    const raw = localStorage.getItem(CUSTOM_SITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomSites() {
  localStorage.setItem(CUSTOM_SITES_KEY, JSON.stringify(customSites));
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function addCustomSite({ categoryId, name, desc, url }) {
  customSites.push({
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    categoryId,
    name: name.trim(),
    desc: desc.trim(),
    url: normalizeUrl(url),
  });
  saveCustomSites();
}

function deleteCustomSite(id) {
  customSites = customSites.filter((site) => site.id !== id);
  saveCustomSites();

  if (favoriteKeys.delete(id)) saveFavorites();

  const hadVisit = recentVisits.some((v) => v.key === id);
  if (hadVisit) {
    recentVisits = recentVisits.filter((v) => v.key !== id);
    saveRecentVisits();
  }

  renderAll();
}

// ---------------------------------------------------------------------------
// 즐겨찾기 (localStorage)
// ---------------------------------------------------------------------------

const FAVORITES_KEY = "bookmarkDashboard.favorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteKeys]));
}

function toggleFavorite(key) {
  if (favoriteKeys.has(key)) {
    favoriteKeys.delete(key);
  } else {
    favoriteKeys.add(key);
  }
  saveFavorites();
  renderAll();
}

// ---------------------------------------------------------------------------
// 최근 방문 기록 (localStorage)
// ---------------------------------------------------------------------------

const RECENT_VISITS_KEY = "bookmarkDashboard.recentVisits";
const RECENT_VISITS_LIMIT = 5;

function loadRecentVisits() {
  try {
    const raw = localStorage.getItem(RECENT_VISITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRecentVisits() {
  localStorage.setItem(RECENT_VISITS_KEY, JSON.stringify(recentVisits));
}

function recordVisit(site) {
  recentVisits = recentVisits.filter((v) => v.key !== site.key);
  recentVisits.unshift({
    key: site.key,
    id: site.id,
    name: site.name,
    desc: site.desc,
    url: site.url,
    categoryId: site.categoryId,
    categoryTitle: site.categoryTitle,
    isCustom: site.isCustom,
    visitedAt: Date.now(),
  });
  recentVisits = recentVisits.slice(0, RECENT_VISITS_LIMIT);
  saveRecentVisits();
  renderRecentSection();
}

function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// 백업 / 복원
// ---------------------------------------------------------------------------

function exportBackup() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    customSites,
    favorites: [...favoriteKeys],
    recentVisits,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);

  const a = document.createElement("a");
  a.href = url;
  a.download = `bookmark-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch (e) {
      alert("올바른 백업 파일이 아닙니다.");
      return;
    }

    const hasExisting =
      customSites.length > 0 || favoriteKeys.size > 0 || recentVisits.length > 0;
    if (hasExisting && !confirm("기존 데이터를 덮어씁니다. 계속하시겠습니까?")) {
      return;
    }

    localStorage.setItem(CUSTOM_SITES_KEY, JSON.stringify(data.customSites || []));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data.favorites || []));
    localStorage.setItem(RECENT_VISITS_KEY, JSON.stringify(data.recentVisits || []));
    location.reload();
  };
  reader.readAsText(file);
}

function initBackupRestore() {
  const backupBtn = document.getElementById("backup-btn");
  const restoreBtn = document.getElementById("restore-btn");
  const fileInput = document.getElementById("restore-file-input");

  backupBtn.addEventListener("click", exportBackup);

  restoreBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) importBackupFile(file);
    fileInput.value = "";
  });
}

// ---------------------------------------------------------------------------
// 상태
// ---------------------------------------------------------------------------

let selectedCategoryId = "all";
let searchTerm = "";
let customSites = loadCustomSites();
let favoriteKeys = loadFavorites();
let recentVisits = loadRecentVisits();

// ---------------------------------------------------------------------------
// 렌더링: 카테고리 내비게이션
// ---------------------------------------------------------------------------

function renderCategoryNav() {
  const nav = document.getElementById("category-nav");
  nav.innerHTML = "";

  nav.appendChild(createNavItem("all", "전체", getAllSites().length));

  CATEGORIES.forEach((cat) => {
    nav.appendChild(createNavItem(cat.id, cat.title, getSitesForCategory(cat).length));
  });
}

function createNavItem(id, title, count) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-item" + (id === selectedCategoryId ? " active" : "");
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-selected", id === selectedCategoryId ? "true" : "false");
  btn.innerHTML = `<span class="nav-item-label">${title}</span><span class="nav-item-count">${count}</span>`;
  btn.addEventListener("click", () => {
    selectedCategoryId = id;
    renderCategoryNav();
    renderGrid();
  });
  return btn;
}

// ---------------------------------------------------------------------------
// 렌더링: 카드 그리드
// ---------------------------------------------------------------------------

function getSitesForCategory(cat) {
  const custom = customSites.filter((site) => site.categoryId === cat.id);
  return [...cat.sites, ...custom].map((site) => ({
    ...site,
    categoryId: cat.id,
    categoryTitle: cat.title,
    isCustom: Boolean(site.id),
    key: site.id || `${cat.id}::${site.name}`,
  }));
}

function getAllSites() {
  return CATEGORIES.flatMap(getSitesForCategory);
}

function getVisibleSites() {
  const categories =
    selectedCategoryId === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === selectedCategoryId);

  const sites = categories.flatMap(getSitesForCategory);

  const term = searchTerm.trim().toLowerCase();
  if (!term) return sites;

  return sites.filter(
    (site) =>
      site.name.toLowerCase().includes(term) ||
      (site.desc && site.desc.toLowerCase().includes(term))
  );
}

function renderGrid() {
  const grid = document.getElementById("card-grid");
  const label = document.getElementById("selected-tab-label");
  const countText = document.getElementById("count-text");

  const sites = getVisibleSites();
  const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);

  label.textContent = cat ? cat.title : "전체";
  countText.textContent = `${sites.length}개 사이트`;

  grid.innerHTML = "";

  if (sites.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = searchTerm.trim()
      ? `"${searchTerm.trim()}"에 대한 검색 결과가 없습니다.`
      : "표시할 사이트가 없습니다.";
    grid.appendChild(empty);
    return;
  }

  sites.forEach((site) => {
    grid.appendChild(
      createSiteCard(site, { showCategory: selectedCategoryId === "all" })
    );
  });
}

// ---------------------------------------------------------------------------
// 렌더링: 사이트 카드 (그리드 / 즐겨찾기 / 최근 방문 공용)
// ---------------------------------------------------------------------------

function createSiteCard(site, { showCategory = true, visitedAt = null } = {}) {
  const card = document.createElement("a");
  card.className = "site-card";
  card.href = site.url;
  if (site.url !== "#") {
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.addEventListener("click", () => recordVisit(site));
  } else {
    card.addEventListener("click", (e) => e.preventDefault());
  }

  const isFav = favoriteKeys.has(site.key);
  const favoriteBtn = `<button type="button" class="favorite-btn${
    isFav ? " active" : ""
  }" title="즐겨찾기" aria-label="즐겨찾기 토글">${isFav ? "⭐" : "☆"}</button>`;
  const badge = site.url === "#" ? '<span class="badge-pending">링크 준비중</span>' : "";
  const deleteBtn = site.isCustom
    ? '<button type="button" class="delete-btn" title="삭제" aria-label="사이트 삭제">×</button>'
    : "";
  const visitedLabel = visitedAt
    ? `<span class="visited-time">${formatRelativeTime(visitedAt)}</span>`
    : "";

  card.innerHTML = `
    <div class="card-top-icons">
      ${favoriteBtn}
      ${badge}
      ${deleteBtn}
    </div>
    <div class="site-card-top">
      <span class="site-card-icon">${site.name.charAt(0)}</span>
      ${showCategory ? `<span class="site-card-category">${site.categoryTitle}</span>` : ""}
    </div>
    <span class="site-card-name">${site.name}</span>
    <span class="site-card-desc">${site.desc}</span>
    ${visitedLabel}
  `;

  card.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(site.key);
  });

  if (site.isCustom) {
    card.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm(`"${site.name}"을(를) 삭제할까요?`)) {
        deleteCustomSite(site.id);
      }
    });
  }

  return card;
}

// ---------------------------------------------------------------------------
// 렌더링: 즐겨찾기 섹션
// ---------------------------------------------------------------------------

function renderFavoritesSection() {
  const section = document.getElementById("favorites-section");
  const grid = document.getElementById("favorites-grid");
  const countText = document.getElementById("favorites-count-text");

  const favSites = getAllSites().filter((site) => favoriteKeys.has(site.key));

  if (favSites.length === 0) {
    section.hidden = true;
    grid.innerHTML = "";
    return;
  }

  section.hidden = false;
  countText.textContent = `${favSites.length}개`;
  grid.innerHTML = "";
  favSites.forEach((site) => {
    grid.appendChild(createSiteCard(site, { showCategory: true }));
  });
}

// ---------------------------------------------------------------------------
// 렌더링: 최근 방문 섹션
// ---------------------------------------------------------------------------

function renderRecentSection() {
  const section = document.getElementById("recent-section");
  const grid = document.getElementById("recent-grid");

  if (recentVisits.length === 0) {
    section.hidden = true;
    grid.innerHTML = "";
    return;
  }

  section.hidden = false;
  grid.innerHTML = "";
  recentVisits.forEach((visit) => {
    const site = {
      key: visit.key,
      id: visit.id,
      name: visit.name,
      desc: visit.desc,
      url: visit.url,
      categoryId: visit.categoryId,
      categoryTitle: visit.categoryTitle,
      isCustom: visit.isCustom,
    };
    grid.appendChild(
      createSiteCard(site, { showCategory: true, visitedAt: visit.visitedAt })
    );
  });
}

function renderAll() {
  renderCategoryNav();
  renderGrid();
  renderFavoritesSection();
  renderRecentSection();
}

// ---------------------------------------------------------------------------
// 검색
// ---------------------------------------------------------------------------

function initSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    searchTerm = input.value;
    renderGrid();
  });
}

// ---------------------------------------------------------------------------
// 사이트 추가 다이얼로그
// ---------------------------------------------------------------------------

function populateCategorySelect() {
  const select = document.getElementById("site-category");
  select.innerHTML = CATEGORIES.map(
    (cat) => `<option value="${cat.id}">${cat.title}</option>`
  ).join("");
}

function initAddDialog() {
  const dialog = document.getElementById("add-site-dialog");
  const form = document.getElementById("add-site-form");
  const openBtn = document.getElementById("open-add-dialog");
  const cancelBtn = document.getElementById("cancel-add-dialog");
  const categorySelect = document.getElementById("site-category");
  const nameInput = document.getElementById("site-name");
  const descInput = document.getElementById("site-desc");
  const urlInput = document.getElementById("site-url");

  populateCategorySelect();

  openBtn.addEventListener("click", () => {
    form.reset();
    if (selectedCategoryId !== "all") {
      categorySelect.value = selectedCategoryId;
    }
    dialog.showModal();
    nameInput.focus();
  });

  cancelBtn.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!nameInput.value.trim() || !urlInput.value.trim()) return;

    const categoryId = categorySelect.value;
    addCustomSite({
      categoryId,
      name: nameInput.value,
      desc: descInput.value,
      url: urlInput.value,
    });

    selectedCategoryId = categoryId;
    renderAll();
    dialog.close();
  });
}

// ---------------------------------------------------------------------------
// 다크모드 토글
// ---------------------------------------------------------------------------

function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentlyDark = current ? current === "dark" : prefersDark;
    const next = currentlyDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// ---------------------------------------------------------------------------
// 맨 위로 가기
// ---------------------------------------------------------------------------

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------------------------------------------------------------------------
// 초기화
// ---------------------------------------------------------------------------

function init() {
  renderAll();
  initSearch();
  initAddDialog();
  initTheme();
  initBackToTop();
  initBackupRestore();
}

document.addEventListener("DOMContentLoaded", init);
