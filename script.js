/* =========================================================
   YOYOTECH DIGITAL UNIVERSE
   CORE ENGINE v2.0.0
   ========================================================= */


/* =========================================================
   STATE
   ========================================================= */

const DEFAULT_STATE = {

  user: {
    name: "YOYO",
    xp: 0,
    coins: 500,
    level: 1,
    achievements: [],
    missionsCompleted: 0
  },

  settings: {
    sound: true,
    animations: true,
    notifications: true,
    theme: "midnight"
  },

  games: {
    defenderHigh: 0,
    lightningHigh: 0,
    reactionBest: 0,
    memoryLevel: 1
  },

  missions: {
    boot: false,
    game: false,
    lab: false,
    social: false
  },

  messages: {
    Alex: [
      {
        text: "Welcome to YOYOTECH! ⚡",
        me: false,
        time: "17:01"
      },
      {
        text: "The core is looking amazing.",
        me: false,
        time: "17:02"
      },
      {
        text: "Ready to explore?",
        me: false,
        time: "17:03"
      }
    ],

    "YTCC Core": [
      {
        text: "SYSTEM ONLINE.",
        me: false,
        time: "SYSTEM"
      },
      {
        text: "All major modules operational.",
        me: false,
        time: "SYSTEM"
      }
    ],

    Team: [
      {
        text: "Mission briefing uploaded.",
        me: false,
        time: "15:42"
      }
    ]
  }

};

let state = loadState();

let currentPage = "home";
let currentChat = "Alex";

let defender = {
  running: false,
  score: 0,
  time: 30,
  combo: 0,
  timer: null,
  enemyTimer: null
};

let reaction = {
  active: false,
  ready: false,
  startTime: 0,
  timeout: null
};

let memory = {
  sequence: [],
  userSequence: [],
  level: 1,
  accepting: false
};

let notifications = [
  {
    icon: "⚡",
    title: "Core Online",
    text: "YOYOTECH has successfully initialized."
  },
  {
    icon: "◆",
    title: "Welcome",
    text: "Your first mission is waiting."
  }
];


/* =========================================================
   STORAGE
   ========================================================= */

function loadState() {

  try {

    const saved = localStorage.getItem("yoyotechState");

    if (!saved) {
      return structuredClone(DEFAULT_STATE);
    }

    const parsed = JSON.parse(saved);

    return deepMerge(
      structuredClone(DEFAULT_STATE),
      parsed
    );

  } catch (error) {

    console.warn("State recovery:", error);

    return structuredClone(DEFAULT_STATE);
  }
}


function saveState() {

  try {
    localStorage.setItem(
      "yoyotechState",
      JSON.stringify(state)
    );
  } catch (error) {
    console.warn("Could not save state.", error);
  }
}


function deepMerge(target, source) {

  for (const key in source) {

    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {

      if (!target[key]) {
        target[key] = {};
      }

      deepMerge(target[key], source[key]);

    } else {

      target[key] = source[key];

    }
  }

  return target;
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeBoot();

  initializeApplication();

});


function initializeBoot() {

  const progress = document.getElementById("bootProgress");
  const textElement = document.getElementById("bootText");

  const stages = [
    [15, "INITIALIZING CORE..."],
    [32, "LOADING USER PROFILE..."],
    [49, "LOADING DIGITAL UNIVERSE..."],
    [66, "CONNECTING MODULES..."],
    [82, "STARTING SYSTEMS..."],
    [100, "YOYOTECH ONLINE."]
  ];

  let index = 0;

  const interval = setInterval(() => {

    if (index >= stages.length) {

      clearInterval(interval);

      setTimeout(() => {

        document
          .getElementById("bootScreen")
          .classList.add("hide");

      }, 450);

      return;
    }

    progress.style.width = stages[index][0] + "%";
    textElement.textContent = stages[index][1];

    index++;

  }, 250);
}


function initializeApplication() {

  updateAllUI();

  renderChats();

  renderMessages();

  renderMissions();

  renderAchievements();

  setupKeyboardShortcuts();

  registerServiceWorker();

  setTimeout(() => {

    if (!state.missions.boot) {

      state.missions.boot = true;

      completeMission("boot");

      saveState();

    }

  }, 1500);
}


/* =========================================================
   NAVIGATION
   ========================================================= */

const pageNames = {
  home: "HOME",
  social: "SOCIAL",
  games: "GAMES",
  lab: "EXPERIMENT LAB",
  projects: "PROJECTS",
  missions: "MISSIONS",
  profile: "PROFILE",
  settings: "SETTINGS"
};


function navigate(page) {

  const target = document.getElementById(`page-${page}`);

  if (!target) return;

  currentPage = page;

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  target.classList.add("active-page");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.page === page
    );
  });

  document.querySelectorAll(".mobile-nav button").forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.page === page
    );
  });

  document.getElementById("pageTitle").textContent =
    pageNames[page] || page.toUpperCase();

  if (page === "profile") {
    renderAchievements();
  }

  if (page === "missions") {
    renderMissions();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (state.settings.sound) {
    playClick();
  }
}


/* =========================================================
   UI UPDATE
   ========================================================= */

function updateAllUI() {

  updateUser();

  updateSettings();

  updateMissionSummary();

}


