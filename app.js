"use strict";

const STORAGE_KEY = "riri-daily-lists-v1";
const DEFAULT_QUOTE =
  "不必一下子完成所有事，只要向前一点就好。";
const PRIORITIES = {
  red: { label: "紧急", order: 0, description: "优先处理" },
  orange: { label: "重要", order: 1, description: "重点推进" },
  green: { label: "日常", order: 2, description: "按计划完成" },
  gray: { label: "稍后", order: 3, description: "有空再做" },
};
const LIST_COLORS = ["#e8b88b", "#91ad95", "#d99180", "#8da9bd", "#c3a7c7"];
const SAKURA_STAGES = [
  {
    min: 0,
    name: "初生树苗",
    description: "一棵刚刚抽枝的小树",
    scale: 0.34,
    nextLabel: "再完成 {left} 项开始生长",
  },
  {
    min: 30,
    name: "抽枝小树",
    description: "枝叶正在向光生长",
    scale: 0.5,
    nextLabel: "再完成 {left} 项长出新枝",
  },
  {
    min: 90,
    name: "含苞树影",
    description: "树上已经藏满细小的花苞",
    scale: 0.68,
    nextLabel: "再完成 {left} 项等待花开",
  },
  {
    min: 180,
    name: "盛开樱树",
    description: "认真生活的日子，正开成花",
    scale: 0.84,
    nextLabel: "再完成 {left} 项让树冠更丰盛",
  },
  {
    min: 320,
    name: "满庭花冠",
    description: "你的樱花树已经长成一片春天",
    scale: 1,
    nextLabel: "继续记录，花会一直开",
  },
];
const BLOSSOM_ANCHORS = [
  [354, 99],
  [374, 126],
  [389, 135],
  [411, 146],
  [425, 171],
  [443, 174],
  [456, 188],
  [472, 176],
  [492, 183],
  [506, 160],
  [520, 140],
  [529, 117],
  [545, 105],
  [558, 100],
  [574, 128],
  [590, 146],
  [607, 162],
  [622, 146],
  [638, 128],
  [652, 111],
  [665, 105],
  [681, 94],
  [698, 82],
  [430, 266],
  [450, 250],
  [488, 237],
  [523, 225],
  [557, 219],
  [586, 232],
  [603, 240],
  [625, 255],
  [506, 198],
  [524, 205],
  [548, 193],
  [574, 184],
  [518, 239],
  [548, 250],
  [579, 264],
];

const elements = {
  headerDate: document.querySelector("#headerDate"),
  greeting: document.querySelector("#greeting"),
  sidebarDate: document.querySelector("#sidebarDate"),
  dateStampMonth: document.querySelector("#dateStampMonth"),
  dateStampDay: document.querySelector("#dateStampDay"),
  dateStampWeekday: document.querySelector("#dateStampWeekday"),
  dateStampButton: document.querySelector("#dateStampButton"),
  dateRailWrap: document.querySelector("#dateRailWrap"),
  dateRail: document.querySelector("#dateRail"),
  previousDateButton: document.querySelector("#previousDateButton"),
  nextDateButton: document.querySelector("#nextDateButton"),
  listNav: document.querySelector("#listNav"),
  listSection: document.querySelector(".list-nav-section"),
  sidebarResizer: document.querySelector("#sidebarResizer"),
  toggleListPaneButton: document.querySelector("#toggleListPaneButton"),
  manageCurrentListButton: document.querySelector("#manageCurrentListButton"),
  sidebarQuoteText: document.querySelector("#sidebarQuoteText"),
  sidebarQuoteSource: document.querySelector("#sidebarQuoteSource"),
  editQuoteButton: document.querySelector("#editQuoteButton"),
  soundToggle: document.querySelector("#soundToggle"),
  viewNav: document.querySelector("#viewNav"),
  viewButtons: Array.from(document.querySelectorAll("[data-view]")),
  todayViewCount: document.querySelector("#todayViewCount"),
  historyViewCount: document.querySelector("#historyViewCount"),
  futureViewCount: document.querySelector("#futureViewCount"),
  activeListOverline: document.querySelector("#activeListOverline"),
  activeListTitle: document.querySelector("#activeListTitle"),
  activeListSubtitle: document.querySelector("#activeListSubtitle"),
  progressKicker: document.querySelector("#progressKicker"),
  progressHeading: document.querySelector("#progressHeading"),
  progressPercent: document.querySelector("#progressPercent"),
  progressCaption: document.querySelector("#progressCaption"),
  progressChip: document.querySelector("#progressChip"),
  progressTrack: document.querySelector("#progressTrack"),
  progressFill: document.querySelector("#progressFill"),
  progressGlint: document.querySelector("#progressGlint"),
  moodCard: document.querySelector("#moodCard"),
  moodFace: document.querySelector("#moodFace"),
  moodLabel: document.querySelector("#moodLabel"),
  moodTitle: document.querySelector("#moodTitle"),
  moodMessage: document.querySelector("#moodMessage"),
  sakuraGarden: document.querySelector(".sakura-garden"),
  sakuraArt: document.querySelector("#sakuraArt"),
  sakuraTreePosition: document.querySelector("#sakuraTreePosition"),
  sakuraDashboard: document.querySelector(".sakura-dashboard"),
  sakuraSkyNote: document.querySelector("#sakuraSkyNote"),
  sakuraTreeGroup: document.querySelector("#sakuraTreeGroup"),
  sakuraBlossoms: document.querySelector("#sakuraBlossoms"),
  sakuraFalling: document.querySelector("#sakuraFalling"),
  sakuraStageLabel: document.querySelector("#sakuraStageLabel"),
  sakuraCheckin: document.querySelector("#sakuraCheckin"),
  sakuraPetals: document.querySelector("#sakuraPetals"),
  sakuraStreak: document.querySelector("#sakuraStreak"),
  sakuraStageName: document.querySelector("#sakuraStageName"),
  sakuraNextStage: document.querySelector("#sakuraNextStage"),
  sakuraGrowthTrack: document.querySelector("#sakuraGrowthTrack"),
  sakuraGrowthFill: document.querySelector("#sakuraGrowthFill"),
  sakuraCompletedCount: document.querySelector("#sakuraCompletedCount"),
  sakuraBestStreak: document.querySelector("#sakuraBestStreak"),
  sakuraWhisper: document.querySelector("#sakuraWhisper"),
  taskForm: document.querySelector("#taskForm"),
  taskInput: document.querySelector("#taskInput"),
  composerTarget: document.querySelector("#composerTarget"),
  historyNotice: document.querySelector("#historyNotice"),
  taskList: document.querySelector("#taskList"),
  emptyState: document.querySelector("#emptyState"),
  emptyTitle: document.querySelector("#emptyTitle"),
  emptyDescription: document.querySelector("#emptyDescription"),
  emptyActionButton: document.querySelector("#emptyActionButton"),
  allCount: document.querySelector("#allCount"),
  pendingCount: document.querySelector("#pendingCount"),
  doneCount: document.querySelector("#doneCount"),
  visibleSummary: document.querySelector("#visibleSummary"),
  filterButtons: Array.from(document.querySelectorAll("[data-filter]")),
  sidebar: document.querySelector("#sidebar"),
  taskWorkspace: document.querySelector("#taskWorkspace"),
  sakuraTab: document.querySelector("#sakuraTab"),
  tasksTab: document.querySelector("#tasksTab"),
  sakuraPanelClose: document.querySelector("#sakuraPanelClose"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  mobileMenuButton: document.querySelector("#mobileMenuButton"),
  sidebarClose: document.querySelector("#sidebarClose"),
  listModal: document.querySelector("#listModal"),
  listModalTitle: document.querySelector("#listModalTitle"),
  listModalDescription: document.querySelector("#listModalDescription"),
  listForm: document.querySelector("#listForm"),
  listNameInput: document.querySelector("#listNameInput"),
  listSubmitButton: document.querySelector("#listSubmitButton"),
  manageListModal: document.querySelector("#manageListModal"),
  manageListTitle: document.querySelector("#manageListTitle"),
  manageListDescription: document.querySelector("#manageListDescription"),
  manageRenameButton: document.querySelector("#manageRenameButton"),
  manageDeleteButton: document.querySelector("#manageDeleteButton"),
  quoteModal: document.querySelector("#quoteModal"),
  quoteForm: document.querySelector("#quoteForm"),
  quoteModeInputs: Array.from(
    document.querySelectorAll('input[name="quoteMode"]'),
  ),
  quoteInput: document.querySelector("#quoteInput"),
  quoteCharacterCount: document.querySelector("#quoteCharacterCount"),
  resetQuoteButton: document.querySelector("#resetQuoteButton"),
  installAppButton: document.querySelector("#installAppButton"),
  installModal: document.querySelector("#installModal"),
  nativeInstallButton: document.querySelector("#nativeInstallButton"),
  dateModal: document.querySelector("#dateModal"),
  calendarGrid: document.querySelector("#calendarGrid"),
  calendarMonthLabel: document.querySelector("#calendarMonthLabel"),
  calendarSelectedLabel: document.querySelector("#calendarSelectedLabel"),
  calendarPreviousMonth: document.querySelector("#calendarPreviousMonth"),
  calendarNextMonth: document.querySelector("#calendarNextMonth"),
  calendarQuickButtons: Array.from(
    document.querySelectorAll("[data-quick-date]"),
  ),
  priorityMenu: document.querySelector("#priorityMenu"),
  importModal: document.querySelector("#importModal"),
  importListName: document.querySelector("#importListName"),
  fileDropZone: document.querySelector("#fileDropZone"),
  fileInput: document.querySelector("#fileInput"),
  confirmModal: document.querySelector("#confirmModal"),
  confirmTitle: document.querySelector("#confirmTitle"),
  confirmDescription: document.querySelector("#confirmDescription"),
  confirmDeleteButton: document.querySelector("#confirmDeleteButton"),
  toastRegion: document.querySelector("#toastRegion"),
};

let state = loadState();
let currentFilter = "all";
let currentView = "today";
let selectedDate = localDateKey();
let listModalMode = "create";
let managedListId = null;
let calendarCursor = selectedDate;
let priorityMenuTaskId = null;
let sidebarDragState = null;
let deferredInstallPrompt = null;
let confirmAction = null;
let lastFocusedElement = null;
let soundContext = null;
let renderedSakuraPetals = null;
let renderedSakuraStage = null;
let activeAppTab = "tree";
let treeStatusOpen = false;

const SOUND_PATTERNS = {
  viewToday: {
    volume: 0.035,
    notes: [
      [523.25, 0, 0.2],
      [659.25, 0.075, 0.24],
    ],
  },
  viewHistory: {
    volume: 0.032,
    notes: [
      [440, 0, 0.22],
      [392, 0.11, 0.27],
    ],
  },
  viewFuture: {
    volume: 0.034,
    notes: [
      [523.25, 0, 0.18],
      [659.25, 0.065, 0.18],
      [783.99, 0.13, 0.27],
    ],
  },
  filterAll: {
    volume: 0.03,
    notes: [
      [349.23, 0, 0.17],
      [392, 0.065, 0.2],
    ],
  },
  filterPending: {
    volume: 0.03,
    notes: [
      [440, 0, 0.17],
      [554.37, 0.065, 0.2],
    ],
  },
  filterDone: {
    volume: 0.03,
    notes: [
      [587.33, 0, 0.17],
      [698.46, 0.065, 0.21],
    ],
  },
  taskAdded: {
    volume: 0.036,
    notes: [
      [523.25, 0, 0.16],
      [659.25, 0.055, 0.17],
      [783.99, 0.11, 0.22],
    ],
  },
  taskDone: {
    volume: 0.036,
    notes: [
      [659.25, 0, 0.17],
      [783.99, 0.065, 0.18],
      [880, 0.13, 0.25],
    ],
  },
  taskSkipped: {
    volume: 0.028,
    notes: [
      [392, 0, 0.18],
      [329.63, 0.08, 0.24],
    ],
  },
  taskDeleted: {
    volume: 0.027,
    notes: [
      [440, 0, 0.17],
      [349.23, 0.075, 0.22],
    ],
  },
  dateChanged: {
    volume: 0.03,
    notes: [
      [493.88, 0, 0.16],
      [587.33, 0.06, 0.2],
    ],
  },
  toggleOn: {
    volume: 0.034,
    notes: [
      [523.25, 0, 0.16],
      [783.99, 0.07, 0.23],
    ],
  },
  toggleOff: {
    volume: 0.025,
    notes: [
      [440, 0, 0.15],
      [349.23, 0.065, 0.2],
    ],
  },
  sakuraBloom: {
    volume: 0.03,
    notes: [
      [659.25, 0, 0.18],
      [783.99, 0.075, 0.2],
      [987.77, 0.15, 0.28],
    ],
  },
  petalsFall: {
    volume: 0.024,
    notes: [
      [440, 0, 0.18],
      [369.99, 0.09, 0.22],
      [293.66, 0.18, 0.28],
    ],
  },
};

const LIST_TAB_FREQUENCIES = [
  329.63, 369.99, 392, 440, 493.88, 523.25, 587.33,
];
const FILTER_TAB_SOUNDS = {
  all: "filterAll",
  pending: "filterPending",
  done: "filterDone",
};

function getSoundContext() {
  if (soundContext) return soundContext;
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  soundContext = new AudioContextClass();
  return soundContext;
}

function playSoftTones(notes, volume = 0.032) {
  if (!state.soundEnabled) return;
  const context = getSoundContext();
  if (!context) return;
  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }

  const startTime = context.currentTime + 0.012;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2600, startTime);
  filter.Q.setValueAtTime(0.55, startTime);
  filter.connect(context.destination);

  notes.forEach(([frequency, delay, duration]) => {
    const toneStart = startTime + delay;
    const toneEnd = toneStart + duration;
    const mainGain = context.createGain();
    const mainOscillator = context.createOscillator();
    const shimmerGain = context.createGain();
    const shimmerOscillator = context.createOscillator();

    mainOscillator.type = "sine";
    mainOscillator.frequency.setValueAtTime(frequency, toneStart);
    mainGain.gain.setValueAtTime(0.0001, toneStart);
    mainGain.gain.exponentialRampToValueAtTime(volume, toneStart + 0.018);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
    mainOscillator.connect(mainGain).connect(filter);

    shimmerOscillator.type = "sine";
    shimmerOscillator.frequency.setValueAtTime(frequency * 2.005, toneStart);
    shimmerGain.gain.setValueAtTime(0.0001, toneStart);
    shimmerGain.gain.exponentialRampToValueAtTime(
      volume * 0.12,
      toneStart + 0.016,
    );
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
    shimmerOscillator.connect(shimmerGain).connect(filter);

    mainOscillator.start(toneStart);
    shimmerOscillator.start(toneStart);
    mainOscillator.stop(toneEnd + 0.03);
    shimmerOscillator.stop(toneEnd + 0.03);
  });
}

