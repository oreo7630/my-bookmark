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
// 상태
// ---------------------------------------------------------------------------

let selectedCategoryId = "all";

// ---------------------------------------------------------------------------
// 렌더링: 탭
// ---------------------------------------------------------------------------

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = "";

  const allBtn = createTabButton("all", "전체", "🗂️");
  tabs.appendChild(allBtn);

  CATEGORIES.forEach((cat) => {
    tabs.appendChild(createTabButton(cat.id, cat.title, cat.icon));
  });
}

function createTabButton(id, title, icon) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tab-btn" + (id === selectedCategoryId ? " active" : "");
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-selected", id === selectedCategoryId ? "true" : "false");
  btn.innerHTML = `<span>${icon}</span><span>${title}</span>`;
  btn.addEventListener("click", () => {
    selectedCategoryId = id;
    renderTabs();
    renderGrid();
  });
  return btn;
}

// ---------------------------------------------------------------------------
// 렌더링: 카드 그리드
// ---------------------------------------------------------------------------

function getVisibleSites() {
  if (selectedCategoryId === "all") {
    return CATEGORIES.flatMap((cat) =>
      cat.sites.map((site) => ({ ...site, categoryTitle: cat.title }))
    );
  }
  const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
  return cat ? cat.sites.map((site) => ({ ...site, categoryTitle: cat.title })) : [];
}

function renderGrid() {
  const grid = document.getElementById("card-grid");
  const label = document.getElementById("selected-tab-label");
  const countText = document.getElementById("count-text");

  const sites = getVisibleSites();
  const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);

  label.textContent = cat ? `${cat.icon} ${cat.title}` : "🗂️ 전체";
  countText.textContent = `${sites.length}개 사이트`;

  grid.innerHTML = "";

  if (sites.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "표시할 사이트가 없습니다.";
    grid.appendChild(empty);
    return;
  }

  sites.forEach((site) => {
    const card = document.createElement("a");
    card.className = "site-card";
    card.href = site.url;
    if (site.url !== "#") {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.addEventListener("click", (e) => e.preventDefault());
    }

    const badge = site.url === "#" ? '<span class="badge-pending">링크 준비중</span>' : "";

    card.innerHTML = `
      ${badge}
      <div class="site-card-top">
        <span class="site-card-icon">${site.name.charAt(0)}</span>
        ${selectedCategoryId === "all" ? `<span class="site-card-category">${site.categoryTitle}</span>` : ""}
      </div>
      <span class="site-card-name">${site.name}</span>
      <span class="site-card-desc">${site.desc}</span>
    `;
    grid.appendChild(card);
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
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------------------------------------------------------------------------
// 초기화
// ---------------------------------------------------------------------------

function init() {
  renderTabs();
  renderGrid();
  initTheme();
  initBackToTop();
}

document.addEventListener("DOMContentLoaded", init);