function updateUser() {

  const user = state.user;

  document.getElementById("heroUsername").textContent =
    user.name;

  document.getElementById("sideUsername").textContent =
    user.name;

  document.getElementById("sideLevel").textContent =
    `LEVEL ${user.level}`;

  document.getElementById("topAvatar").textContent =
    user.name.charAt(0).toUpperCase();

  document.getElementById("profileAvatar").textContent =
    user.name.charAt(0).toUpperCase();

  document.getElementById("profileName").textContent =
    user.name;

  document.getElementById("profileXP").textContent =
    user.xp;

  document.getElementById("profileCoins").textContent =
    user.coins;

  document.getElementById("profileLevel").textContent =
    user.level;

  document.getElementById("profileAchievements").textContent =
    user.achievements.length;

  document.getElementById("topXP").textContent =
    `${user.xp} XP`;

  document.getElementById("topCoins").textContent =
    user.coins;

  document.getElementById("homeXP").textContent =
    user.xp;

  document.getElementById("homeCoins").textContent =
    user.coins;

  document.getElementById("homeLevel").textContent =
    user.level;

  document.getElementById("homeAchievements").textContent =
    user.achievements.length;

  document.getElementById("gameLevel").textContent =
    user.level;

  document.getElementById("profileRank").textContent =
    getRank(user.level);

  document.getElementById("homeRank").textContent =
    getRank(user.level);

  const currentLevelXP = getLevelXP(user.level);
  const previousLevelXP = getLevelXP(user.level - 1);

  const progress =
    user.xp - previousLevelXP;

  const needed =
    currentLevelXP - previousLevelXP;

  const percentage =
    Math.max(
      0,
      Math.min(
        100,
        (progress / needed) * 100
      )
    );

  document.getElementById("profileXPText").textContent =
    `${Math.max(0, progress)} / ${needed} XP`;

  document.getElementById("profileXPBar").style.width =
    `${percentage}%`;

  document.getElementById("runScore").textContent =
    state.games.lightningHigh;

  document.getElementById("reactionScore").textContent =
    state.games.reactionBest || 0;

  document.getElementById("memoryLevel").textContent =
    state.games.memoryLevel;

  document.getElementById("memoryCurrentLevel").textContent =
    memory.level;

}


function getLevelXP(level) {

  if (level <= 0) return 0;

  return (level - 1) * 100;
}


function getRank(level) {

  if (level >= 50) return "CORE MASTER";
  if (level >= 35) return "SYSTEM COMMANDER";
  if (level >= 25) return "CORE OPERATOR";
  if (level >= 15) return "DIGITAL EXPLORER";
  if (level >= 10) return "SYSTEM RUNNER";
  if (level >= 5) return "CORE USER";

  return "CORE INITIATE";
}


/* =========================================================
   XP / COINS
   ========================================================= */

function addXP(amount, reason = "Activity") {

  const oldLevel = state.user.level;

  state.user.xp += amount;

  const newLevel =
    Math.floor(state.user.xp / 100) + 1;

  state.user.level = newLevel;

  saveState();

  updateUser();

  if (newLevel > oldLevel) {

    addCoins(newLevel * 25);

    showToast(
      `LEVEL UP! You reached Level ${newLevel}.`,
      "success"
    );

    addNotification(
      "◆",
      "Level Up",
      `You reached Level ${newLevel}!`
    );

    unlockAchievement("level5");

  } else {

    showToast(
      `+${amount} XP — ${reason}`,
      "success"
    );

  }
}


function addCoins(amount) {

  state.user.coins += amount;

  saveState();

  updateUser();
}


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const achievements = {

  firstBoot: {
    title: "FIRST BOOT",
    description: "Launch YOYOTECH for the first time.",
    icon: "⚡"
  },

  social: {
    title: "FIRST MESSAGE",
    description: "Send your first message.",
    icon: "◉"
  },

  game: {
    title: "GAME OPERATOR",
    description: "Play your first game.",
    icon: "◆"
  },

  scientist: {
    title: "SCIENTIST",
    description: "Run your first experiment.",
    icon: "⌬"
  },

  explorer: {
    title: "EXPLORER",
    description: "Visit every major system.",
    icon: "◇"
  },

  secret: {
    title: "CLASSIFIED",
    description: "Discover the Secret Core.",
    icon: "🔐"
  },

  level5: {
    title: "CORE USER",
    description: "Reach Level 5.",
    icon: "▲"
  },

  defender: {
    title: "CORE DEFENDER",
    description: "Complete a Core Defender run.",
    icon: "🛡"
  }
};


function unlockAchievement(id) {

  if (!achievements[id]) return;

  if (state.user.achievements.includes(id)) {
    return;
  }

  state.user.achievements.push(id);

  addCoins(50);

  saveState();

  updateUser();

  renderAchievements();

  const achievement =
    achievements[id];

  addNotification(
    achievement.icon,
    "Achievement Unlocked",
    achievement.title
  );

  showToast(
    `🏆 ${achievement.title} unlocked! +50 coins`,
    "success"
  );
}


function renderAchievements() {

  const grid =
    document.getElementById("achievementGrid");

  if (!grid) return;

  grid.innerHTML = "";

  Object.entries(achievements).forEach(
    ([id, achievement]) => {

      const unlocked =
        state.user.achievements.includes(id);

      const card =
        document.createElement("div");

      card.className =
        `achievement ${unlocked ? "" : "locked"}`;

      card.innerHTML = `
        <div class="achievement-icon">
          ${unlocked ? achievement.icon : "?"}
        </div>

        <strong>${achievement.title}</strong>

        <small>
          ${achievement.description}
        </small>
      `;

      grid.appendChild(card);

    }
  );
}


/* =========================================================
   MISSIONS
   ========================================================= */