function playSound(name) {
  const pattern = SOUND_PATTERNS[name];
  if (!pattern) return;
  playSoftTones(pattern.notes, pattern.volume);
}

function playListTabSound(listId) {
  const listIndex = Math.max(
    0,
    state.lists.findIndex((list) => list.id === listId),
  );
  const rootFrequency =
    LIST_TAB_FREQUENCIES[listIndex % LIST_TAB_FREQUENCIES.length];
  playSoftTones(
    [
      [rootFrequency, 0, 0.18],
      [rootFrequency * 1.25, 0.07, 0.23],
    ],
    0.03,
  );
}

function playPrioritySound(priority) {
  const frequencies = {
    red: 349.23,
    orange: 392,
    green: 466.16,
    gray: 392,
  };
  const frequency = frequencies[priority] || 440;
  playSoftTones(
    [
      [frequency, 0, 0.16],
      [frequency * 1.12, 0.06, 0.2],
    ],
    0.028,
  );
}

function renderSoundControl() {
  const enabled = state.soundEnabled !== false;
  elements.soundToggle.setAttribute("aria-pressed", String(enabled));
  elements.soundToggle.setAttribute(
    "aria-label",
    enabled ? "关闭界面音效" : "开启界面音效",
  );
  elements.soundToggle.title = enabled ? "界面音效已开启" : "界面音效已关闭";
}

function renderAppTabs() {
  const isTree = activeAppTab === "tree";
  document.body.classList.toggle("app-mode-tree", isTree);
  document.body.classList.toggle("app-mode-tasks", !isTree);
  document.body.classList.toggle(
    "tree-status-open",
    isTree && treeStatusOpen,
  );
  elements.sakuraTab.classList.toggle("is-active", isTree);
  elements.tasksTab.classList.toggle("is-active", !isTree);
  elements.sakuraTab.setAttribute("aria-selected", String(isTree));
  elements.tasksTab.setAttribute("aria-selected", String(!isTree));
  elements.sakuraTab.setAttribute(
    "aria-expanded",
    String(isTree && treeStatusOpen),
  );
  elements.taskWorkspace.setAttribute("aria-hidden", String(isTree));
  elements.sakuraGarden.setAttribute("aria-hidden", String(!isTree));
  elements.sakuraDashboard.setAttribute(
    "aria-hidden",
    String(!isTree || !treeStatusOpen),
  );
  elements.sakuraSkyNote.setAttribute(
    "aria-hidden",
    String(!isTree || !treeStatusOpen),
  );
  document.title = isTree ? "日日 · 我的樱花树" : "日日 · 今日清单";
}

function setAppTab(tab) {
  if (tab === "tree") {
    const wasAlreadyOnTree = activeAppTab === "tree";
    activeAppTab = "tree";
    treeStatusOpen = wasAlreadyOnTree ? !treeStatusOpen : true;
    playSound("sakuraBloom");
  } else {
    activeAppTab = "tasks";
    treeStatusOpen = false;
    playSound("viewToday");
  }
  closePriorityMenu();
  renderAppTabs();
  renderSakuraGarden();
  if (tab === "tasks") {
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      elements.taskInput.focus({ preventScroll: true });
    }, 80);
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function shiftDateKey(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

function isValidDateKey(dateKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""));
}

function createTask(
  title,
  priority = "green",
  status = "pending",
  date = localDateKey(),
) {
  return {
    id: uid("task"),
    title,
    priority,
    status,
    date: isValidDateKey(date) ? date : localDateKey(),
    createdAt: new Date().toISOString(),
  };
}

function createInitialState() {
  const lists = [
    {
      id: "today",
      name: "今日清单",
      color: LIST_COLORS[0],
      tasks: [
        createTask("完成产品需求梳理", "red", "done"),
        createTask("阅读 30 分钟", "orange", "done"),
        createTask("回复两封重要邮件", "orange", "done"),
        createTask("晚间拉伸 15 分钟", "green", "skipped"),
        createTask("整理本周照片", "gray", "pending"),
      ],
    },
    {
      id: "growth",
      name: "工作与成长",
      color: LIST_COLORS[1],
      tasks: [
        createTask("整理项目周报", "orange", "pending"),
        createTask("学习一个设计案例", "green", "done"),
      ],
    },
    {
      id: "life",
      name: "生活日常",
      color: LIST_COLORS[2],
      tasks: [
        createTask("给植物浇水", "green", "pending"),
        createTask("采购本周食材", "orange", "pending"),
      ],
    },
  ];

  return {
    activeListId: "today",
    quote: {
      mode: "default",
      text: DEFAULT_QUOTE,
    },
    soundEnabled: true,
    sidebarUi: {
      listHeight: null,
      listCollapsed: false,
    },
    garden: deriveGardenFromTasks(lists),
    lists,
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.lists) || saved.lists.length === 0) {
      return createInitialState();
    }

    const lists = saved.lists
      .filter((list) => list && typeof list.name === "string")
      .map((list) => ({
        id: list.id || uid("list"),
        name: list.name,
        color: list.color || LIST_COLORS[0],
        tasks: Array.isArray(list.tasks)
          ? list.tasks
              .filter((task) => task && typeof task.title === "string")
              .map((task) => ({
                id: task.id || uid("task"),
                title: task.title,
                priority: PRIORITIES[task.priority] ? task.priority : "green",
                status: ["pending", "done", "skipped"].includes(task.status)
                  ? task.status
                  : "pending",
                date: isValidDateKey(task.date)
                  ? task.date
                  : localDateKey(),
                createdAt: task.createdAt || new Date().toISOString(),
              }))
          : [],
      }));

    if (!lists.length) return createInitialState();

    return {
      lists,
      quote: {
        mode: saved.quote?.mode === "custom" ? "custom" : "default",
        text:
          typeof saved.quote?.text === "string" && saved.quote.text.trim()
            ? saved.quote.text.trim()
            : DEFAULT_QUOTE,
      },
      soundEnabled: saved.soundEnabled !== false,
      sidebarUi: {
        listHeight:
          Number(saved.sidebarUi?.listHeight) > 0
            ? Number(saved.sidebarUi.listHeight)
            : null,
        listCollapsed: Boolean(saved.sidebarUi?.listCollapsed),
      },
      garden: normalizeGarden(saved.garden, lists),
      activeListId: lists.some((list) => list.id === saved.activeListId)
        ? saved.activeListId
        : lists[0].id,
    };
  } catch (error) {
    console.warn("无法读取本地清单，已载入示例数据。", error);
    return createInitialState();
  }
}