const missionData = {

  boot: {
    title: "Initialize YOYOTECH",
    description: "Complete your first system boot.",
    reward: 100,
    coins: 50
  },

  game: {
    title: "Game Operator",
    description: "Play your first YOYOTECH game.",
    reward: 150,
    coins: 75
  },

  lab: {
    title: "First Experiment",
    description: "Run an experiment in the Lab.",
    reward: 150,
    coins: 75
  },

  social: {
    title: "Make Contact",
    description: "Send your first message.",
    reward: 100,
    coins: 50
  }
};


function renderMissions() {

  const container =
    document.getElementById("missionsList");

  if (!container) return;

  container.innerHTML = "";

  Object.entries(missionData).forEach(
    ([id, mission]) => {

      const done =
        state.missions[id];

      const item =
        document.createElement("div");

      item.className =
        `mission-item ${done ? "done" : ""}`;

      item.innerHTML = `
        <div class="mission-check">
          ${done ? "✓" : "◇"}
        </div>

        <div class="mission-details">
          <strong>${mission.title}</strong>
          <small>${mission.description}</small>
        </div>

        <div class="mission-reward">
          +${mission.reward} XP
        </div>
      `;

      container.appendChild(item);

    }
  );

  updateMissionSummary();
}


function completeMission(id) {

  if (!missionData[id]) return;

  if (state.missions[id]) return;

  state.missions[id] = true;

  state.user.missionsCompleted++;

  const mission =
    missionData[id];

  state.user.xp += mission.reward;
  state.user.coins += mission.coins;

  const newLevel =
    Math.floor(state.user.xp / 100) + 1;

  state.user.level =
    Math.max(state.user.level, newLevel);

  if (id === "boot") {
    unlockAchievement("firstBoot");
  }

  if (id === "game") {
    unlockAchievement("game");
  }

  if (id === "lab") {
    unlockAchievement("scientist");
  }

  if (id === "social") {
    unlockAchievement("social");
  }

  saveState();

  updateAllUI();

  renderMissions();
}


function updateMissionSummary() {

  const done =
    Object.values(state.missions)
      .filter(Boolean).length;

  const total =
    Object.keys(state.missions).length;

  document.getElementById(
    "missionCompleted"
  ).textContent = done;

  const current =
    Object.entries(missionData)
      .find(([id]) => !state.missions[id]);

  if (current) {

    const [id, mission] = current;

    document.getElementById(
      "homeMissionTitle"
    ).textContent = mission.title;

    document.getElementById(
      "homeMissionProgress"
    ).textContent = "0 / 1";

    document.getElementById(
      "homeMissionBar"
    ).style.width = "0%";

  } else {

    document.getElementById(
      "homeMissionTitle"
    ).textContent = "All missions completed!";

    document.getElementById(
      "homeMissionProgress"
    ).textContent = `${done} / ${total}`;

    document.getElementById(
      "homeMissionBar"
    ).style.width = "100%";
  }
}


/* =========================================================
   SOCIAL
   ========================================================= */

function renderChats(filter = "") {

  const container =
    document.getElementById("chatListItems");

  if (!container) return;

  container.innerHTML = "";

  Object.entries(state.messages).forEach(
    ([name, messages]) => {

      if (
        filter &&
        !name.toLowerCase().includes(
          filter.toLowerCase()
        )
      ) {
        return;
      }

      const last =
        messages[messages.length - 1];

      const item =
        document.createElement("button");

      item.className =
        `chat-item ${name === currentChat ? "active" : ""}`;

      item.onclick = () => selectChat(name);

      item.innerHTML = `
        <div class="chat-avatar">
          ${name.charAt(0)}
        </div>

        <div class="chat-item-info">
          <strong>${name}</strong>
          <small>${last ? last.text : "No messages yet."}</small>
        </div>

        <span class="chat-time">
          ${last ? last.time : ""}
        </span>
      `;

      container.appendChild(item);

    }
  );
}


function filterChats() {

  const value =
    document.getElementById("chatSearch").value;

  renderChats(value);
}


function selectChat(name) {

  currentChat = name;

  document.getElementById("chatName").textContent =
    name;

  document.getElementById("chatAvatar").textContent =
    name.charAt(0);

  document.getElementById("chatStatus").textContent =
    name === "YTCC Core"
      ? "● SYSTEM"
      : "● Online";

  renderChats();

  renderMessages();
}


function renderMessages() {

  const container =
    document.getElementById("messages");

  if (!container) return;

  const messages =
    state.messages[currentChat] || [];

  container.innerHTML = "";

  messages.forEach(message => {

    const row =
      document.createElement("div");

    row.className =
      `message-row ${message.me ? "me" : ""}`;

    row.innerHTML = `
      <div class="message-bubble">
        ${escapeHTML(message.text)}

        <div class="message-meta">
          ${message.time}
          ${message.me ? " ✓✓" : ""}
        </div>
      </div>
    `;

    container.appendChild(row);

  });

  container.scrollTop =
    container.scrollHeight;
}


function sendMessage(event) {

  event.preventDefault();

  const input =
    document.getElementById("messageInput");

  const text =
    input.value.trim();

  if (!text) return;

  if (!state.messages[currentChat]) {
    state.messages[currentChat] = [];
  }

  state.messages[currentChat].push({

    text,
    me: true,

    time:
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )

  });

  input.value = "";

  saveState();

  renderChats();

  renderMessages();

  if (!state.missions.social) {
    completeMission("social");
  }

  unlockAchievement("social");

  simulateReply();

}


function simulateReply() {

  if (
    currentChat === "YTCC Core" ||
    currentChat === "Team"
  ) {
    return;
  }

  const typing =
    document.getElementById("typingIndicator");

  typing.style.display = "block";

  setTimeout(() => {

    typing.style.display = "none";

    const replies = [
      "⚡ That's awesome!",
      "The core is definitely coming together.",
      "YOYOTECH is getting bigger.",
      "System confirms. 😎",
      "We should build another experiment!",
      "Mission accepted."
    ];

    const reply =
      replies[
        Math.floor(
          Math.random() * replies.length
        )
      ];

    state.messages[currentChat].push({

      text: reply,
      me: false,

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        )

    });

    saveState();

    renderChats();

    renderMessages();

    if (state.settings.sound) {
      playBeep(520, .08);
    }

  }, 900);
}


function newChat() {

  const name =
    prompt("Enter a contact name:");

  if (!name) return;

  const clean =
    name.trim();

  if (!clean) return;

  if (!state.messages[clean]) {
    state.messages[clean] = [];
  }

  selectChat(clean);

  showToast(
    `${clean} added to communications.`,
    "success"
  );
}


/* =========================================================
   GAMES — CORE DEFENDER
   ========================================================= */

function startCoreDefender() {

  document
    .getElementById("gameModal")
    .classList.remove("hidden");

  defender.running = true;
  defender.score = 0;
  defender.time = 30;
  defender.combo = 0;

  updateDefenderHUD();

  clearInterval(defender.timer);
  clearInterval(defender.enemyTimer);

  defender.timer =
    setInterval(() => {

      defender.time--;

      updateDefenderHUD();

      if (defender.time <= 0) {
        endCoreDefender();
      }

    }, 1000);

  defender.enemyTimer =
    setInterval(() => {

      if (defender.running) {
        spawnEnemy();
      }

    }, 650);

}


function spawnEnemy() {

  const arena =
    document.getElementById("defenderArena");

  const enemy =
    document.createElement("div");

  enemy.className =
    "defender-enemy";

  enemy.textContent = "◆";

  const side =
    Math.floor(Math.random() * 4);

  let x;
  let y;

  if (side === 0) {
    x = Math.random() * 100;
    y = -5;
  } else if (side === 1) {
    x = 105;
    y = Math.random() * 100;
  } else if (side === 2) {
    x = Math.random() * 100;
    y = 105;
  } else {
    x = -5;
    y = Math.random() * 100;
  }

  enemy.style.left = `${x}%`;
  enemy.style.top = `${y}%`;

  const duration =
    1.8 + Math.random() * 1.4;

  enemy.style.animationDuration =
    `${duration}s`;

  arena.appendChild(enemy);

  setTimeout(() => {

    enemy.remove();

  }, duration * 1000);

}


function defendCore() {

  if (!defender.running) return;

  defender.score +=
    10 + defender.combo * 2;

  defender.combo++;

  updateDefenderHUD();

  if (state.settings.sound) {
    playBeep(
      500 + defender.combo * 10,
      .06
    );
  }

  const arena =
    document.getElementById("defenderArena");

  arena.style.transform =
    "scale(.985)";

  setTimeout(() => {
    arena.style.transform = "";
  }, 70);

}


function updateDefenderHUD() {

  document.getElementById(
    "defenderScore"
  ).textContent = defender.score;

  document.getElementById(
    "defenderTime"
  ).textContent = defender.time;

  document.getElementById(
    "defenderCombo"
  ).textContent = defender.combo;
}


function endCoreDefender() {

  if (!defender.running) return;

  defender.running = false;

  clearInterval(defender.timer);
  clearInterval(defender.enemyTimer);

  if (
    defender.score >
    state.games.defenderHigh
  ) {

    state.games.defenderHigh =
      defender.score;

  }

  saveState();

  unlockAchievement("defender");

  completeMission("game");

  addXP(
    Math.max(20, defender.score),
    "Core Defender"
  );

  showToast(
    `Core Defender complete — ${defender.score} points!`,
    "success"
  );

  updateUser();

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.classList.add("hidden");
  }

  if (id === "gameModal") {

    defender.running = false;

    clearInterval(defender.timer);
    clearInterval(defender.enemyTimer);

  }

}


/* =========================================================
   LIGHTNING RUN
   ========================================================= */

function playLightningRun() {

  unlockAchievement("game");

  completeMission("game");

  const score =
    Math.floor(
      Math.random() * 900
    ) + 100;

  if (score > state.games.lightningHigh) {

    state.games.lightningHigh =
      score;

    saveState();

  }

  addXP(
    Math.floor(score / 10),
    "Lightning Run"
  );

  showToast(
    `Lightning Run score: ${score}`,
    "success"
  );

  updateUser();
}


/* =========================================================
   REACTION GAME
   ========================================================= */

function startReaction() {

  document
    .getElementById("reactionModal")
    .classList.remove("hidden");

  reaction.active = false;
  reaction.ready = false;

  const area =
    document.getElementById("reactionArea");

  area.className =
    "reaction-area";

  document.getElementById(
    "reactionText"
  ).textContent =
    "CLICK START";
}


function reactionStart() {

  if (reaction.active) return;

  reaction.active = true;
  reaction.ready = false;

  const area =
    document.getElementById("reactionArea");

  area.className =
    "reaction-area waiting";

  document.getElementById(
    "reactionText"
  ).textContent =
    "WAIT...";

  const delay =
    1000 + Math.random() * 3500;

  reaction.timeout =
    setTimeout(() => {

      reaction.ready = true;

      reaction.startTime =
        performance.now();

      area.className =
        "reaction-area ready";

      document.getElementById(
        "reactionText"
      ).textContent =
        "CLICK!";

    }, delay);
}