function deriveGardenFromTasks(lists) {
  const today = localDateKey();
  const doneTasks = lists
    .flatMap((list) => list.tasks)
    .filter((task) => task.status === "done" && task.date <= today);
  const activeDates = [...new Set(doneTasks.map((task) => task.date))].sort();
  const latestDate = activeDates.length
    ? activeDates[activeDates.length - 1]
    : null;
  let streak = 0;
  if (latestDate === today || latestDate === shiftDateKey(today, -1)) {
    let cursor = latestDate;
    const dateSet = new Set(activeDates);
    while (dateSet.has(cursor)) {
      streak += 1;
      cursor = shiftDateKey(cursor, -1);
    }
  }
  return {
    streak,
    bestStreak: streak,
    petals: activeDates.length,
    growthPoints: doneTasks.length * 10,
    completedTasks: doneTasks.length,
    awardedTaskIds: doneTasks.map((task) => task.id),
    lastCareDate: latestDate,
    penaltyProcessedThrough: today,
    missedDays: 0,
    lastPenalty: 0,
    lastPenaltyDate: null,
    creationDate: today,
    creationCount: 0,
  };
}

function normalizeGarden(savedGarden, lists) {
  if (!savedGarden || typeof savedGarden !== "object") {
    return deriveGardenFromTasks(lists);
  }
  const numberOrZero = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
  };
  return {
    streak: numberOrZero(savedGarden.streak),
    bestStreak: numberOrZero(savedGarden.bestStreak),
    petals: numberOrZero(savedGarden.petals),
    growthPoints: numberOrZero(savedGarden.growthPoints),
    completedTasks: numberOrZero(savedGarden.completedTasks),
    awardedTaskIds: Array.isArray(savedGarden.awardedTaskIds)
      ? [...new Set(savedGarden.awardedTaskIds.filter((id) => typeof id === "string"))]
      : [],
    lastCareDate: isValidDateKey(savedGarden.lastCareDate)
      ? savedGarden.lastCareDate
      : null,
    penaltyProcessedThrough: isValidDateKey(
      savedGarden.penaltyProcessedThrough,
    )
      ? savedGarden.penaltyProcessedThrough
      : localDateKey(),
    missedDays: numberOrZero(savedGarden.missedDays),
    lastPenalty: numberOrZero(savedGarden.lastPenalty),
    lastPenaltyDate: isValidDateKey(savedGarden.lastPenaltyDate)
      ? savedGarden.lastPenaltyDate
      : null,
    creationDate: isValidDateKey(savedGarden.creationDate)
      ? savedGarden.creationDate
      : localDateKey(),
    creationCount: numberOrZero(savedGarden.creationCount),
  };
}

function dateDifference(laterDate, earlierDate) {
  return Math.round(
    (parseDateKey(laterDate) - parseDateKey(earlierDate)) / 86400000,
  );
}

function reconcileGardenPenalties() {
  const garden = state.garden;
  if (!garden) return 0;
  const today = localDateKey();
  const yesterday = shiftDateKey(today, -1);
  const lastProcessed =
    garden.penaltyProcessedThrough || garden.lastCareDate || yesterday;
  const firstMissedDate = shiftDateKey(lastProcessed, 1);
  if (firstMissedDate > yesterday) return 0;

  const missedDays = dateDifference(yesterday, firstMissedDate) + 1;
  if (missedDays <= 0) return 0;
  const penalty = missedDays * 10;
  garden.petals = Math.max(0, garden.petals - penalty);
  garden.streak = 0;
  garden.missedDays += missedDays;
  garden.lastPenalty = penalty;
  garden.lastPenaltyDate = yesterday;
  garden.penaltyProcessedThrough = yesterday;
  return penalty;
}

function getSakuraStage(growthPoints) {
  let index = 0;
  SAKURA_STAGES.forEach((stage, stageIndex) => {
    if (growthPoints >= stage.min) index = stageIndex;
  });
  return { stage: SAKURA_STAGES[index], index };
}

function recordGardenCompletion(task) {
  const garden = state.garden;
  const priorPenalty = reconcileGardenPenalties();
  const isNewCompletion = !garden.awardedTaskIds.includes(task.id);
  if (isNewCompletion) {
    garden.awardedTaskIds.push(task.id);
    garden.growthPoints += 12;
    garden.completedTasks += 1;
  }

  const today = localDateKey();
  let newPetal = false;
  if (garden.lastCareDate !== today) {
    garden.streak =
      garden.lastCareDate === shiftDateKey(today, -1)
        ? garden.streak + 1
        : 1;
    garden.bestStreak = Math.max(garden.bestStreak, garden.streak);
    garden.petals += 1;
    garden.lastCareDate = today;
    newPetal = true;
  }
  return { priorPenalty, isNewCompletion, newPetal };
}

function recordGardenTaskCreated() {
  const garden = state.garden;
  const today = localDateKey();
  if (garden.creationDate !== today) {
    garden.creationDate = today;
    garden.creationCount = 0;
  }
  if (garden.creationCount >= 3) return 0;
  garden.creationCount += 1;
  garden.growthPoints += 4;
  return 4;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("无法保存到本地。", error);
    showToast("浏览器无法保存数据，请检查隐私设置");
  }
}

function getActiveList() {
  return (
    state.lists.find((list) => list.id === state.activeListId) || state.lists[0]
  );
}

function getTasksForDate(date = localDateKey()) {
  return state.lists.flatMap((list) =>
    list.tasks
      .filter((task) => task.date === date)
      .map((task) => ({
        ...task,
        listId: list.id,
        listName: list.name,
      })),
  );
}

function getScopedTasks() {
  if (currentView === "today") {
    return getActiveList().tasks.filter((task) => task.date === localDateKey());
  }
  return getTasksForDate(selectedDate);
}

function getDateDetails(dateKey) {
  const date = parseDateKey(dateKey);
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return {
    date,
    key: dateKey,
    month: months[date.getMonth()],
    day: String(date.getDate()).padStart(2, "0"),
    weekday: weekdays[date.getDay()],
    shortWeekday: weekdays[date.getDay()].replace("星期", "周"),
    fullDate: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
  };
}

function latestPastRecordDate() {
  const today = localDateKey();
  const dates = state.lists.flatMap((list) =>
    list.tasks.map((task) => task.date).filter((date) => date < today),
  );
  return dates.length
    ? dates.sort()[dates.length - 1]
    : shiftDateKey(today, -1);
}

function earliestFuturePlanDate() {
  const today = localDateKey();
  const dates = state.lists.flatMap((list) =>
    list.tasks.map((task) => task.date).filter((date) => date > today),
  );
  return dates.length ? dates.sort()[0] : shiftDateKey(today, 1);
}