function reactionClick() {

  if (!reaction.active) return;

  if (!reaction.ready) {

    clearTimeout(reaction.timeout);

    reaction.active = false;

    document.getElementById(
      "reactionText"
    ).textContent =
      "TOO EARLY!";

    return;
  }

  const result =
    Math.round(
      performance.now() -
      reaction.startTime
    );

  reaction.active = false;
  reaction.ready = false;

  if (
    !state.games.reactionBest ||
    result < state.games.reactionBest
  ) {

    state.games.reactionBest =
      result;

    saveState();

  }

  addXP(
    Math.max(10, Math.floor(200 - result / 4)),
    "Reaction Test"
  );

  showToast(
    `Reaction time: ${result}ms`,
    "success"
  );

  document.getElementById(
    "reactionText"
  ).textContent =
    `${result}ms`;

  updateUser();
}


/* =========================================================
   MEMORY GAME
   ========================================================= */

function startMemory() {

  document
    .getElementById("memoryModal")
    .classList.remove("hidden");

  memory.level =
    state.games.memoryLevel || 1;

  memory.sequence = [];
  memory.userSequence = [];
  memory.accepting = false;

  document.getElementById(
    "memoryCurrentLevel"
  ).textContent =
    memory.level;
}


function memoryBegin() {

  memory.sequence = [];
  memory.userSequence = [];
  memory.accepting = false;

  for (
    let i = 0;
    i < memory.level + 2;
    i++
  ) {

    memory.sequence.push(
      Math.floor(Math.random() * 9)
    );

  }

  showMemorySequence();
}


async function showMemorySequence() {

  memory.accepting = false;

  for (
    let i = 0;
    i < memory.sequence.length;
    i++
  ) {

    await sleep(420);

    flashMemoryButton(
      memory.sequence[i]
    );

  }

  await sleep(450);

  memory.userSequence = [];
  memory.accepting = true;
}


function flashMemoryButton(index) {

  const buttons =
    document.querySelectorAll(
      ".memory-grid button"
    );

  if (!buttons[index]) return;

  buttons[index].classList.add("flash");

  setTimeout(() => {

    buttons[index].classList.remove("flash");

  }, 300);
}


function memoryPress(index) {

  if (!memory.accepting) return;

  memory.userSequence.push(index);

  flashMemoryButton(index);

  const position =
    memory.userSequence.length - 1;

  if (
    memory.userSequence[position] !==
    memory.sequence[position]
  ) {

    memory.accepting = false;

    showToast(
      "Sequence failed. Try again!",
      "error"
    );

    memory.level = 1;

    return;
  }

  if (
    memory.userSequence.length ===
    memory.sequence.length
  ) {

    memory.accepting = false;

    memory.level++;

    state.games.memoryLevel =
      Math.max(
        state.games.memoryLevel,
        memory.level
      );

    saveState();

    addXP(
      memory.level * 20,
      "Core Memory"
    );

    showToast(
      `Memory Level ${memory.level} complete!`,
      "success"
    );

    setTimeout(() => {

      memoryBegin();

    }, 600);

  }

}


/* =========================================================
   EXPERIMENT LAB
   ========================================================= */

function runExperiment(type) {

  unlockAchievement("scientist");

  completeMission("lab");

  addXP(20, "Experiment");

  const modal =
    document.getElementById(
      "experimentModal"
    );

  const content =
    document.getElementById(
      "experimentContent"
    );

  modal.classList.remove("hidden");

  if (type === "particle") {
    openParticleExperiment(content);
  }

  if (type === "terminal") {
    openLabTerminal(content);
  }

  if (type === "scanner") {
    openScanner(content);
  }

  if (type === "sound") {
    openSoundLab(content);
  }

  if (type === "matrix") {
    openDigitalRain(content);
  }

  if (type === "calculator") {
    openCalculator(content);
  }

}


function openParticleExperiment(container) {

  container.innerHTML = `
    <span class="eyebrow">VISUAL EXPERIMENT</span>
    <h2>PARTICLE UNIVERSE</h2>

    <p style="color:var(--muted);margin-top:8px;font-size:10px;">
      Move your pointer through the field.
    </p>

    <canvas class="particle-canvas" id="particleCanvas"></canvas>
  `;

  startParticles();
}


function startParticles() {

  const canvas =
    document.getElementById(
      "particleCanvas"
    );

  if (!canvas) return;

  const ctx =
    canvas.getContext("2d");

  const rect =
    canvas.getBoundingClientRect();

  canvas.width =
    rect.width * devicePixelRatio;

  canvas.height =
    rect.height * devicePixelRatio;

  ctx.scale(
    devicePixelRatio,
    devicePixelRatio
  );

  const width = rect.width;
  const height = rect.height;

  const particles =
    Array.from(
      {length: 75},
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .6,
        vy: (Math.random() - .5) * .6,
        r: Math.random() * 2 + 1
      })
    );

  let mouse = {
    x: width / 2,
    y: height / 2
  };

  canvas.onmousemove = event => {

    const r =
      canvas.getBoundingClientRect();

    mouse.x =
      event.clientX - r.left;

    mouse.y =
      event.clientY - r.top;

  };

  function frame() {

    if (
      document
        .getElementById("experimentModal")
        .classList.contains("hidden")
    ) {
      return;
    }

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    particles.forEach(p => {

      const dx =
        mouse.x - p.x;

      const dy =
        mouse.y - p.y;

      const distance =
        Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {

        p.x -= dx * .001;
        p.y -= dy * .001;

      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) {
        p.vx *= -1;
      }

      if (p.y < 0 || p.y > height) {
        p.vy *= -1;
      }

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(56,207,255,.75)";

      ctx.fill();

    });

    for (
      let i = 0;
      i < particles.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < particles.length;
        j++
      ) {

        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const d =
          Math.sqrt(dx * dx + dy * dy);

        if (d < 75) {

          ctx.beginPath();

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle =
            `rgba(0,168,255,${.12 - d / 800})`;

          ctx.stroke();

        }

      }

    }

    requestAnimationFrame(frame);
  }

  frame();
}


function openLabTerminal(container) {

  container.innerHTML = `
    <span class="eyebrow">SYSTEM EXPERIMENT</span>
    <h2>CORE TERMINAL</h2>

    <div class="terminal-output"
         id="modalTerminalOutput"
         style="margin-top:15px;border:1px solid var(--border);border-radius:12px;background:#02060a;">
      <div>YOYOTECH CORE TERMINAL</div>
      <div>Safe simulation environment initialized.</div>
      <div>Try: status, scan, core, help</div>
      <div class="terminal-prompt">YT@CORE:~$ <span class="blink">_</span></div>
    </div>

    <form class="terminal-input"
          style="margin-top:10px;border:1px solid var(--border);border-radius:10px;"
          onsubmit="modalTerminalCommand(event)">
      <span>YT@CORE:~$</span>
      <input id="modalTerminalInput" autocomplete="off">
    </form>
  `;
}


function modalTerminalCommand(event) {

  event.preventDefault();

  const input =
    document.getElementById(
      "modalTerminalInput"
    );

  const output =
    document.getElementById(
      "modalTerminalOutput"
    );

  const command =
    input.value.trim().toLowerCase();

  if (!command) return;

  const responses = {

    help:
      "Commands: status, scan, core, clear, hello",

    status:
      "CORE: ONLINE | NETWORK: ONLINE | SECURITY: ACTIVE",

    scan:
      "Simulation scan complete. 0 threats detected.",

    core:
      "YOYOTECH CORE v2.0.0 — STABLE",

    hello:
      "HELLO, OPERATOR."

  };

  const line =
    document.createElement("div");

  line.textContent =
    `YT@CORE:~$ ${command}`;

  output.appendChild(line);

  const response =
    document.createElement("div");

  response.textContent =
    responses[command] ||
    "Unknown command. Type help.";

  response.style.color =
    "#7bd7ff";

  output.appendChild(response);

  input.value = "";

  output.scrollTop =
    output.scrollHeight;

}


function openScanner(container) {

  container.innerHTML = `
    <span class="eyebrow">DIAGNOSTICS</span>
    <h2>SYSTEM SCANNER</h2>

    <div class="scan-result" id="scanResult">
      <div class="scan-line">
        <span>CORE</span>
        <b>SCANNING...</b>
      </div>

      <div class="scan-line">
        <span>MEMORY</span>
        <b>SCANNING...</b>
      </div>

      <div class="scan-line">
        <span>NETWORK</span>
        <b>SCANNING...</b>
      </div>

      <div class="scan-line">
        <span>SECURITY</span>
        <b>SCANNING...</b>
      </div>
    </div>
  `;

  setTimeout(() => {

    document.querySelectorAll(
      "#scanResult .scan-line b"
    ).forEach(
      item => {
        item.textContent =
          "100% — OK";
      }
    );

    showToast(
      "System scan complete.",
      "success"
    );

  }, 1400);
}


function openSoundLab(container) {

  container.innerHTML = `
    <span class="eyebrow">AUDIO EXPERIMENT</span>
    <h2>SOUND LAB</h2>

    <p style="color:var(--muted);font-size:10px;margin-top:8px;">
      Click a frequency to generate a browser tone.
    </p>

    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      margin-top:25px;
    ">

      <button class="secondary-button"
              onclick="playBeep(220,.4)">
        220Hz
      </button>

      <button class="secondary-button"
              onclick="playBeep(440,.4)">
        440Hz
      </button>

      <button class="secondary-button"
              onclick="playBeep(880,.4)">
        880Hz
      </button>

      <button class="secondary-button"
              onclick="playBeep(1200,.4)">
        1200Hz
      </button>

      <button class="secondary-button"
              onclick="playBeep(1600,.4)">
        1600Hz
      </button>

      <button class="secondary-button"
              onclick="playBeep(2000,.4)">
        2000Hz
      </button>

    </div>
  `;
}


function openDigitalRain(container) {

  container.innerHTML = `
    <span class="eyebrow">VISUAL EXPERIMENT</span>
    <h2>DIGITAL RAIN</h2>

    <canvas
      id="rainCanvas"
      class="particle-canvas"
      style="margin-top:15px;"
    ></canvas>
  `;

  startRain();
}


function startRain() {

  const canvas =
    document.getElementById(
      "rainCanvas"
    );

  if (!canvas) return;

  const ctx =
    canvas.getContext("2d");

  const rect =
    canvas.getBoundingClientRect();

  canvas.width =
    rect.width;

  canvas.height =
    rect.height;

  const fontSize = 13;

  const columns =
    Math.floor(
      canvas.width / fontSize
    );

  const drops =
    Array(columns).fill(1);

  function draw() {

    if (
      document
        .getElementById("experimentModal")
        .classList.contains("hidden")
    ) return;

    ctx.fillStyle =
      "rgba(0,0,0,.08)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle =
      "#00a8ff";

    ctx.font =
      `${fontSize}px monospace`;

    drops.forEach(
      (y, i) => {

        const char =
          Math.random() > .5
            ? "1"
            : "0";

        ctx.fillText(
          char,
          i * fontSize,
          y * fontSize
        );

        if (
          y * fontSize >
            canvas.height &&
          Math.random() > .975
        ) {
          drops[i] = 0;
        }

        drops[i]++;

      }
    );

    requestAnimationFrame(draw);
  }

  draw();
}