function findTask(taskId) {
  for (const list of state.lists) {
    const index = list.tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) return { list, task: list.tasks[index], index };
  }
  return null;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayInfo() {
  const now = new Date();
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return {
    now,
    fullDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${weekdays[now.getDay()]}`,
    month: months[now.getMonth()],
    day: String(now.getDate()).padStart(2, "0"),
    weekday: weekdays[now.getDay()],
  };
}

function greetingForHour(hour) {
  if (hour < 5) return "夜深了，记得给自己留一点休息。";
  if (hour < 11) return "早上好，今天从一件小事开始。";
  if (hour < 14) return "中午好，先深呼吸，再继续。";
  if (hour < 18) return "下午好，今天也在稳稳前进。";
  return "晚上好，今天也辛苦了。";
}

function calculateProgress(tasks) {
  const done = tasks.filter((task) => task.status === "done").length;
  const skipped = tasks.filter((task) => task.status === "skipped").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  return {
    done,
    skipped,
    pending,
    total: tasks.length,
    percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
  };
}

function moodFor(percent) {
  if (percent === 100) {
    return {
      type: "happy",
      title: "这一页已完成",
      message: "每一件完成的事，都值得庆祝",
      chip: "状态满格",
      color: "#6f9f70",
      svg: `
        <svg viewBox="0 0 62 62">
          <path d="M18 27h.1M44 27h.1" />
          <path d="M18 38c3.3 6 8.2 9 13 9s9.7-3 13-9" />
        </svg>`,
    };
  }
  if (percent >= 60) {
    return {
      type: "calm",
      title: "平静地前进",
      message: "慢慢来，也很好",
      chip: "节奏不错",
      color: "#d39a45",
      svg: `
        <svg viewBox="0 0 62 62">
          <path d="M18 27h.1M44 27h.1" />
          <path d="M23 41h16" />
        </svg>`,
    };
  }
  return {
    type: "angry",
    title: "有点着急了",
    message: "先完成手边最小的一件",
    chip: "再推进一步",
    color: "#d86c59",
    svg: `
      <svg viewBox="0 0 62 62">
        <path d="m16 21 9 4M46 21l-9 4M19 28h.1M43 28h.1" />
        <path d="M23 44c4-5 12-5 16 0" />
      </svg>`,
  };
}

function render() {
  renderDate();
  renderQuote();
  renderSoundControl();
  renderAppTabs();
  renderSidebar();
  renderSidebarLayout();
  renderViewNavigation();
  renderDateRail();
  renderWorkspaceHeader();
  renderProgress();
  renderSakuraGarden();
  renderComposerState();
  renderTasks();
  renderFilterControls();
  elements.importListName.textContent = getActiveList().name;
  elements.listModalTitle.textContent =
    listModalMode === "rename" ? "重命名清单" : "新建一个清单";
  elements.listModalDescription.textContent =
    listModalMode === "rename"
      ? "换一个更贴合当下的名字，任务不会受到影响。"
      : "给清单一个容易记住的名字，比如「本周计划」。";
  elements.listSubmitButton.textContent =
    listModalMode === "rename" ? "保存名称" : "创建清单";
}

function renderDate() {
  const info = todayInfo();
  const selected = getDateDetails(selectedDate);
  elements.headerDate.textContent = info.fullDate;
  elements.sidebarDate.textContent = `${info.month} ${info.day} · 保持自己的节奏`;
  elements.dateStampMonth.textContent = selected.month;
  elements.dateStampDay.textContent = selected.day;
  elements.dateStampWeekday.textContent = selected.weekday;
  elements.greeting.textContent = greetingForHour(info.now.getHours());
}

function renderQuote() {
  const quote =
    state.quote?.mode === "custom" && state.quote.text.trim()
      ? state.quote.text
      : DEFAULT_QUOTE;
  elements.sidebarQuoteText.textContent = quote;
  elements.sidebarQuoteSource.textContent =
    state.quote?.mode === "custom"
      ? "自定义寄语 · 今天也在认真生活"
      : "系统默认 · 今天也在认真生活";
}

function renderSidebar() {
  const today = localDateKey();
  elements.listNav.innerHTML = state.lists
    .map((list) => {
      const todayTasks = list.tasks.filter((task) => task.date === today);
      const progress = calculateProgress(todayTasks);
      const isActive =
        (currentView === "today" || currentView === "future") &&
        list.id === state.activeListId;
      return `
        <div class="list-nav-row ${isActive ? "is-active" : ""}">
          <button
            class="list-nav-item ${isActive ? "is-active" : ""}"
            type="button"
            data-list-id="${escapeHTML(list.id)}"
            aria-current="${isActive ? "page" : "false"}"
          >
            <span class="list-color" style="--list-color: ${escapeHTML(list.color)}"></span>
            <span class="list-nav-name">${escapeHTML(list.name)}</span>
            <span class="list-nav-count">${progress.done}/${progress.total}</span>
          </button>
          <button
            class="list-manage-button"
            type="button"
            data-manage-list="${escapeHTML(list.id)}"
            aria-label="管理清单：${escapeHTML(list.name)}"
            title="管理清单"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="5" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="19" cy="12" r="1.7" />
            </svg>
          </button>
        </div>`;
    })
    .join("");
}

function getSidebarListBounds() {
  const viewportHeight =
    elements.sidebar.clientHeight || window.innerHeight || 800;
  const lowerModules = [
    document.querySelector(".sidebar-list-tools"),
    document.querySelector(".sidebar-note"),
    document.querySelector(".sidebar-profile"),
  ].filter(Boolean);
  const lowerHeight = lowerModules.reduce((total, element) => {
    const styles = window.getComputedStyle?.(element);
    const marginTop = Number.parseFloat(styles?.marginTop || "0") || 0;
    const marginBottom = Number.parseFloat(styles?.marginBottom || "0") || 0;
    return total + (element.offsetHeight || 0) + marginTop + marginBottom;
  }, 0);
  const topHeight = Number(elements.listSection.offsetTop) || 280;
  const availableHeight = viewportHeight - topHeight - lowerHeight - 32;
  return {
    min: 96,
    max: Math.max(130, Math.min(480, availableHeight)),
  };
}

function applySidebarListHeight(height, persist = false) {
  const bounds = getSidebarListBounds();
  const clampedHeight = Math.max(
    bounds.min,
    Math.min(bounds.max, Math.round(height)),
  );
  elements.sidebar.style.setProperty("--lists-height", `${clampedHeight}px`);
  elements.sidebar.classList.add("has-custom-list-size");
  elements.sidebarResizer.setAttribute("aria-valuenow", String(clampedHeight));
  elements.sidebarResizer.setAttribute("aria-valuemax", String(bounds.max));
  elements.listSection.classList.remove("is-collapsed");
  elements.toggleListPaneButton.classList.remove("is-collapsed");
  elements.toggleListPaneButton.setAttribute("aria-expanded", "true");
  elements.toggleListPaneButton.setAttribute("aria-label", "收起我的清单");
  state.sidebarUi.listHeight = clampedHeight;
  state.sidebarUi.listCollapsed = false;
  if (persist) saveState();
  return clampedHeight;
}

function renderSidebarLayout() {
  const ui = state.sidebarUi || {
    listHeight: null,
    listCollapsed: false,
  };
  const bounds = getSidebarListBounds();
  elements.sidebarResizer.setAttribute("aria-valuemin", String(bounds.min));
  elements.sidebarResizer.setAttribute("aria-valuemax", String(bounds.max));

  if (ui.listCollapsed) {
    elements.sidebar.classList.remove("has-custom-list-size");
    elements.sidebar.style.removeProperty("--lists-height");
    elements.listSection.classList.add("is-collapsed");
    elements.toggleListPaneButton.classList.add("is-collapsed");
    elements.toggleListPaneButton.setAttribute("aria-expanded", "false");
    elements.toggleListPaneButton.setAttribute("aria-label", "展开我的清单");
    elements.sidebarResizer.setAttribute("aria-valuemin", "38");
    elements.sidebarResizer.setAttribute("aria-valuenow", "38");
    return;
  }

  elements.sidebarResizer.setAttribute("aria-valuemin", String(bounds.min));
  elements.listSection.classList.remove("is-collapsed");
  elements.toggleListPaneButton.classList.remove("is-collapsed");
  elements.toggleListPaneButton.setAttribute("aria-expanded", "true");
  elements.toggleListPaneButton.setAttribute("aria-label", "收起我的清单");

  if (ui.listHeight) {
    const height = Math.max(
      bounds.min,
      Math.min(bounds.max, Math.round(ui.listHeight)),
    );
    elements.sidebar.style.setProperty("--lists-height", `${height}px`);
    elements.sidebar.classList.add("has-custom-list-size");
    elements.sidebarResizer.setAttribute("aria-valuenow", String(height));
  } else {
    elements.sidebar.classList.remove("has-custom-list-size");
    elements.sidebar.style.removeProperty("--lists-height");
    const autoHeight =
      elements.listSection.getBoundingClientRect().height ||
      bounds.min ||
      180;
    elements.sidebarResizer.setAttribute(
      "aria-valuenow",
      String(Math.round(autoHeight)),
    );
  }
}

function toggleListPane() {
  state.sidebarUi.listCollapsed = !state.sidebarUi.listCollapsed;
  renderSidebarLayout();
  saveState();
}

function renderViewNavigation() {
  const today = localDateKey();
  const activeTodayTasks = getActiveList().tasks.filter(
    (task) => task.date === today,
  );
  const pastDates = new Set(
    state.lists.flatMap((list) =>
      list.tasks
        .map((task) => task.date)
        .filter((date) => date < today),
    ),
  );
  const futureTasks = state.lists.flatMap((list) =>
    list.tasks.filter((task) => task.date > today),
  );

  elements.todayViewCount.textContent = activeTodayTasks.length;
  elements.historyViewCount.textContent = `${pastDates.size}天`;
  elements.futureViewCount.textContent = `${futureTasks.length}项`;
  elements.viewButtons.forEach((button) => {
    const active = button.dataset.view === currentView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function renderDateRail() {
  const isTimeline = currentView !== "today";
  elements.dateRailWrap.hidden = !isTimeline;
  elements.previousDateButton.disabled =
    currentView === "future" && selectedDate <= localDateKey();
  elements.nextDateButton.disabled =
    currentView === "history" && selectedDate >= localDateKey();

  if (!isTimeline) {
    elements.dateRail.innerHTML = "";
    return;
  }

  const today = localDateKey();
  let startDate;
  if (currentView === "history" && selectedDate >= today) {
    startDate = shiftDateKey(today, -6);
  } else {
    startDate = shiftDateKey(selectedDate, -3);
  }
  if (currentView === "future" && startDate < today) startDate = today;

  const dates = [];
  for (let index = 0; index < 7; index += 1) {
    const date = shiftDateKey(startDate, index);
    if (currentView === "history" && date > today) break;
    dates.push(date);
  }

  elements.dateRail.innerHTML = dates
    .map((date) => {
      const details = getDateDetails(date);
      const tasks = getTasksForDate(date);
      return `
        <button
          class="date-rail-item ${date === selectedDate ? "is-selected" : ""} ${date === today ? "is-today" : ""}"
          type="button"
          data-schedule-date="${date}"
          aria-pressed="${date === selectedDate}"
          aria-label="${details.fullDate}，${tasks.length} 项任务"
        >
          <span>${date === today ? "今天" : details.shortWeekday}</span>
          <strong>${details.day}</strong>
          <small>${tasks.length ? `${tasks.length} 项` : "留白"}</small>
        </button>`;
    })
    .join("");
}

function renderWorkspaceHeader() {
  const list = getActiveList();
  const selected = getDateDetails(selectedDate);
  const scopedTasks = getScopedTasks();

  if (currentView === "history") {
    elements.activeListOverline.textContent = "历史存档";
    elements.activeListTitle.textContent = "历史记录";
    elements.activeListSubtitle.textContent = `${selected.fullDate} · ${
      scopedTasks.length
        ? `回看这一天留下的 ${scopedTasks.length} 项记录`
        : "这一天还没有任务记录"
    }`;
    return;
  }

  if (currentView === "future") {
    elements.activeListOverline.textContent = "未来安排";
    elements.activeListTitle.textContent = "未来计划";
    elements.activeListSubtitle.textContent = `${selected.fullDate} · ${
      scopedTasks.length
        ? `已经安排 ${scopedTasks.length} 件事`
        : "提前安排，让未来更从容"
    }`;
    return;
  }

  elements.activeListOverline.textContent =
    list.id === "today" ? "今天的一页" : "我的清单";
  elements.activeListTitle.textContent = list.name;
  elements.activeListSubtitle.textContent =
    list.tasks.length > 0
      ? "把注意力留给真正重要的事。"
      : "从一件很小的事开始，就很好。";
}

function renderProgress() {
  const list = getActiveList();
  const tasks = getScopedTasks();
  const progress = calculateProgress(tasks);
  const mood = moodFor(progress.percent);
  const remaining = progress.total - progress.done;
  const dateLabel =
    currentView === "today" ? "今日" : getDateDetails(selectedDate).fullDate;
  const scopeLabel =
    currentView === "today" ? list.name : `${dateLabel} · 全部清单`;

  elements.progressKicker.textContent =
    currentView === "today"
      ? "今日进度"
      : currentView === "history"
        ? "历史进度"
        : "计划进度";
  elements.progressHeading.textContent = `${scopeLabel} · 完成进度`;
  elements.progressPercent.textContent = progress.percent;
  elements.progressCaption.textContent = progress.total
    ? remaining === 0
      ? `全部 ${progress.total} 项都已完成`
      : `已完成 ${progress.done} 项，还有 ${remaining} 项`
    : currentView === "history"
      ? "这一天没有留下任务记录"
      : currentView === "future"
        ? "还没有安排，给未来留一个位置"
        : "还没有任务，今天从第一件开始";
  elements.progressChip.textContent = mood.chip;
  elements.moodLabel.textContent =
    currentView === "today"
      ? "今日心情"
      : currentView === "history"
        ? "当日心情"
        : "计划心情";
  elements.progressTrack.setAttribute("aria-valuenow", String(progress.percent));
  elements.progressTrack.setAttribute(
    "aria-label",
    `${scopeLabel}，完成 ${progress.percent}%`,
  );
  elements.progressFill.style.width = `${progress.percent}%`;
  elements.progressGlint.style.left = `${progress.percent}%`;

  elements.moodFace.style.setProperty("--mood-color", mood.color);
  elements.moodFace.classList.remove("is-refreshing");
  elements.moodFace.innerHTML = mood.svg;
  void elements.moodFace.offsetWidth;
  elements.moodFace.classList.add("is-refreshing");
  elements.moodCard.dataset.mood = mood.type;
  elements.moodTitle.textContent = mood.title;
  elements.moodMessage.textContent = mood.message;
}

function renderSakuraBlossoms(petalCount) {
  const visibleCount = Math.min(petalCount, 96);
  const colors = ["#d98287", "#e8a6a4", "#f2c3bb", "#dda09d", "#f6d8cd"];
  const blossoms = [];
  for (let index = 0; index < visibleCount; index += 1) {
    const anchor = BLOSSOM_ANCHORS[index % BLOSSOM_ANCHORS.length];
    const layer = Math.floor(index / BLOSSOM_ANCHORS.length);
    const angle = ((index * 137.5 + layer * 31) * Math.PI) / 180;
    const radius = layer === 0 ? 0 : 5 + (layer % 4) * 3.5;
    const x = anchor[0] + Math.cos(angle) * radius;
    const y = anchor[1] + Math.sin(angle) * radius;
    const size = 0.7 + (index % 4) * 0.09;
    const rotation = (index * 47) % 360;
    const color = colors[index % colors.length];
    blossoms.push(`
      <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotation}) scale(${size.toFixed(2)})">
        <path
          class="sakura-blossom-petal"
          d="M0 0 C3.2 -5.2 8.5 -5.6 10.5-.2 C9.2 4.8 4.1 6.2 0 0Z"
          fill="${color}"
          opacity="${0.78 + (index % 3) * 0.07}"
        />
      </g>`);
  }
  elements.sakuraBlossoms.innerHTML = blossoms.join("");
}

function spawnFallingPetals(count) {
  const colors = ["#d98287", "#e8aaa5", "#f1c7bd"];
  const petals = [];
  for (let index = 0; index < Math.min(count, 16); index += 1) {
    const x = 330 + ((index * 67) % 330);
    const y = 110 + ((index * 31) % 110);
    petals.push(`
      <ellipse
        class="sakura-falling-petal"
        cx="${x}"
        cy="${y}"
        rx="${3 + (index % 3)}"
        ry="${5 + (index % 2)}"
        fill="${colors[index % colors.length]}"
        style="transform-box: fill-box; transform-origin: center; --fall-delay: ${(index * 0.13).toFixed(2)}s; --fall-duration: ${(2.8 + (index % 4) * 0.35).toFixed(2)}s; --fall-drift: ${24 + (index % 5) * 13}px; --fall-spin: ${160 + index * 29}deg"
      />
    `);
  }
  elements.sakuraFalling.innerHTML = petals.join("");
  window.setTimeout(() => {
    elements.sakuraFalling.innerHTML = "";
  }, 4800);
}

function syncSakuraTreePosition() {
  if (!elements.sakuraTreePosition) return;
  const viewportWidth = window.innerWidth || 1086;
  const viewportHeight = window.innerHeight || 664;
  const isMobile = viewportWidth <= 680;
  const scaleX = viewportWidth / 460;
  const scaleY = viewportHeight / 285;
  const artScale = isMobile
    ? Math.min(scaleX, scaleY)
    : Math.max(scaleX, scaleY);
  const currentRootY = viewportHeight - 26 * artScale;
  const targetRootY = viewportHeight * 0.7;
  const lift = Math.max(0, currentRootY - targetRootY) / artScale;
  elements.sakuraTreePosition.setAttribute(
    "transform",
    `translate(0 ${-lift.toFixed(2)})`,
  );
}

function renderSakuraGarden() {
  const garden = state.garden;
  if (!garden) return;
  elements.sakuraArt.setAttribute(
    "preserveAspectRatio",
    window.innerWidth <= 680 ? "xMidYMax meet" : "xMidYMax slice",
  );
  const { stage, index: stageIndex } = getSakuraStage(garden.growthPoints);
  const nextStage = SAKURA_STAGES[stageIndex + 1] || null;
  const checkedInToday = garden.lastCareDate === localDateKey();
  const stageSpan = nextStage ? nextStage.min - stage.min : 1;
  const stageProgress = nextStage
    ? Math.max(
        0,
        Math.min(
          100,
          ((garden.growthPoints - stage.min) / stageSpan) * 100,
        ),
      )
    : 100;
  const tasksToNext = nextStage
    ? Math.max(1, Math.ceil((nextStage.min - garden.growthPoints) / 12))
    : 0;

  elements.sakuraStageLabel.textContent = stage.description;
  elements.sakuraStageName.textContent = stage.name;
  elements.sakuraPetals.textContent = garden.petals;
  elements.sakuraStreak.textContent = garden.streak;
  elements.sakuraCompletedCount.textContent = garden.completedTasks;
  elements.sakuraBestStreak.textContent = garden.bestStreak;
  elements.sakuraNextStage.textContent = nextStage
    ? stage.nextLabel.replace("{left}", String(tasksToNext))
    : stage.nextLabel;
  elements.sakuraGrowthFill.style.width = `${stageProgress}%`;
  elements.sakuraGrowthTrack.setAttribute(
    "aria-valuenow",
    String(Math.round(stageProgress)),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--tree-scale",
    String(stage.scale),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--tree-mobile-scale",
    String([0.62, 0.76, 0.92, 1.08, 1.24][stageIndex] || 0.76),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--tree-home-scale",
    String([0.23, 0.28, 0.36, 0.46, 0.58][stageIndex] || 0.23),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--canopy-opacity",
    String([0.06, 0.28, 0.58, 0.82, 1][stageIndex] || 0.06),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--canopy-scale",
    String([0.58, 0.72, 0.86, 0.95, 1][stageIndex] || 0.58),
  );
  elements.sakuraTreeGroup.style.setProperty(
    "--base-blossom-opacity",
    String([0.04, 0.22, 0.52, 0.76, 0.95][stageIndex] || 0.04),
  );
  syncSakuraTreePosition();
  elements.sakuraCheckin.classList.toggle("is-complete", checkedInToday);
  elements.sakuraCheckin.innerHTML = checkedInToday
    ? '<span aria-hidden="true"></span>今日已续上'
    : '<span aria-hidden="true"></span>今日待续';
  elements.sakuraWhisper.textContent = checkedInToday
    ? "今天的花瓣已经落在枝头。"
    : garden.streak > 0
      ? "完成一项任务，就能续上今天的花瓣。"
      : "从今天开始，让这棵树重新开花。";

  renderSakuraBlossoms(garden.petals);
  if (renderedSakuraPetals !== null) {
    const petalDifference = garden.petals - renderedSakuraPetals;
    const stageChanged =
      renderedSakuraStage !== null && renderedSakuraStage !== stageIndex;
    if (petalDifference > 0 || stageChanged) {
      elements.sakuraGarden.classList.remove("is-blooming");
      void elements.sakuraGarden.offsetWidth;
      elements.sakuraGarden.classList.add("is-blooming");
    } else if (petalDifference < 0) {
      spawnFallingPetals(Math.abs(petalDifference));
    }
  }
  renderedSakuraPetals = garden.petals;
  renderedSakuraStage = stageIndex;
}

function renderComposerState() {
  const isHistory = currentView === "history";
  const selected = getDateDetails(selectedDate);
  elements.taskForm.hidden = isHistory;
  elements.historyNotice.hidden = !isHistory;
  elements.composerTarget.textContent =
    currentView === "future"
      ? `${getActiveList().name} · ${selected.month} ${selected.day}`
      : `${getActiveList().name} · 今天`;
  elements.taskInput.placeholder =
    currentView === "future"
      ? `为 ${selected.month} ${selected.day} 安排一件事…`
      : "写下一件今天想完成的小事…";
  elements.dateStampButton.title =
    currentView === "future"
      ? "选择要规划的日期"
      : currentView === "history"
        ? "选择要回看的日期"
        : "查看今天的日期";
}

function getVisibleTasks(tasks) {
  return tasks
    .filter((task) => {
      if (currentFilter === "done") return task.status === "done";
      if (currentFilter === "pending") {
        return task.status === "pending" || task.status === "skipped";
      }
      return true;
    })
    .sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (a.status !== "done" && b.status === "done") return -1;
      const priorityDifference =
        PRIORITIES[a.priority].order - PRIORITIES[b.priority].order;
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

function renderTasks() {
  const scopedTasks = getScopedTasks();
  const progress = calculateProgress(scopedTasks);
  const visibleTasks = getVisibleTasks(scopedTasks);
  const isTimeline = currentView !== "today";
  const isReadOnly = currentView === "history";

  elements.allCount.textContent = progress.total;
  elements.pendingCount.textContent = progress.pending + progress.skipped;
  elements.doneCount.textContent = progress.done;
  elements.visibleSummary.textContent = `显示 ${visibleTasks.length} / ${progress.total} 项任务`;

  elements.taskList.innerHTML = visibleTasks
    .map((task) => {
      const priority = PRIORITIES[task.priority];
      const statusLabel =
        task.status === "done"
          ? '<span class="task-status-label">已完成</span>'
          : task.status === "skipped"
            ? '<span class="task-status-label">未完成</span>'
            : "";
      const stateCopy =
        task.status === "done"
          ? "点击取消完成"
          : task.status === "skipped"
            ? "点击标记完成"
            : "标记为已完成";
      const crossCopy = task.status === "skipped" ? "点击取消未完成" : "标记为未完成";
      const disabledAttribute = isReadOnly ? "disabled" : "";
      const sourceLabel =
        isTimeline && task.listName
          ? `<span class="task-source">${escapeHTML(task.listName)}</span><i aria-hidden="true"></i>`
          : "";
      return `
        <article
          class="task-item ${task.status === "done" ? "is-done" : ""} ${task.status === "skipped" ? "is-skipped" : ""} ${isReadOnly ? "is-readonly" : ""}"
          data-task-id="${escapeHTML(task.id)}"
        >
          <div class="task-state-actions">
            <button
              class="state-button state-button--done ${task.status === "done" ? "is-active" : ""}"
              type="button"
              data-action="toggle-done"
              ${disabledAttribute}
              aria-label="${stateCopy}"
              title="${stateCopy}"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4.5 4.5L19 7" />
              </svg>
            </button>
            <button
              class="state-button state-button--skipped ${task.status === "skipped" ? "is-active" : ""}"
              type="button"
              data-action="toggle-skipped"
              ${disabledAttribute}
              aria-label="${crossCopy}"
              title="${crossCopy}"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 7 10 10M17 7 7 17" />
              </svg>
            </button>
          </div>
          <div class="task-content">
            <div class="task-title-row">
              <p class="task-title">${escapeHTML(task.title)}</p>
              ${statusLabel}
            </div>
            <div class="task-meta">
              ${sourceLabel}
              <span>${priority.label}优先级</span>
              <i aria-hidden="true"></i>
              <span>${task.status === "done" ? "做得很棒" : "等待完成"}</span>
            </div>
          </div>
          <div class="task-actions">
            <button
              class="priority-badge priority-badge--${task.priority}"
              type="button"
              data-action="open-priority-menu"
              ${disabledAttribute}
              aria-label="当前${priority.label}优先级，打开优先级菜单"
              aria-haspopup="menu"
              aria-expanded="false"
              title="${isReadOnly ? "历史记录只读" : "选择任务优先级"}"
            >
              <span aria-hidden="true"></span>${priority.label}
              <svg class="priority-badge-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </button>
            <button
              class="task-delete"
              type="button"
              data-action="delete-task"
              ${disabledAttribute}
              aria-label="删除任务：${escapeHTML(task.title)}"
              title="删除任务"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
              </svg>
            </button>
          </div>
        </article>`;
    })
    .join("");

  const noTasks = scopedTasks.length === 0;
  const noFilterResults = !noTasks && visibleTasks.length === 0;
  elements.emptyState.hidden = visibleTasks.length > 0;
  elements.taskList.hidden = visibleTasks.length === 0;

  if (noTasks) {
    if (currentView === "history") {
      elements.emptyTitle.textContent = "这一天没有记录";
      elements.emptyDescription.textContent =
        "可以选择其他日期继续回看，过去留下的足迹会在这里出现。";
      elements.emptyActionButton.textContent = "回到今天";
    } else if (currentView === "future") {
      elements.emptyTitle.textContent = "这一天还是空白";
      elements.emptyDescription.textContent =
        "提前写下计划，到这一天时就能从容开始。";
      elements.emptyActionButton.textContent = "安排第一件事";
    } else {
      elements.emptyTitle.textContent = "还没有任务";
      elements.emptyDescription.textContent =
        "写下一件小事，让今天有一个轻松的起点。";
      elements.emptyActionButton.textContent = "添加第一项任务";
    }
  } else if (noFilterResults) {
    elements.emptyTitle.textContent =
      currentFilter === "done" ? "还没有完成的任务" : "没有待完成的任务";
    elements.emptyDescription.textContent =
      currentFilter === "done"
        ? "完成一项后，它会安静地出现在这里。"
        : "这一栏已经清空，可以轻松一下了。";
    elements.emptyActionButton.textContent = "查看全部任务";
  }
}

function renderFilterControls() {
  elements.filterButtons.forEach((button) => {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function addTask(title, priority) {
  const trimmed = title.trim();
  if (!trimmed) {
    elements.taskInput.focus();
    showToast("先写下一件要做的事");
    return false;
  }
  if (currentView === "history") {
    showToast("历史记录为只读，请前往未来计划添加安排");
    return false;
  }
  const taskDate = currentView === "future" ? selectedDate : localDateKey();
  getActiveList().tasks.push(
    createTask(trimmed, priority, "pending", taskDate),
  );
  recordGardenTaskCreated();
  playSound("taskAdded");
  currentFilter = "all";
  saveState();
  render();
  return true;
}

function setTaskStatus(taskId, nextStatus) {
  if (currentView === "history") return;
  const found = findTask(taskId);
  if (!found) return;
  found.task.status =
    found.task.status === nextStatus ? "pending" : nextStatus;
  let gardenResult = null;
  if (found.task.status === "done") {
    gardenResult = recordGardenCompletion(found.task);
    playSound("taskDone");
  } else {
    playSound("taskSkipped");
  }
  saveState();
  render();
  if (gardenResult?.priorPenalty > 0) {
    window.setTimeout(() => playSound("petalsFall"), 100);
    showToast(`连续记录中断，樱花树飘落 ${gardenResult.priorPenalty} 个花瓣`);
  } else if (gardenResult?.newPetal) {
    window.setTimeout(() => playSound("sakuraBloom"), 120);
    showToast("今天坚持成功，樱花树多了一个花瓣");
  }
}

function closePriorityMenu() {
  if (elements.priorityMenu.hidden) return;
  elements.priorityMenu.hidden = true;
  elements.priorityMenu.innerHTML = "";
  document
    .querySelectorAll('[data-action="open-priority-menu"]')
    .forEach((button) => button.setAttribute("aria-expanded", "false"));
  priorityMenuTaskId = null;
}

function openPriorityMenu(taskId, anchor) {
  if (currentView === "history") return;
  const found = findTask(taskId);
  if (!found) return;
  closePriorityMenu();
  priorityMenuTaskId = taskId;
  elements.priorityMenu.innerHTML = Object.entries(PRIORITIES)
    .map(
      ([key, priority]) => `
        <button
          class="priority-menu-item priority-menu-item--${key} ${found.task.priority === key ? "is-current" : ""}"
          type="button"
          role="menuitemradio"
          aria-checked="${found.task.priority === key}"
          data-priority-choice="${key}"
        >
          <span class="priority-menu-dot" aria-hidden="true"></span>
          <span class="priority-menu-copy">
            <strong>${priority.label}</strong>
            <small>${priority.description}</small>
          </span>
          <span class="priority-menu-check" aria-hidden="true">✓</span>
        </button>`,
    )
    .join("");

  const anchorRect = anchor.getBoundingClientRect();
  elements.priorityMenu.style.visibility = "hidden";
  elements.priorityMenu.hidden = false;
  const menuRect = elements.priorityMenu.getBoundingClientRect();
  const margin = 12;
  let left = anchorRect.right - menuRect.width;
  let top = anchorRect.bottom + 7;
  left = Math.max(margin, Math.min(left, window.innerWidth - menuRect.width - margin));
  if (top + menuRect.height > window.innerHeight - margin) {
    top = anchorRect.top - menuRect.height - 7;
  }
  top = Math.max(margin, top);
  elements.priorityMenu.style.left = `${left}px`;
  elements.priorityMenu.style.top = `${top}px`;
  elements.priorityMenu.style.visibility = "visible";
  anchor.setAttribute("aria-expanded", "true");
  elements.priorityMenu.querySelector(".priority-menu-item")?.focus();
}

function setTaskPriority(taskId, priority) {
  if (currentView === "history" || !PRIORITIES[priority]) return;
  const found = findTask(taskId);
  if (!found) return;
  found.task.priority = priority;
  playPrioritySound(priority);
  closePriorityMenu();
  saveState();
  render();
  showToast(`优先级已设为「${PRIORITIES[priority].label}」`);
}

function deleteTask(taskId) {
  if (currentView === "history") return;
  const found = findTask(taskId);
  if (!found) return;
  const [removed] = found.list.tasks.splice(found.index, 1);
  playSound("taskDeleted");
  saveState();
  render();
  showToast("任务已删除", {
    label: "撤销",
    onClick: () => {
      found.list.tasks.splice(
        Math.min(found.index, found.list.tasks.length),
        0,
        removed,
      );
      saveState();
      render();
      showToast("任务已恢复");
    },
  });
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    const target = modal.querySelector("input:not([type=file]), button");
    if (target) target.focus();
  });
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function openListModal(mode) {
  listModalMode = mode;
  elements.listNameInput.value =
    mode === "rename" ? getActiveList().name : "";
  render();
  openModal(elements.listModal);
  requestAnimationFrame(() => {
    elements.listNameInput.focus();
    elements.listNameInput.select();
  });
}

function openManageListModal(listId = state.activeListId) {
  const list = state.lists.find((item) => item.id === listId);
  if (!list) return;
  managedListId = list.id;
  elements.manageListTitle.textContent = `管理「${list.name}」`;
  elements.manageListDescription.textContent =
    list.tasks.length > 0
      ? `这个清单共有 ${list.tasks.length} 项任务。可以重命名，也可以删除整个清单。`
      : "这是空白清单。可以修改名称，或删除不再需要的清单。";
  openModal(elements.manageListModal);
}

function setQuoteFormMode(mode) {
  elements.quoteModeInputs.forEach((input) => {
    input.checked = input.value === mode;
  });
  elements.quoteInput.disabled = mode === "default";
  elements.quoteInput.classList.toggle("is-disabled", mode === "default");
  elements.quoteCharacterCount.textContent =
    `${elements.quoteInput.value.length} / 100`;
}

function openQuoteModal() {
  const currentMode = state.quote?.mode === "custom" ? "custom" : "default";
  elements.quoteInput.value =
    state.quote?.mode === "custom" ? state.quote.text : DEFAULT_QUOTE;
  setQuoteFormMode(currentMode);
  openModal(elements.quoteModal);
  if (currentMode === "custom") {
    requestAnimationFrame(() => {
      elements.quoteInput.focus();
      elements.quoteInput.select();
    });
  }
}

function isAppInstalled() {
  return (
    Boolean(navigator.standalone) ||
    Boolean(window.matchMedia?.("(display-mode: standalone)").matches)
  );
}

function updateInstallUi() {
  const installed = isAppInstalled();
  elements.installAppButton.classList.toggle("is-installed", installed);
  elements.installAppButton.setAttribute(
    "aria-label",
    installed ? "日日清单已安装" : "安装日日清单 App",
  );
  const label = elements.installAppButton.querySelector("span");
  if (label) label.textContent = installed ? "已安装" : "安装 App";
  elements.nativeInstallButton.hidden = !deferredInstallPrompt;
}

function openInstallModal() {
  updateInstallUi();
  openModal(elements.installModal);
}

function setupPwa() {
  updateInstallUi();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    elements.nativeInstallButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallUi();
    closeModal(elements.installModal);
    showToast("日日清单已安装到设备");
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch((error) => {
        console.warn("离线服务注册失败。", error);
      });
    });
  }
}

function applyLaunchShortcut() {
  const params = new URLSearchParams(location.search);
  const requestedView = params.get("view");
  if (requestedView === "history") {
    activeAppTab = "tasks";
    currentView = "history";
    selectedDate = latestPastRecordDate();
  } else if (requestedView === "future") {
    activeAppTab = "tasks";
    currentView = "future";
    selectedDate = earliestFuturePlanDate();
  }
}

function openImportModal() {
  if (currentView === "history") {
    showToast("历史记录为只读，请切换到今天或未来计划后导入");
    return;
  }
  openModal(elements.importModal);
}

function openDeleteConfirm() {
  const list = getActiveList();
  if (state.lists.length === 1) {
    showToast("至少保留一个清单");
    return;
  }
  elements.confirmTitle.textContent = `删除「${list.name}」？`;
  elements.confirmDescription.textContent =
    `清单中的 ${list.tasks.length} 项任务也会一起删除，此操作无法撤销。`;
  confirmAction = () => {
    const index = state.lists.findIndex((item) => item.id === list.id);
    state.lists.splice(index, 1);
    state.activeListId = state.lists[Math.max(0, index - 1)].id;
    currentFilter = "all";
    playSound("taskDeleted");
    saveState();
    render();
    closeModal(elements.confirmModal);
    showToast("清单已删除");
  };
  openModal(elements.confirmModal);
}

function showToast(message, action = null) {
  const toast = document.createElement("div");
  toast.className = "toast";
  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);

  if (action) {
    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.textContent = action.label;
    actionButton.addEventListener("click", () => {
      action.onClick();
      dismissToast(toast);
    });
    toast.appendChild(actionButton);
  }

  elements.toastRegion.appendChild(toast);
  let timeout = window.setTimeout(
    () => dismissToast(toast),
    action ? 5500 : 3200,
  );
  toast.addEventListener("mouseenter", () => window.clearTimeout(timeout));
  toast.addEventListener("mouseleave", () => {
    timeout = window.setTimeout(() => dismissToast(toast), 2800);
  });
}

function dismissToast(toast) {
  if (!toast.isConnected || toast.classList.contains("is-leaving")) return;
  toast.classList.add("is-leaving");
  window.setTimeout(() => toast.remove(), 180);
}

function normalizePriority(rawPriority) {
  const value = String(rawPriority || "")
    .trim()
    .toLowerCase();
  const aliases = {
    red: "red",
    orange: "orange",
    green: "green",
    gray: "gray",
    grey: "gray",
    红: "red",
    红橙: "red",
    紧急: "red",
    橙色: "orange",
    橙: "orange",
    重要: "orange",
    绿色: "green",
    绿: "green",
    日常: "green",
    灰色: "gray",
    灰: "gray",
    稍后: "gray",
    低: "gray",
    high: "red",
    medium: "orange",
    normal: "green",
    low: "gray",
  };
  return aliases[value] || null;
}

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];
    if (character === '"' && line[i + 1] === '"' && quoted) {
      current += '"';
      i += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }
  values.push(current.trim());
  return values;
}

function cleanImportedTitle(rawTitle) {
  return String(rawTitle)
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\[[ xX]\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferPriority(value) {
  const normalized = normalizePriority(value);
  if (normalized) return normalized;
  const title = String(value || "").trim();
  if (title.startsWith("!!!")) return "red";
  if (title.startsWith("!!")) return "orange";
  if (title.startsWith("!")) return "green";
  return null;
}

function priorityFromPrefix(title) {
  const patterns = [
    [/^\[(紧急|红|红色)\]\s*/i, "red"],
    [/^\[(重要|橙色?|orange)\]\s*/i, "orange"],
    [/^\[(日常|绿色?|green)\]\s*/i, "green"],
    [/^\[(稍后|低|灰色?|gray|grey)\]\s*/i, "gray"],
  ];
  for (const [pattern, priority] of patterns) {
    if (pattern.test(title)) {
      return { title: title.replace(pattern, ""), priority };
    }
  }
  return null;
}

function parseTextLine(originalLine) {
  let line = originalLine.trim();
  if (!line || /^#{1,6}(\s|$)/.test(line)) return null;
  line = cleanImportedTitle(line);
  if (!line) return null;

  let priority = "gray";
  const prefixPriority = inferPriority(line);
  if (prefixPriority && /^!!!|^!!|^!/.test(line)) {
    priority = prefixPriority;
    line = line.replace(/^!!!\s*|^!!\s*|^!\s*/, "");
  }

  const bracketPriority = priorityFromPrefix(line);
  if (bracketPriority) {
    priority = bracketPriority.priority;
    line = bracketPriority.title;
  }

  const separatorIndex = line.lastIndexOf("|");
  if (separatorIndex > 0) {
    const explicitPriority = normalizePriority(line.slice(separatorIndex + 1));
    if (explicitPriority) {
      priority = explicitPriority;
      line = line.slice(0, separatorIndex).trim();
    }
  }

  line = cleanImportedTitle(line);
  return line ? { title: line, priority } : null;
}

function parseImportText(text, fileName = "") {
  const extension = fileName.split(".").pop().toLowerCase();

  if (extension === "json") {
    const parsed = JSON.parse(text);
    const source = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.tasks)
        ? parsed.tasks
        : null;
    if (!source) throw new Error("JSON 中需要包含任务数组");
    return source
      .map((item) => {
        if (typeof item === "string") return parseTextLine(item);
        if (!item || typeof item !== "object") return null;
        const title = cleanImportedTitle(item.title || item.text || item.task || "");
        if (!title) return null;
        return {
          title,
          priority: normalizePriority(item.priority) || "gray",
          status: ["pending", "done", "skipped"].includes(item.status)
            ? item.status
            : "pending",
          date: isValidDateKey(item.date) ? item.date : null,
        };
      })
      .filter(Boolean);
  }

  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (extension === "csv") {
    return lines
      .map((line, index) => {
        if (!line.trim()) return null;
        const values = parseCSVLine(line);
        if (
          index === 0 &&
          /^(task|title|任务|事项|名称)$/i.test(values[0] || "")
        ) {
          return null;
        }
        const title = cleanImportedTitle(values[0] || "");
        return title
          ? {
              title,
              priority: normalizePriority(values[1]) || "gray",
            }
          : null;
      })
      .filter(Boolean);
  }

  return lines.map(parseTextLine).filter(Boolean);
}

async function importFile(file) {
  if (!file) return;
  const validExtensions = ["txt", "md", "csv", "json"];
  const extension = file.name.split(".").pop().toLowerCase();
  if (!validExtensions.includes(extension)) {
    showToast("请选择 TXT、MD、CSV 或 JSON 文件");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast("文件不能超过 2 MB");
    return;
  }

  try {
    const text = await file.text();
    const imported = parseImportText(text, file.name);
    if (!imported.length) {
      showToast("没有读取到可导入的任务");
      return;
    }

    const list = getActiveList();
    const importDate = currentView === "future" ? selectedDate : localDateKey();
    const existingTitles = new Set(
      list.tasks.map((task) => `${task.date}|${task.title.trim()}`),
    );
    let skipped = 0;
    imported.forEach((item) => {
      const taskDate = item.date || importDate;
      const duplicateKey = `${taskDate}|${item.title}`;
      if (existingTitles.has(duplicateKey)) {
        skipped += 1;
        return;
      }
      list.tasks.push(
        createTask(
          item.title,
          item.priority,
          item.status || "pending",
          taskDate,
        ),
      );
      recordGardenTaskCreated();
      existingTitles.add(duplicateKey);
    });
    const added = imported.length - skipped;
    currentFilter = "all";
    saveState();
    render();
    closeModal(elements.importModal);
    elements.fileInput.value = "";
    showToast(
      skipped
        ? `已导入 ${added} 项，跳过 ${skipped} 项重复任务`
        : `已导入 ${added} 项任务`,
    );
  } catch (error) {
    console.error(error);
    showToast("文件格式无法识别，请检查内容后重试");
  }
}

function exportCurrentList() {
  const list = getActiveList();
  const rows = list.tasks.map((task) => ({
    title: task.title,
    priority: PRIORITIES[task.priority].label,
    status: task.status,
    date: task.date,
    createdAt: task.createdAt,
  }));
  const blob = new Blob([JSON.stringify({ name: list.name, tasks: rows }, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${list.name}-${localDateKey()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("当前清单已导出");
}

function downloadTemplate() {
  const content = [
    "整理项目周报 | 紧急",
    "阅读 30 分钟 | 重要",
    "给植物浇水 | 日常",
    "整理下周照片 | 稍后",
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "日日清单-导入示例.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function closeSidebar() {
  elements.sidebar.classList.remove("is-open");
  elements.sidebarBackdrop.classList.remove("is-visible");
  elements.mobileMenuButton.setAttribute("aria-expanded", "false");
}

function openSidebar() {
  elements.sidebar.classList.add("is-open");
  elements.sidebarBackdrop.classList.add("is-visible");
  elements.mobileMenuButton.setAttribute("aria-expanded", "true");
}

function setCurrentView(view) {
  currentView = view;
  currentFilter = "all";
  if (view === "today") {
    selectedDate = localDateKey();
  } else if (view === "history") {
    selectedDate = latestPastRecordDate();
  } else {
    selectedDate = earliestFuturePlanDate();
  }
  render();
  closeSidebar();
}

function selectScheduleDate(date, forceView = false) {
  if (!isValidDateKey(date)) return;
  const today = localDateKey();
  if (forceView || currentView === "today") {
    currentView = date < today ? "history" : date > today ? "future" : "today";
  }
  if (currentView === "history" && date > today) date = today;
  if (currentView === "future" && date < today) date = today;
  selectedDate = date;
  currentFilter = "all";
  render();
}

function shiftSelectedDate(amount) {
  const today = localDateKey();
  let nextDate = shiftDateKey(selectedDate, amount);
  if (currentView === "history" && nextDate > today) nextDate = today;
  if (currentView === "future" && nextDate < today) nextDate = today;
  playSound("dateChanged");
  selectScheduleDate(nextDate);
}

function renderCalendar() {
  const cursor = getDateDetails(calendarCursor);
  const year = cursor.date.getFullYear();
  const month = cursor.date.getMonth();
  const firstDay = new Date(year, month, 1, 12);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset, 12);
  const today = localDateKey();

  elements.calendarMonthLabel.textContent = `${year}年 ${month + 1}月`;
  elements.calendarSelectedLabel.textContent =
    `${getDateDetails(selectedDate).fullDate} · ${getDateDetails(selectedDate).weekday}`;

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = localDateKey(date);
    const details = getDateDetails(dateKey);
    const taskCount = getTasksForDate(dateKey).length;
    days.push(`
      <button
        class="calendar-day ${date.getMonth() !== month ? "is-outside" : ""} ${dateKey === today ? "is-today" : ""} ${dateKey === selectedDate ? "is-selected" : ""} ${taskCount ? "has-tasks" : ""}"
        type="button"
        data-calendar-date="${dateKey}"
        aria-label="${details.fullDate}${taskCount ? `，${taskCount} 项任务` : "，暂无任务"}"
        aria-pressed="${dateKey === selectedDate}"
      >
        ${date.getDate()}
      </button>`);
  }
  elements.calendarGrid.innerHTML = days.join("");
}

function openDateCalendar() {
  calendarCursor = selectedDate;
  renderCalendar();
  openModal(elements.dateModal);
  requestAnimationFrame(() => {
    const selectedDay = elements.calendarGrid.querySelector(
      `[data-calendar-date="${selectedDate}"]`,
    );
    if (selectedDay) selectedDay.focus();
  });
}

function moveCalendarMonth(amount) {
  const current = parseDateKey(calendarCursor);
  calendarCursor = localDateKey(
    new Date(current.getFullYear(), current.getMonth() + amount, 1, 12),
  );
  renderCalendar();
}

function chooseCalendarDate(date) {
  const today = localDateKey();
  playSound(
    date < today
      ? "viewHistory"
      : date > today
        ? "viewFuture"
        : "viewToday",
  );
  selectScheduleDate(date, true);
  closeModal(elements.dateModal);
}

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const priority =
    new FormData(elements.taskForm).get("priority") || "green";
  if (addTask(elements.taskInput.value, priority)) {
    elements.taskInput.value = "";
    elements.taskInput.focus();
  }
});

elements.listNav.addEventListener("click", (event) => {
  const manageButton = event.target.closest("[data-manage-list]");
  if (manageButton) {
    openManageListModal(manageButton.dataset.manageList);
    return;
  }
  const button = event.target.closest("[data-list-id]");
  if (!button) return;
  playListTabSound(button.dataset.listId);
  const keepPlanningDate = currentView === "future";
  state.activeListId = button.dataset.listId;
  if (!keepPlanningDate) {
    currentView = "today";
    selectedDate = localDateKey();
  }
  currentFilter = "all";
  saveState();
  render();
  closeSidebar();
});

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const soundByView = {
      today: "viewToday",
      history: "viewHistory",
      future: "viewFuture",
    };
    playSound(soundByView[button.dataset.view]);
    setCurrentView(button.dataset.view);
  });
});

elements.dateRail.addEventListener("click", (event) => {
  const button = event.target.closest("[data-schedule-date]");
  if (!button) return;
  playSound("dateChanged");
  selectScheduleDate(button.dataset.scheduleDate);
});

elements.previousDateButton.addEventListener("click", () => shiftSelectedDate(-1));
elements.nextDateButton.addEventListener("click", () => shiftSelectedDate(1));
elements.dateStampButton.addEventListener("click", () => {
  playSound("dateChanged");
  openDateCalendar();
});
elements.calendarPreviousMonth.addEventListener("click", () => {
  moveCalendarMonth(-1);
});
elements.calendarNextMonth.addEventListener("click", () => {
  moveCalendarMonth(1);
});
elements.calendarGrid.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-calendar-date]");
  if (!dayButton) return;
  chooseCalendarDate(dayButton.dataset.calendarDate);
});
elements.calendarQuickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseCalendarDate(
      shiftDateKey(localDateKey(), Number(button.dataset.quickDate)),
    );
  });
});

elements.taskList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const taskItem = event.target.closest("[data-task-id]");
  if (!actionButton || !taskItem) return;
  const taskId = taskItem.dataset.taskId;

  switch (actionButton.dataset.action) {
    case "toggle-done":
      setTaskStatus(taskId, "done");
      break;
    case "toggle-skipped":
      setTaskStatus(taskId, "skipped");
      break;
    case "open-priority-menu":
      openPriorityMenu(taskId, actionButton);
      break;
    case "delete-task":
      deleteTask(taskId);
      break;
    default:
      break;
  }
});

elements.priorityMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-priority-choice]");
  if (!option || !priorityMenuTaskId) return;
  setTaskPriority(priorityMenuTaskId, option.dataset.priorityChoice);
});

document.addEventListener("pointerdown", (event) => {
  if (elements.priorityMenu.hidden) return;
  if (
    !elements.priorityMenu.contains(event.target) &&
    !event.target.closest('[data-action="open-priority-menu"]')
  ) {
    closePriorityMenu();
  }
});
document.addEventListener("scroll", closePriorityMenu, true);

elements.filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playSound(FILTER_TAB_SOUNDS[button.dataset.filter]);
    currentFilter = button.dataset.filter;
    renderTasks();
    renderFilterControls();
  });
});

elements.emptyActionButton.addEventListener("click", () => {
  if (currentView === "history") {
    setCurrentView("today");
  } else if (getScopedTasks().length === 0) {
    elements.taskInput.focus();
  } else {
    currentFilter = "all";
    renderTasks();
    renderFilterControls();
  }
});

document.querySelector("#newListButton").addEventListener("click", () => {
  closeSidebar();
  openListModal("create");
});
document
  .querySelector("#quickAddListButton")
  .addEventListener("click", () => openListModal("create"));
elements.manageCurrentListButton.addEventListener("click", () => {
  openManageListModal(state.activeListId);
});

elements.manageRenameButton.addEventListener("click", () => {
  if (!managedListId) return;
  state.activeListId = managedListId;
  currentFilter = "all";
  saveState();
  render();
  closeModal(elements.manageListModal);
  openListModal("rename");
});

elements.manageDeleteButton.addEventListener("click", () => {
  if (!managedListId) return;
  state.activeListId = managedListId;
  currentFilter = "all";
  saveState();
  render();
  closeModal(elements.manageListModal);
  openDeleteConfirm();
});

elements.editQuoteButton.addEventListener("click", openQuoteModal);
elements.soundToggle.addEventListener("click", () => {
  const wasEnabled = state.soundEnabled !== false;
  if (wasEnabled) {
    playSound("toggleOff");
  }
  state.soundEnabled = !wasEnabled;
  saveState();
  renderSoundControl();
  if (!wasEnabled) {
    playSound("toggleOn");
  }
  showToast(
    state.soundEnabled ? "界面音效已开启" : "界面音效已关闭",
  );
});
elements.installAppButton.addEventListener("click", openInstallModal);
elements.nativeInstallButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice.outcome === "accepted") {
    showToast("正在安装日日清单");
  }
  deferredInstallPrompt = null;
  elements.nativeInstallButton.hidden = true;
  closeModal(elements.installModal);
});
elements.quoteModeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    setQuoteFormMode(input.value);
    if (input.value === "custom") {
      elements.quoteInput.focus();
    }
  });
});
elements.quoteInput.addEventListener("input", () => {
  elements.quoteCharacterCount.textContent =
    `${elements.quoteInput.value.length} / 100`;
});
elements.resetQuoteButton.addEventListener("click", () => {
  state.quote = { mode: "default", text: DEFAULT_QUOTE };
  saveState();
  renderQuote();
  closeModal(elements.quoteModal);
  showToast("已恢复系统默认寄语");
});
elements.quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode =
    elements.quoteModeInputs.find((input) => input.checked)?.value || "default";
  const text = elements.quoteInput.value.trim();
  if (mode === "custom" && !text) {
    elements.quoteInput.focus();
    showToast("请先写下你的自定义寄语");
    return;
  }
  state.quote =
    mode === "custom"
      ? { mode: "custom", text }
      : { mode: "default", text: DEFAULT_QUOTE };
  saveState();
  renderQuote();
  closeModal(elements.quoteModal);
  showToast(mode === "custom" ? "自定义寄语已保存" : "已使用系统默认寄语");
});

elements.listForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elements.listNameInput.value.trim();
  if (!name) {
    elements.listNameInput.focus();
    return;
  }

  if (listModalMode === "rename") {
    getActiveList().name = name;
    playSound("toggleOn");
    saveState();
    render();
    closeModal(elements.listModal);
    showToast("清单名称已更新");
  } else {
    const newList = {
      id: uid("list"),
      name,
      color: LIST_COLORS[state.lists.length % LIST_COLORS.length],
      tasks: [],
    };
    state.lists.push(newList);
    state.activeListId = newList.id;
    currentView = "today";
    selectedDate = localDateKey();
    currentFilter = "all";
    playSound("taskAdded");
    listModalMode = "create";
    saveState();
    elements.listNameInput.value = "";
    render();
    closeModal(elements.listModal);
    showToast("新清单已创建");
    elements.taskInput.focus();
  }
});

elements.confirmDeleteButton.addEventListener("click", () => {
  if (confirmAction) confirmAction();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.closeModal);
    if (modal) closeModal(modal);
  });
});

[
  elements.listModal,
  elements.manageListModal,
  elements.quoteModal,
  elements.dateModal,
  elements.installModal,
  elements.importModal,
  elements.confirmModal,
].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

document.querySelector("#importButton").addEventListener("click", openImportModal);
document
  .querySelector("#topImportButton")
  .addEventListener("click", openImportModal);

elements.fileDropZone.addEventListener("click", () => elements.fileInput.click());
elements.fileInput.addEventListener("change", () => {
  importFile(elements.fileInput.files[0]);
});

["dragenter", "dragover"].forEach((eventName) => {
  elements.fileDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.fileDropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.fileDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.fileDropZone.classList.remove("is-dragging");
  });
});

elements.fileDropZone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  importFile(file);
});

document
  .querySelector("#downloadTemplateButton")
  .addEventListener("click", downloadTemplate);
document.querySelector("#exportButton").addEventListener("click", exportCurrentList);

elements.toggleListPaneButton.addEventListener("click", toggleListPane);

elements.sidebarResizer.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (state.sidebarUi.listCollapsed) {
    applySidebarListHeight(150);
  }
  sidebarDragState = {
    pointerId: event.pointerId,
    startY: event.clientY,
    startHeight: elements.listSection.getBoundingClientRect().height,
  };
  elements.sidebarResizer.classList.add("is-dragging");
  elements.sidebarResizer.setPointerCapture?.(event.pointerId);
  event.preventDefault();
});

elements.sidebarResizer.addEventListener("pointermove", (event) => {
  if (!sidebarDragState || event.pointerId !== sidebarDragState.pointerId) {
    return;
  }
  const nextHeight =
    sidebarDragState.startHeight + event.clientY - sidebarDragState.startY;
  applySidebarListHeight(nextHeight);
});

function finishSidebarResize(event) {
  if (
    !sidebarDragState ||
    (event.pointerId !== undefined &&
      event.pointerId !== sidebarDragState.pointerId)
  ) {
    return;
  }
  sidebarDragState = null;
  elements.sidebarResizer.classList.remove("is-dragging");
  saveState();
}

elements.sidebarResizer.addEventListener("pointerup", finishSidebarResize);
elements.sidebarResizer.addEventListener("pointercancel", finishSidebarResize);
elements.sidebarResizer.addEventListener("dblclick", () => {
  state.sidebarUi.listHeight = null;
  state.sidebarUi.listCollapsed = false;
  renderSidebarLayout();
  saveState();
  showToast("我的清单已恢复自动高度");
});
elements.sidebarResizer.addEventListener("keydown", (event) => {
  if (!["ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Home") {
    state.sidebarUi.listHeight = null;
    state.sidebarUi.listCollapsed = false;
    renderSidebarLayout();
    saveState();
    return;
  }
  const currentHeight = state.sidebarUi.listCollapsed
    ? 96
    : elements.listSection.getBoundingClientRect().height;
  applySidebarListHeight(
    currentHeight + (event.key === "ArrowDown" ? 16 : -16),
    true,
  );
});

elements.mobileMenuButton.addEventListener("click", openSidebar);
elements.sidebarClose.addEventListener("click", closeSidebar);
elements.sidebarBackdrop.addEventListener("click", closeSidebar);
elements.sakuraTab.addEventListener("click", () => setAppTab("tree"));
elements.tasksTab.addEventListener("click", () => setAppTab("tasks"));
elements.sakuraPanelClose.addEventListener("click", () => {
  treeStatusOpen = false;
  renderAppTabs();
});
window.addEventListener?.("resize", () => {
  renderSidebarLayout();
  elements.sakuraArt.setAttribute(
    "preserveAspectRatio",
    window.innerWidth <= 680 ? "xMidYMax meet" : "xMidYMax slice",
  );
  syncSakuraTreePosition();
  closePriorityMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModalElement = document.querySelector(
      ".modal-backdrop:not([hidden])",
    );
    if (openModalElement) {
      closeModal(openModalElement);
    } else {
      closeSidebar();
    }
    closePriorityMenu();
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
    event.preventDefault();
    openListModal("create");
  }
});

const startupGardenPenalty = reconcileGardenPenalties();
if (startupGardenPenalty > 0) saveState();
setupPwa();
applyLaunchShortcut();
render();
if (startupGardenPenalty > 0) {
  window.setTimeout(() => {
    spawnFallingPetals(10);
    showToast(
      `连续记录中断，樱花树飘落 ${startupGardenPenalty} 个花瓣`,
    );
  }, 350);
}