function openCalculator(container) {

  container.innerHTML = `
    <span class="eyebrow">UTILITY</span>
    <h2>CORE CALCULATOR</h2>

    <input
      id="calcDisplay"
      readonly
      value="0"
      style="
        width:100%;
        height:55px;
        margin-top:18px;
        padding:15px;
        color:var(--blue-bright);
        background:#02060a;
        border:1px solid var(--border);
        border-radius:10px;
        outline:0;
        font-size:20px;
        text-align:right;
      "
    >

    <div style="
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:7px;
      margin-top:10px;
    ">

      ${[
        "7","8","9","/",
        "4","5","6","*",
        "1","2","3","-",
        "0",".","=","+"
      ].map(key => `
        <button
          class="secondary-button"
          style="height:48px;"
          onclick="calculatorPress('${key}')"
        >
          ${key}
        </button>
      `).join("")}

    </div>

    <button
      class="danger-button"
      style="width:100%;margin-top:8px;height:40px;"
      onclick="calculatorClear()"
    >
      CLEAR
    </button>
  `;
}


let calculatorValue = "";


function calculatorPress(key) {

  const display =
    document.getElementById(
      "calcDisplay"
    );

  if (!display) return;

  if (key === "=") {

    try {

      calculatorValue =
        String(
          Function(
            `"use strict";return (${calculatorValue})`
          )()
        );

    } catch {

      calculatorValue = "ERROR";

    }

  } else {

    if (calculatorValue === "ERROR") {
      calculatorValue = "";
    }

    calculatorValue += key;

  }

  display.value =
    calculatorValue || "0";
}


function calculatorClear() {

  calculatorValue = "";

  const display =
    document.getElementById(
      "calcDisplay"
    );

  if (display) {
    display.value = "0";
  }
}


/* =========================================================
   TERMINAL
   ========================================================= */

function terminalCommand(event) {

  event.preventDefault();

  const input =
    document.getElementById(
      "terminalInput"
    );

  const output =
    document.getElementById(
      "terminalOutput"
    );

  const command =
    input.value.trim().toLowerCase();

  if (!command) return;

  const line =
    document.createElement("div");

  line.textContent =
    `YT@CORE:~$ ${command}`;

  output.appendChild(line);

  let response = "";

  switch (command) {

    case "help":
      response =
        "Commands: help, status, scan, core, user, xp, coins, clear, secret";
      break;

    case "status":
      response =
        "CORE ONLINE | NETWORK ONLINE | SECURITY ACTIVE";
      break;

    case "scan":
      response =
        "Simulation scan complete. 0 threats detected.";
      break;

    case "core":
      response =
        "YOYOTECH CORE v2.0.0 — STABLE";
      break;

    case "user":
      response =
        `${state.user.name} — LEVEL ${state.user.level}`;
      break;

    case "xp":
      response =
        `${state.user.xp} XP`;
      break;

    case "coins":
      response =
        `${state.user.coins} COINS`;
      break;

    case "secret":
      response =
        "CLASSIFIED ACCESS DETECTED.";
      break;

    case "clear":
      output.innerHTML =
        '<div>TERMINAL CLEARED.</div>';
      input.value = "";
      return;

    default:
      response =
        "Unknown command. Type help.";
  }

  const responseLine =
    document.createElement("div");

  responseLine.style.color =
    "#7bd7ff";

  responseLine.textContent =
    response;

  output.appendChild(
    responseLine
  );

  const prompt =
    document.createElement("div");

  prompt.className =
    "terminal-prompt";

  prompt.innerHTML =
    'YT@CORE:~$ <span class="blink">_</span>';

  output.appendChild(prompt);

  input.value = "";

  output.scrollTop =
    output.scrollHeight;
}


/* =========================================================
   SECRET CORE
   ========================================================= */

let secretAttempts = 0;


function openSecret() {

  secretAttempts++;

  unlockAchievement("secret");

  const modal =
    document.getElementById(
      "experimentModal"
    );

  const content =
    document.getElementById(
      "experimentContent"
    );

  modal.classList.remove("hidden");

  content.innerHTML = `
    <div style="text-align:center;padding:25px 5px;">

      <div style="
        font-size:50px;
        filter:drop-shadow(0 0 20px #7c5cff);
      ">
        🔐
      </div>

      <span class="eyebrow">
        CLASSIFIED ACCESS
      </span>

      <h2 style="margin-top:8px;">
        SECRET CORE
      </h2>

      <p style="
        color:var(--muted);
        margin-top:10px;
        font-size:10px;
        line-height:1.7;
      ">
        You found a hidden system.
        <br>
        Most users will never know this exists.
      </p>

      <div style="
        margin-top:25px;
        padding:17px;
        border:1px solid rgba(124,92,255,.3);
        border-radius:12px;
        background:rgba(124,92,255,.05);
        color:#a897ff;
        font-family:monospace;
        font-size:9px;
      ">
        ACCESS LEVEL: ${secretAttempts >= 3 ? "CORE MASTER" : "CLASSIFIED"}
        <br><br>
        SYSTEM: YOYOTECH
        <br>
        STATUS: UNRESTRICTED
      </div>

      <button
        class="primary-button"
        style="margin-top:20px;"
        onclick="secretReward()"
      >
        CLAIM SECRET REWARD
      </button>

    </div>
  `;
}


function secretReward() {

  addCoins(250);

  addXP(250, "Secret Core");

  showToast(
    "Secret reward acquired: +250 coins!",
    "success"
  );

}


/* =========================================================
   PROFILE
   ========================================================= */

function editProfile() {

  const name =
    prompt(
      "Enter your YOYOTECH username:",
      state.user.name
    );

  if (!name) return;

  const clean =
    name.trim().slice(0, 18);

  if (!clean) return;

  state.user.name =
    clean.toUpperCase();

  saveState();

  updateAllUI();

  showToast(
    "Profile updated.",
    "success"
  );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function updateSettings() {

  document.getElementById(
    "soundToggle"
  ).checked =
    state.settings.sound;

  document.getElementById(
    "animationToggle"
  ).checked =
    state.settings.animations;

  document.getElementById(
    "notificationToggle"
  ).checked =
    state.settings.notifications;

  document.body.classList.toggle(
    "no-animations",
    !state.settings.animations
  );
}


function toggleSetting(setting, value) {

  state.settings[setting] =
    value;

  saveState();

  updateSettings();

  showToast(
    `${setting.toUpperCase()} ${value ? "enabled" : "disabled"}.`,
    "info"
  );
}


function cycleTheme() {

  const themes = [
    "midnight",
    "ultrablue",
    "purple"
  ];

  const index =
    themes.indexOf(
      state.settings.theme
    );

  const next =
    themes[
      (index + 1) % themes.length
    ];

  state.settings.theme =
    next;

  document.documentElement
    .style
    .setProperty(
      "--blue",
      next === "purple"
        ? "#9b7cff"
        : next === "ultrablue"
          ? "#38cfff"
          : "#00a8ff"
    );

  saveState();

  showToast(
    `Theme changed to ${next}.`,
    "success"
  );
}


function resetData() {

  const confirmed =
    confirm(
      "RESET ALL YOYOTECH DATA?\n\nThis cannot be undone."
    );

  if (!confirmed) return;

  localStorage.removeItem(
    "yoyotechState"
  );

  location.reload();
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function addNotification(
  icon,
  title,
  text
) {

  notifications.unshift({
    icon,
    title,
    text
  });

  if (
    notifications.length > 10
  ) {
    notifications.pop();
  }

  if (
    state.settings.notifications
  ) {
    document.getElementById(
      "notificationDot"
    ).style.display = "block";
  }

  renderNotifications();
}


function renderNotifications() {

  const list =
    document.getElementById(
      "notificationList"
    );

  if (!list) return;

  list.innerHTML = "";

  notifications.forEach(notification => {

    const item =
      document.createElement("div");

    item.className =
      "notification-item";

    item.innerHTML = `
      <div class="notification-icon">
        ${notification.icon}
      </div>

      <div>
        <strong>${escapeHTML(notification.title)}</strong>
        <small>${escapeHTML(notification.text)}</small>
      </div>
    `;

    list.appendChild(item);

  });
}


function showNotifications() {

  document
    .getElementById("notificationPanel")
    .classList.remove("hidden");

  document.getElementById(
    "notificationDot"
  ).style.display = "none";

  renderNotifications();
}


function hideNotifications() {

  document
    .getElementById("notificationPanel")
    .classList.add("hidden");

}


/* =========================================================
   TOASTS
   ========================================================= */

function showToast(
  message,
  type = "info"
) {

  const container =
    document.getElementById(
      "toastContainer"
    );

  const toast =
    document.createElement("div");

  toast.className =
    `toast ${type}`;

  const icon =
    type === "success"
      ? "✓"
      : type === "error"
        ? "!"
        : "⚡";

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = "0";
    toast.style.transform =
      "translateX(20px)";

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 3000);
}


/* =========================================================
   AUDIO
   ========================================================= */

let audioContext = null;


function playBeep(
  frequency = 440,
  duration = .1
) {

  if (!state.settings.sound) return;

  try {

    if (!audioContext) {

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.frequency.value =
      frequency;

    oscillator.type =
      "sine";

    gain.gain.setValueAtTime(
      .035,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      .001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration
    );

  } catch {}
}


function playClick() {
  playBeep(500, .035);
}


/* =========================================================
   SERVICE WORKER
   ========================================================= */

function registerServiceWorker() {

  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => {

      console.log(
        "YOYOTECH service worker online."
      );

    })
    .catch(error => {

      console.warn(
        "Service worker registration failed:",
        error
      );

    });
}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function setupKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "1") {
        navigate("home");
      }

      if (event.key === "2") {
        navigate("social");
      }

      if (event.key === "3") {
        navigate("games");
      }

      if (event.key === "4") {
        navigate("lab");
      }

      if (event.key === "5") {
        navigate("projects");
      }

      if (event.key === "6") {
        navigate("missions");
      }

      if (event.key === "7") {
        navigate("profile");
      }

      if (event.key === "Escape") {

        document
          .querySelectorAll(".modal")
          .forEach(
            modal =>
              modal.classList.add("hidden")
          );

        hideNotifications();

      }

    }
  );

}


/* =========================================================
   UTILITIES
   ========================================================= */

function sleep(ms) {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  );

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

window.addEventListener(
  "error",
  event => {

    console.warn(
      "YOYOTECH recovered from:",
      event.message
    );

  }
);


window.addEventListener(
  "unhandledrejection",
  event => {

    console.warn(
      "YOYOTECH promise recovery:",
      event.reason
    );

  }
);


/* =========================================================
   CONSOLE IDENTITY
   ========================================================= */

console.log(`
⚡ YOYOTECH DIGITAL UNIVERSE
────────────────────────────
CORE VERSION 2.0.0
SYSTEM: ONLINE
ARCHITECTURE: 4 FILES
STATUS: OPERATIONAL

Welcome, Operator.
`);
