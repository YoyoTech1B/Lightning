/* ============================================================
   YOYOCHAT / LIGHTNING SOCIAL ENGINE
   social.js
   WhatsApp-style social + messaging system
   Designed for GitHub Pages / static hosting
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     CONFIG
     ============================================================ */

  const APP = {
    name: "YOYOCHAT",
    version: "1.0.0",
    storage: "YOYOCHAT_SOCIAL_V1",
    currentUserId: "me",
    maxMessageLength: 4000,
    maxPostLength: 2000
  };

  /* ============================================================
     HELPERS
     ============================================================ */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const uid = (prefix = "id") =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const now = () => Date.now();

  const escapeHTML = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatTime = timestamp => {
    const d = new Date(timestamp);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = timestamp => {
    const d = new Date(timestamp);

    const today = new Date();

    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    return d.toLocaleDateString([], {
      day: "numeric",
      month: "short"
    });
  };

  const relativeTime = timestamp => {
    const diff = now() - timestamp;

    if (diff < 60000) return "just now";
    if (diff < 3600000)
      return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
      return `${Math.floor(diff / 3600000)}h ago`;

    return formatDate(timestamp);
  };

  const initials = name =>
    String(name)
      .split(" ")
      .map(x => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const avatar = (user, size = "") => {
    if (user?.avatar) {
      return `
        <img
          class="yc-avatar ${size}"
          src="${escapeHTML(user.avatar)}"
          alt="${escapeHTML(user.name || "User")}"
        >
      `;
    }

    return `
      <div
        class="yc-avatar yc-avatar-fallback ${size}"
        style="--avatar-hue:${Math.abs(hashCode(user?.id || "user")) % 360}"
      >
        ${escapeHTML(initials(user?.name || "User"))}
      </div>
    `;
  };

  const hashCode = str => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    return hash;
  };

  /* ============================================================
     DEFAULT DATABASE
     ============================================================ */

  const defaultDatabase = {
    user: {
      id: "me",
      name: "Yoyo",
      username: "@yoyo",
      bio: "⚡ YOYOCHAT COMMANDER",
      avatar: "",
      online: true,
      lastSeen: now(),
      about: "Available",
      phone: "",
      status: "online"
    },

    contacts: [
      {
        id: "alex",
        name: "Alex",
        username: "@alex",
        avatar: "",
        online: true,
        about: "Building something awesome ⚡"
      },
      {
        id: "max",
        name: "Max",
        username: "@max",
        avatar: "",
        online: false,
        about: "Busy"
      },
      {
        id: "nora",
        name: "Nora",
        username: "@nora",
        avatar: "",
        online: true,
        about: "⚡ Stay electric"
      },
      {
        id: "sam",
        name: "Sam",
        username: "@sam",
        avatar: "",
        online: false,
        about: "At the command center"
      },
      {
        id: "daniel",
        name: "Daniel",
        username: "@daniel",
        avatar: "",
        online: true,
        about: "Let's build 🚀"
      }
    ],

    chats: [
      {
        id: "chat_alex",
        type: "private",
        userId: "alex",
        pinned: true,
        muted: false,
        unread: 0,
        messages: [
          {
            id: uid("msg"),
            sender: "alex",
            text: "Yo! Welcome to YOYOCHAT ⚡",
            timestamp: now() - 3600000,
            status: "read",
            reactions: []
          },
          {
            id: uid("msg"),
            sender: "me",
            text: "This looks insane 🔥",
            timestamp: now() - 3500000,
            status: "read",
            reactions: []
          },
          {
            id: uid("msg"),
            sender: "alex",
            text: "The lightning theme is actually crazy.",
            timestamp: now() - 3400000,
            status: "read",
            reactions: []
          }
        ]
      },

      {
        id: "chat_max",
        type: "private",
        userId: "max",
        pinned: false,
        muted: false,
        unread: 2,
        messages: [
          {
            id: uid("msg"),
            sender: "max",
            text: "Are you online?",
            timestamp: now() - 7200000,
            status: "delivered",
            reactions: []
          },
          {
            id: uid("msg"),
            sender: "max",
            text: "I found something cool 👀",
            timestamp: now() - 7100000,
            status: "delivered",
            reactions: []
          }
        ]
      },

      {
        id: "chat_nora",
        type: "private",
        userId: "nora",
        pinned: false,
        muted: false,
        unread: 0,
        messages: [
          {
            id: uid("msg"),
            sender: "me",
            text: "⚡",
            timestamp: now() - 86400000,
            status: "read",
            reactions: []
          }
        ]
      }
    ],

    groups: [
      {
        id: "group_command",
        type: "group",
        name: "Command Center",
        description: "YOYOCHAT command team",
        avatar: "",
        members: ["me", "alex", "max", "nora"],
        admins: ["me"],
        unread: 0,
        messages: [
          {
            id: uid("msg"),
            sender: "alex",
            text: "Welcome to the Command Center.",
            timestamp: now() - 500000,
            status: "read",
            reactions: []
          },
          {
            id: uid("msg"),
            sender: "me",
            text: "SYSTEM ONLINE ⚡",
            timestamp: now() - 400000,
            status: "read",
            reactions: []
          }
        ]
      }
    ],

    statuses: [
      {
        id: uid("status"),
        userId: "alex",
        text: "Working on something ⚡",
        timestamp: now() - 3600000,
        seen: false
      },
      {
        id: uid("status"),
        userId: "nora",
        text: "⚡ ELECTRIC MODE",
        timestamp: now() - 7200000,
        seen: false
      }
    ],

    communities: [],

    calls: [],

    notifications: [],

    blocked: [],

    archived: [],

    settings: {
      notifications: true,
      sounds: true,
      enterToSend: true,
      readReceipts: true,
      onlineStatus: true,
      lastSeen: true,
      darkMode: true,
      wallpaper: "lightning"
    }
  };

  /* ============================================================
     DATABASE
     ============================================================ */

  let db;

  function loadDatabase() {
    try {
      const saved = localStorage.getItem(APP.storage);

      if (saved) {
        db = JSON.parse(saved);
      } else {
        db = structuredClone(defaultDatabase);
        saveDatabase();
      }
    } catch {
      db = structuredClone(defaultDatabase);
    }
  }

  function saveDatabase() {
    try {
      localStorage.setItem(
        APP.storage,
        JSON.stringify(db)
      );
    } catch (error) {
      console.warn("YOYOCHAT storage error:", error);
    }
  }

  function getUser(id) {
    if (id === "me") return db.user;

    return db.contacts.find(user => user.id === id);
  }

  function getChat(id) {
    return db.chats.find(chat => chat.id === id);
  }

  function getGroup(id) {
    return db.groups.find(group => group.id === id);
  }

  /* ============================================================
     SOCIAL ENGINE STATE
     ============================================================ */

  const state = {
    open: false,
    tab: "chats",
    activeChat: null,
    search: "",
    replyTo: null,
    selectedMessage: null,
    profileUser: null,
    emojiOpen: false,
    attachmentOpen: false,
    menuOpen: false,
    storyOpen: false
  };

  /* ============================================================
     STYLES
     ============================================================ */

  function injectStyles() {
    if ($("#yoyochat-social-styles")) return;

    const style = document.createElement("style");

    style.id = "yoyochat-social-styles";

    style.textContent = `

      /* ========================================================
         ROOT
         ======================================================== */

      #yoyochat-root {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        color: #eaf7ff;
        background:
          radial-gradient(
            circle at 50% -20%,
            rgba(0, 180, 255, .16),
            transparent 45%
          ),
          #02070c;
      }

      #yoyochat-root.open {
        display: flex;
      }

      #yoyochat-root * {
        box-sizing: border-box;
      }

      /* ========================================================
         APP
         ======================================================== */

      .yc-app {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        background:
          linear-gradient(
            90deg,
            rgba(0, 150, 255, .025),
            transparent
          ),
          #03080d;
      }

      /* ========================================================
         SIDEBAR
         ======================================================== */

      .yc-sidebar {
        width: 380px;
        min-width: 320px;
        height: 100%;
        border-right: 1px solid rgba(0, 191, 255, .16);
        background:
          linear-gradient(
            180deg,
            rgba(3, 18, 29, .98),
            rgba(1, 8, 14, .98)
          );
        display: flex;
        flex-direction: column;
      }

      .yc-sidebar-header {
        min-height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(0, 191, 255, .1);
      }

      .yc-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .yc-brand-icon {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background:
          linear-gradient(
            135deg,
            #00c8ff,
            #006eff
          );
        color: #00131f;
        box-shadow:
          0 0 20px rgba(0, 180, 255, .35);
        font-size: 21px;
      }

      .yc-header-actions {
        display: flex;
        gap: 6px;
      }

      .yc-icon-btn {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 12px;
        color: #bceeff;
        background: transparent;
        cursor: pointer;
        font-size: 20px;
        transition: .2s;
      }

      .yc-icon-btn:hover {
        background: rgba(0, 191, 255, .12);
        color: #fff;
        transform: translateY(-1px);
      }

      .yc-close-btn {
        color: #7fdcff;
      }

      /* ========================================================
         SEARCH
         ======================================================== */

      .yc-search {
        padding: 12px 14px;
      }

      .yc-search-box {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid rgba(0, 191, 255, .12);
        background: rgba(0, 191, 255, .055);
      }

      .yc-search-box span {
        opacity: .65;
      }

      .yc-search-box input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        color: #fff;
        font-size: 14px;
      }

      .yc-search-box input::placeholder {
        color: #6e8a99;
      }

      /* ========================================================
         TABS
         ======================================================== */

      .yc-tabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 0 10px 10px;
        gap: 5px;
      }

      .yc-tab {
        position: relative;
        border: 0;
        background: transparent;
        color: #668391;
        border-radius: 12px;
        padding: 9px 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 800;
      }

      .yc-tab.active {
        color: #67d9ff;
        background: rgba(0, 191, 255, .1);
      }

      .yc-tab-icon {
        display: block;
        font-size: 19px;
        margin-bottom: 2px;
      }

      /* ========================================================
         CHAT LIST
         ======================================================== */

      .yc-list {
        flex: 1;
        overflow-y: auto;
        padding: 4px 8px 15px;
      }

      .yc-list::-webkit-scrollbar,
      .yc-messages::-webkit-scrollbar {
        width: 5px;
      }

      .yc-list::-webkit-scrollbar-thumb,
      .yc-messages::-webkit-scrollbar-thumb {
        background: rgba(0, 191, 255, .2);
        border-radius: 20px;
      }

      .yc-chat-row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 10px;
        border: 0;
        border-radius: 14px;
        color: #fff;
        background: transparent;
        cursor: pointer;
        text-align: left;
        transition: .18s;
      }

      .yc-chat-row:hover {
        background: rgba(0, 191, 255, .07);
      }

      .yc-chat-row.active {
        background:
          linear-gradient(
            90deg,
            rgba(0, 180, 255, .14),
            rgba(0, 180, 255, .035)
          );
      }

      .yc-chat-info {
        flex: 1;
        min-width: 0;
      }

      .yc-chat-top {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .yc-chat-name {
        font-weight: 800;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .yc-chat-time {
        font-size: 10px;
        color: #668391;
        white-space: nowrap;
      }

      .yc-chat-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 4px;
      }

      .yc-last-message {
        color: #75909e;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .yc-unread {
        min-width: 19px;
        height: 19px;
        padding: 0 6px;
        display: grid;
        place-items: center;
        border-radius: 50px;
        background: #00aeea;
        color: #001018;
        font-size: 10px;
        font-weight: 900;
      }

      /* ========================================================
         AVATARS
         ======================================================== */

      .yc-avatar {
        width: 48px;
        height: 48px;
        min-width: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .yc-avatar.small {
        width: 38px;
        height: 38px;
        min-width: 38px;
      }

      .yc-avatar.large {
        width: 90px;
        height: 90px;
        min-width: 90px;
      }

      .yc-avatar-fallback {
        display: grid;
        place-items: center;
        background:
          linear-gradient(
            135deg,
            hsl(var(--avatar-hue), 90%, 60%),
            #005cff
          );
        color: white;
        font-weight: 900;
        box-shadow:
          0 0 0 2px #04121b,
          0 0 18px rgba(0, 183, 255, .25);
      }

      /* ========================================================
         MAIN CHAT
         ======================================================== */

      .yc-main {
        flex: 1;
        min-width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        background:
          radial-gradient(
            circle at 50% 50%,
            rgba(0, 174, 255, .035),
            transparent 55%
          ),
          #02070b;
      }

      .yc-chat-header {
        min-height: 72px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 18px;
        border-bottom: 1px solid rgba(0, 191, 255, .12);
        background: rgba(2, 10, 16, .9);
        backdrop-filter: blur(16px);
      }

      .yc-chat-title {
        flex: 1;
        min-width: 0;
      }

      .yc-chat-title strong {
        display: block;
        font-size: 15px;
      }

      .yc-chat-title span {
        color: #5ea1bb;
        font-size: 11px;
      }

      /* ========================================================
         MESSAGES
         ======================================================== */

      .yc-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px 5%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        background-image:
          radial-gradient(
            circle at 20% 20%,
            rgba(0, 200, 255, .025) 0,
            transparent 35%
          );
      }

      .yc-day-divider {
        align-self: center;
        padding: 6px 12px;
        margin: 12px 0;
        border-radius: 10px;
        background: rgba(0, 191, 255, .08);
        color: #6e9aaa;
        font-size: 10px;
        font-weight: 700;
      }

      .yc-message-line {
        display: flex;
        width: 100%;
        margin: 2px 0;
      }

      .yc-message-line.mine {
        justify-content: flex-end;
      }

      .yc-bubble {
        max-width: min(680px, 78%);
        padding: 8px 11px 6px;
        border-radius: 14px;
        position: relative;
        border: 1px solid rgba(0, 191, 255, .07);
        background: #07141d;
        box-shadow: 0 2px 8px rgba(0,0,0,.12);
      }

      .yc-message-line.mine .yc-bubble {
        background:
          linear-gradient(
            135deg,
            #064b69,
            #05334a
          );
        border-color: rgba(0, 191, 255, .15);
      }

      .yc-bubble.reply {
        padding-top: 7px;
      }

      .yc-sender-name {
        color: #52d7ff;
        font-size: 11px;
        font-weight: 900;
        margin-bottom: 3px;
      }

      .yc-reply-preview {
        padding: 6px 8px;
        margin-bottom: 6px;
        border-left: 3px solid #00c8ff;
        border-radius: 5px;
        background: rgba(0, 0, 0, .18);
        color: #9bb8c5;
        font-size: 11px;
      }

      .yc-message-text {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-size: 14px;
        line-height: 1.45;
      }

      .yc-message-meta {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        margin-top: 3px;
        color: #7594a2;
        font-size: 9px;
      }

      .yc-check.read {
        color: #00c8ff;
      }

      .yc-reactions {
        position: absolute;
        bottom: -13px;
        left: 8px;
        display: flex;
        gap: 2px;
        z-index: 2;
      }

      .yc-reaction {
        border: 1px solid rgba(0, 191, 255, .2);
        border-radius: 20px;
        background: #06121a;
        padding: 2px 5px;
        font-size: 12px;
        cursor: pointer;
      }

      /* ========================================================
         COMPOSER
         ======================================================== */

      .yc-composer {
        padding: 10px 16px 14px;
        border-top: 1px solid rgba(0, 191, 255, .1);
        background: rgba(2, 9, 14, .95);
      }

      .yc-reply-bar {
        display: none;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        margin-bottom: 8px;
        border-left: 3px solid #00c8ff;
        background: rgba(0, 191, 255, .06);
        border-radius: 8px;
      }

      .yc-reply-bar.show {
        display: flex;
      }

      .yc-reply-content {
        flex: 1;
        min-width: 0;
      }

      .yc-reply-content strong {
        display: block;
        font-size: 10px;
        color: #4ed8ff;
      }

      .yc-reply-content span {
        display: block;
        font-size: 11px;
        color: #7895a1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .yc-composer-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }

      .yc-input-wrap {
        flex: 1;
        display: flex;
        align-items: flex-end;
        min-height: 46px;
        padding: 5px 8px;
        border-radius: 16px;
        border: 1px solid rgba(0, 191, 255, .13);
        background: #06121a;
      }

      .yc-input {
        width: 100%;
        min-height: 34px;
        max-height: 130px;
        padding: 8px;
        border: 0;
        outline: 0;
        resize: none;
        background: transparent;
        color: #fff;
        font: inherit;
        font-size: 14px;
      }

      .yc-send {
        width: 46px;
        height: 46px;
        border: 0;
        border-radius: 15px;
        background:
          linear-gradient(
            135deg,
            #00d5ff,
            #006aff
          );
        color: #001018;
        font-size: 20px;
        cursor: pointer;
        box-shadow:
          0 0 20px rgba(0, 183, 255, .22);
        transition: .18s;
      }

      .yc-send:hover {
        transform: scale(1.05);
        box-shadow:
          0 0 28px rgba(0, 183, 255, .38);
      }

      /* ========================================================
         EMOJI PANEL
         ======================================================== */

      .yc-emoji-panel {
        position: absolute;
        left: 18px;
        bottom: 78px;
        width: 310px;
        max-height: 260px;
        padding: 12px;
        border: 1px solid rgba(0, 191, 255, .18);
        border-radius: 16px;
        background: #06131c;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
        display: none;
        z-index: 20;
      }

      .yc-emoji-panel.open {
        display: block;
      }

      .yc-emojis {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 5px;
        overflow-y: auto;
        max-height: 220px;
      }

      .yc-emoji {
        border: 0;
        background: transparent;
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        font-size: 20px;
      }

      .yc-emoji:hover {
        background: rgba(0,191,255,.1);
      }

      /* ========================================================
         EMPTY STATE
         ======================================================== */

      .yc-empty {
        flex: 1;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 30px;
      }

      .yc-empty-core {
        max-width: 450px;
      }

      .yc-empty-icon {
        font-size: 70px;
        filter:
          drop-shadow(
            0 0 20px rgba(0, 200, 255, .45)
          );
      }

      .yc-empty h2 {
        margin: 10px 0;
        letter-spacing: 1px;
      }

      .yc-empty p {
        color: #66818e;
        font-size: 13px;
      }

      /* ========================================================
         PROFILE
         ======================================================== */

      .yc-profile-page {
        position: absolute;
        inset: 0;
        z-index: 100;
        background: #02080d;
        display: none;
        overflow-y: auto;
      }

      .yc-profile-page.open {
        display: block;
      }

      .yc-profile-cover {
        height: 180px;
        background:
          radial-gradient(
            circle at 50% 0,
            rgba(0, 213, 255, .4),
            transparent 50%
          ),
          linear-gradient(
            135deg,
            #03131f,
            #003d5c
          );
      }

      .yc-profile-content {
        max-width: 700px;
        margin: -55px auto 0;
        padding: 0 24px 50px;
        position: relative;
      }

      .yc-profile-avatar {
        margin-bottom: 15px;
      }

      .yc-profile-name {
        font-size: 25px;
        font-weight: 900;
      }

      .yc-profile-username {
        color: #5ec7e9;
        margin-top: 3px;
      }

      .yc-profile-bio {
        margin-top: 15px;
        color: #90aab6;
        line-height: 1.5;
      }

      .yc-profile-actions {
        display: flex;
        gap: 8px;
        margin-top: 20px;
        flex-wrap: wrap;
      }

      .yc-primary-btn,
      .yc-secondary-btn {
        border: 0;
        border-radius: 12px;
        padding: 11px 16px;
        font-weight: 800;
        cursor: pointer;
      }

      .yc-primary-btn {
        color: #00131c;
        background: linear-gradient(135deg,#00d5ff,#0075ff);
      }

      .yc-secondary-btn {
        color: #b9eaff;
        background: rgba(0,191,255,.1);
        border: 1px solid rgba(0,191,255,.15);
      }

      /* ========================================================
         STATUS
         ======================================================== */

      .yc-status-list {
        padding: 10px;
      }

      .yc-status-section {
        padding: 12px 10px;
      }

      .yc-section-label {
        color: #638592;
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 1.5px;
        font-weight: 900;
        margin-bottom: 10px;
      }

      .yc-status-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 13px;
        cursor: pointer;
      }

      .yc-status-row:hover {
        background: rgba(0,191,255,.06);
      }

      .yc-status-ring {
        padding: 3px;
        border-radius: 50%;
        background:
          linear-gradient(
            135deg,
            #00e5ff,
            #006aff
          );
      }

      .yc-status-ring > div {
        border: 3px solid #03101a;
        border-radius: 50%;
      }

      /* ========================================================
         CALLS
         ======================================================== */

      .yc-call-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 14px;
      }

      .yc-call-info {
        flex: 1;
      }

      .yc-call-meta {
        color: #68838f;
        font-size: 11px;
        margin-top: 3px;
      }

      .yc-call-icon {
        color: #00c8ff;
        font-size: 20px;
      }

      /* ========================================================
         MODAL
         ======================================================== */

      .yc-modal-layer {
        position: fixed;
        inset: 0;
        z-index: 9999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0,0,0,.7);
        backdrop-filter: blur(10px);
      }

      .yc-modal-layer.open {
        display: flex;
      }

      .yc-modal {
        width: min(500px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 20px;
        border: 1px solid rgba(0,191,255,.18);
        background: #06131c;
        box-shadow:
          0 30px 100px rgba(0,0,0,.7),
          0 0 50px rgba(0,180,255,.08);
      }

      .yc-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px;
        border-bottom: 1px solid rgba(0,191,255,.1);
      }

      .yc-modal-body {
        padding: 18px;
      }

      .yc-modal-title {
        font-weight: 900;
      }

      .yc-form-input,
      .yc-form-textarea {
        width: 100%;
        padding: 12px;
        margin-bottom: 10px;
        border: 1px solid rgba(0,191,255,.14);
        border-radius: 12px;
        outline: 0;
        background: #030c12;
        color: #fff;
        font: inherit;
      }

      .yc-form-textarea {
        min-height: 120px;
        resize: vertical;
      }

      /* ========================================================
         TOAST
         ======================================================== */

      .yc-toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translate(-50%, 20px);
        opacity: 0;
        z-index: 99999999;
        padding: 11px 16px;
        border-radius: 12px;
        background: #061923;
        border: 1px solid rgba(0,191,255,.18);
        color: #bdefff;
        box-shadow: 0 15px 50px rgba(0,0,0,.45);
        pointer-events: none;
        transition: .25s;
        font-size: 13px;
      }

      .yc-toast.show {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      /* ========================================================
         MOBILE
         ======================================================== */

      @media (max-width: 800px) {

        .yc-sidebar {
          width: 100%;
          min-width: 0;
        }

        .yc-main {
          display: none;
        }

        .yc-app.chat-open .yc-sidebar {
          display: none;
        }

        .yc-app.chat-open .yc-main {
          display: flex;
        }

        .yc-back-mobile {
          display: block !important;
        }

        .yc-messages {
          padding: 15px 10px;
        }

        .yc-bubble {
          max-width: 88%;
        }

        .yc-chat-header {
          padding-left: 8px;
        }
      }

      @media (min-width: 801px) {
        .yc-back-mobile {
          display: none !important;
        }
      }

      /* ========================================================
         LIGHTNING EFFECT
         ======================================================== */

      .yc-lightning-line {
        position: absolute;
        pointer-events: none;
        width: 2px;
        height: 100%;
        background:
          linear-gradient(
            transparent,
            rgba(0,200,255,.18),
            transparent
          );
        opacity: .25;
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     BUILD APP
     ============================================================ */

  function buildApp() {
    if ($("#yoyochat-root")) return;

    const root = document.createElement("div");

    root.id = "yoyochat-root";

    root.innerHTML = `
      <div class="yc-app">

        <aside class="yc-sidebar">

          <header class="yc-sidebar-header">

            <div class="yc-brand">
              <div class="yc-brand-icon">⚡</div>
              <span>YOYOCHAT</span>
            </div>

            <div class="yc-header-actions">
              <button
                class="yc-icon-btn"
                data-action="new-chat"
                title="New chat"
              >✎</button>

              <button
                class="yc-icon-btn"
                data-action="menu"
                title="Menu"
              >⋮</button>

              <button
                class="yc-icon-btn yc-close-btn"
                data-action="close"
                title="Close"
              >×</button>
            </div>

          </header>

          <div class="yc-search">

            <label class="yc-search-box">
              <span>⌕</span>

              <input
                id="yc-search"
                type="search"
                autocomplete="off"
                placeholder="Search chats, contacts..."
              >

            </label>

          </div>

          <nav class="yc-tabs">

            <button
              class="yc-tab active"
              data-tab="chats"
            >
              <span class="yc-tab-icon">💬</span>
              Chats
            </button>

            <button
              class="yc-tab"
              data-tab="status"
            >
              <span class="yc-tab-icon">◉</span>
              Status
            </button>

            <button
              class="yc-tab"
              data-tab="calls"
            >
              <span class="yc-tab-icon">☎</span>
              Calls
            </button>

            <button
              class="yc-tab"
              data-tab="contacts"
            >
              <span class="yc-tab-icon">♟</span>
              People
            </button>

          </nav>

          <div
            class="yc-list"
            id="yc-sidebar-list"
          ></div>

        </aside>

        <main class="yc-main">

          <div
            class="yc-empty"
            id="yc-empty"
          >
            <div class="yc-empty-core">
              <div class="yc-empty-icon">⚡</div>

              <h2>YOYOCHAT</h2>

              <p>
                Select a conversation to enter the
                lightning communication network.
              </p>
            </div>
          </div>

          <section
            class="yc-chat-view"
            id="yc-chat-view"
            style="display:none;height:100%;flex-direction:column;"
          >

            <header class="yc-chat-header">

              <button
                class="yc-icon-btn yc-back-mobile"
                data-action="back"
              >‹</button>

              <div id="yc-chat-avatar"></div>

              <div class="yc-chat-title">
                <strong id="yc-chat-name">
                  Conversation
                </strong>

                <span id="yc-chat-status">
                  offline
                </span>
              </div>

              <button
                class="yc-icon-btn"
                data-action="search-messages"
              >⌕</button>

              <button
                class="yc-icon-btn"
                data-action="video-call"
              >▣</button>

              <button
                class="yc-icon-btn"
                data-action="voice-call"
              >☎</button>

              <button
                class="yc-icon-btn"
                data-action="chat-menu"
              >⋮</button>

            </header>

            <div
              class="yc-messages"
              id="yc-messages"
            ></div>

            <div
              class="yc-composer"
              id="yc-composer"
            >

              <div
                class="yc-reply-bar"
                id="yc-reply-bar"
              >

                <div class="yc-reply-content">
                  <strong>Replying to</strong>
                  <span id="yc-reply-text"></span>
                </div>

                <button
                  class="yc-icon-btn"
                  data-action="cancel-reply"
                >×</button>

              </div>

              <div
                class="yc-emoji-panel"
                id="yc-emoji-panel"
              >
                <div
                  class="yc-emojis"
                  id="yc-emojis"
                ></div>
              </div>

              <div class="yc-composer-row">

                <button
                  class="yc-icon-btn"
                  data-action="emoji"
                >☺</button>

                <button
                  class="yc-icon-btn"
                  data-action="attachment"
                >＋</button>

                <div class="yc-input-wrap">

                  <textarea
                    class="yc-input"
                    id="yc-message-input"
                    rows="1"
                    maxlength="${APP.maxMessageLength}"
                    placeholder="Type a message..."
                  ></textarea>

                </div>

                <button
                  class="yc-send"
                  data-action="send"
                  title="Send"
                >➤</button>

              </div>

            </div>

          </section>

          <section
            class="yc-profile-page"
            id="yc-profile-page"
          ></section>

        </main>

      </div>

      <div
        class="yc-modal-layer"
        id="yc-modal-layer"
      >
        <div
          class="yc-modal"
          id="yc-modal"
        ></div>
      </div>

      <div
        class="yc-toast"
        id="yc-toast"
      ></div>
    `;

    document.body.appendChild(root);

    buildEmojiPicker();
    bindEvents();
    render();
  }

  /* ============================================================
     EMOJIS
     ============================================================ */

  function buildEmojiPicker() {
    const emojis = [
      "😀","😃","😄","😁","😆","😅","😂","🤣",
      "😊","😎","😍","🥰","😘","🤩","🤔","🤨",
      "😮","😱","😭","😡","🤯","🥳","😴","🤖",
      "👀","🙌","👏","👍","👎","❤️","💙","💚",
      "💜","🖤","🔥","⚡","✨","💯","🚀","🎮",
      "🎯","🏆","💎","🛡️","🔒","💻","🌎","☀️",
      "🌙","🍕","🎵","📸","🎉","✅","❌","❗"
    ];

    const container = $("#yc-emojis");

    if (!container) return;

    container.innerHTML = emojis
      .map(
        emoji => `
          <button
            class="yc-emoji"
            data-emoji="${emoji}"
          >
            ${emoji}
          </button>
        `
      )
      .join("");
  }

  /* ============================================================
     EVENT BINDING
     ============================================================ */

  function bindEvents() {

    document.addEventListener("click", event => {

      const actionElement =
        event.target.closest("[data-action]");

      if (actionElement) {
        handleAction(
          actionElement.dataset.action,
          actionElement
        );
      }

      const tab =
        event.target.closest("[data-tab]");

      if (tab) {
        setTab(tab.dataset.tab);
      }

      const chat =
        event.target.closest("[data-chat-id]");

      if (chat) {
        openChat(chat.dataset.chatId);
      }

      const contact =
        event.target.closest("[data-contact-id]");

      if (contact) {
        openContactProfile(contact.dataset.contactId);
      }

      const message =
        event.target.closest("[data-message-id]");

      if (
        message &&
        !event.target.closest("[data-reaction]")
      ) {
        handleMessageClick(
          message.dataset.messageId
        );
      }

      const reaction =
        event.target.closest("[data-reaction]");

      if (reaction) {
        reactToMessage(
          reaction.dataset.messageId,
          reaction.dataset.reaction
        );
      }

      const emoji =
        event.target.closest("[data-emoji]");

      if (emoji) {
        insertEmoji(emoji.dataset.emoji);
      }
    });

    const search = $("#yc-search");

    if (search) {
      search.addEventListener("input", event => {
        state.search = event.target.value.trim().toLowerCase();
        renderSidebar();
      });
    }

    const input = $("#yc-message-input");

    if (input) {

      input.addEventListener("keydown", event => {

        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          db.settings.enterToSend
        ) {
          event.preventDefault();
          sendMessage();
        }

      });

      input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height =
          Math.min(input.scrollHeight, 130) + "px";
      });
    }

    const modalLayer = $("#yc-modal-layer");

    if (modalLayer) {
      modalLayer.addEventListener("click", event => {
        if (event.target === modalLayer) {
          closeModal();
        }
      });
    }
  }

  /* ============================================================
     ACTION ROUTER
     ============================================================ */

  function handleAction(action, element) {

    switch (action) {

      case "close":
        close();
        break;

      case "back":
        closeActiveChat();
        break;

      case "send":
        sendMessage();
        break;

      case "emoji":
        toggleEmoji();
        break;

      case "attachment":
        showAttachmentMenu();
        break;

      case "cancel-reply":
        cancelReply();
        break;

      case "new-chat":
        showNewChat();
        break;

      case "menu":
        showMainMenu();
        break;

      case "chat-menu":
        showChatMenu();
        break;

      case "search-messages":
        searchMessages();
        break;

      case "voice-call":
        startCall("voice");
        break;

      case "video-call":
        startCall("video");
        break;
    }
  }

  /* ============================================================
     OPEN / CLOSE
     ============================================================ */

  function open() {
    injectStyles();
    buildApp();

    $("#yoyochat-root").classList.add("open");

    state.open = true;

    render();
  }

  function close() {
    const root = $("#yoyochat-root");

    if (!root) return;

    root.classList.remove("open");

    state.open = false;
  }

  function closeActiveChat() {
    state.activeChat = null;

    $(".yc-app")?.classList.remove("chat-open");

    render();
  }

  /* ============================================================
     RENDER
     ============================================================ */

  function render() {
    renderSidebar();
    renderActiveChat();
  }

  function renderSidebar() {

    const list = $("#yc-sidebar-list");

    if (!list) return;

    switch (state.tab) {

      case "chats":
        renderChats(list);
        break;

      case "status":
        renderStatus(list);
        break;

      case "calls":
        renderCalls(list);
        break;

      case "contacts":
        renderContacts(list);
        break;
    }
  }

  /* ============================================================
     CHAT LIST
     ============================================================ */

  function renderChats(container) {

    let chats = [...db.chats];

    chats.sort((a, b) => {

      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      const aLast =
        a.messages[a.messages.length - 1]?.timestamp || 0;

      const bLast =
        b.messages[b.messages.length - 1]?.timestamp || 0;

      return bLast - aLast;
    });

    if (state.search) {
      chats = chats.filter(chat => {

        const user = getUser(chat.userId);

        const last =
          chat.messages.at(-1)?.text || "";

        return (
          user?.name
            ?.toLowerCase()
            .includes(state.search) ||
          last
            .toLowerCase()
            .includes(state.search)
        );
      });
    }

    if (!chats.length) {
      container.innerHTML = `
        <div class="yc-empty">
          <div>
            <div class="yc-empty-icon">⌕</div>
            <p>No conversations found.</p>
          </div>
        </div>
      `;

      return;
    }

    container.innerHTML = chats.map(chat => {

      const user = getUser(chat.userId);

      const last = chat.messages.at(-1);

      return `
        <button
          class="yc-chat-row ${
            state.activeChat === chat.id ? "active" : ""
          }"
          data-chat-id="${chat.id}"
        >

          ${avatar(user)}

          <div class="yc-chat-info">

            <div class="yc-chat-top">

              <span class="yc-chat-name">
                ${escapeHTML(user?.name || "Unknown")}
              </span>

              <span class="yc-chat-time">
                ${
                  last
                    ? formatTime(last.timestamp)
                    : ""
                }
              </span>

            </div>

            <div class="yc-chat-bottom">

              <span class="yc-last-message">
                ${
                  last
                    ? escapeHTML(last.text || "Attachment")
                    : "No messages"
                }
              </span>

              ${
                chat.unread
                  ? `
                    <span class="yc-unread">
                      ${chat.unread}
                    </span>
                  `
                  : ""
              }

            </div>

          </div>

        </button>
      `;
    }).join("");

    renderGroupsAfterChats(container);
  }

  function renderGroupsAfterChats(container) {

    if (!db.groups.length) return;

    const title = document.createElement("div");

    title.className = "yc-section-label";

    title.style.margin =
      "14px 10px 5px";

    title.textContent = "GROUPS";

    container.prepend(title);

    db.groups.forEach(group => {

      const last = group.messages.at(-1);

      const button = document.createElement("button");

      button.className = "yc-chat-row";

      button.dataset.chatId = group.id;

      button.innerHTML = `

        <div
          class="yc-avatar yc-avatar-fallback"
          style="--avatar-hue:190"
        >
          ⚡
        </div>

        <div class="yc-chat-info">

          <div class="yc-chat-top">

            <span class="yc-chat-name">
              ${escapeHTML(group.name)}
            </span>

            <span class="yc-chat-time">
              ${
                last
                  ? formatTime(last.timestamp)
                  : ""
              }
            </span>

          </div>

          <div class="yc-chat-bottom">

            <span class="yc-last-message">
              ${
                last
                  ? escapeHTML(last.text)
                  : "No messages"
              }
            </span>

            ${
              group.unread
                ? `
                  <span class="yc-unread">
                    ${group.unread}
                  </span>
                `
                : ""
            }

          </div>

        </div>
      `;

      container.appendChild(button);
    });
  }

  /* ============================================================
     STATUS
     ============================================================ */

  function renderStatus(container) {

    container.innerHTML = `

      <div class="yc-status-section">

        <div class="yc-section-label">
          YOUR STATUS
        </div>

        <div
          class="yc-status-row"
          data-action="my-status"
        >

          ${avatar(db.user, "small")}

          <div class="yc-chat-info">

            <div class="yc-chat-name">
              My status
            </div>

            <div class="yc-last-message">
              Tap to add status update
            </div>

          </div>

          <button
            class="yc-primary-btn"
            data-action="create-status"
          >
            +
          </button>

        </div>

      </div>

      <div class="yc-status-section">

        <div class="yc-section-label">
          RECENT UPDATES
        </div>

        ${
          db.statuses.length
            ? db.statuses
                .filter(status =>
                  now() - status.timestamp <
                  86400000
                )
                .map(status => {

                  const user =
                    getUser(status.userId);

                  return `
                    <div
                      class="yc-status-row"
                      data-status-id="${status.id}"
                    >

                      <div class="yc-status-ring">
                        ${avatar(user, "small")}
                      </div>

                      <div class="yc-chat-info">

                        <div class="yc-chat-name">
                          ${escapeHTML(user?.name || "User")}
                        </div>

                        <div class="yc-last-message">
                          ${relativeTime(status.timestamp)}
                        </div>

                      </div>

                    </div>
                  `;
                })
                .join("")
            : `
              <div class="yc-empty">
                <div>
                  <div class="yc-empty-icon">◉</div>
                  <p>No recent updates.</p>
                </div>
              </div>
            `
        }

      </div>
    `;
  }

  /* ============================================================
     CALLS
     ============================================================ */

  function renderCalls(container) {

    if (!db.calls.length) {

      container.innerHTML = `
        <div class="yc-empty">
          <div>
            <div class="yc-empty-icon">☎</div>
            <h2>No calls yet</h2>
            <p>
              Your recent calls will appear here.
            </p>
          </div>
        </div>
      `;

      return;
    }

    container.innerHTML = db.calls
      .slice()
      .reverse()
      .map(call => {

        const user = getUser(call.userId);

        return `
          <div class="yc-call-row">

            ${avatar(user)}

            <div class="yc-call-info">

              <div class="yc-chat-name">
                ${escapeHTML(user?.name || "Unknown")}
              </div>

              <div class="yc-call-meta">
                ${call.type === "video" ? "▣" : "☎"}
                ${call.direction}
                · ${relativeTime(call.timestamp)}
              </div>

            </div>

            <span class="yc-call-icon">
              ${call.type === "video" ? "▣" : "☎"}
            </span>

          </div>
        `;
      })
      .join("");
  }

  /* ============================================================
     CONTACTS
     ============================================================ */

  function renderContacts(container) {

    const contacts = [...db.contacts];

    if (state.search) {

      const query = state.search;

      contacts.splice(
        0,
        contacts.length,
        ...db.contacts.filter(user =>
          user.name
            .toLowerCase()
            .includes(query) ||
          user.username
            .toLowerCase()
            .includes(query)
        )
      );
    }

    container.innerHTML = `

      <div class="yc-status-section">

        <div class="yc-section-label">
          CONTACTS
        </div>

        ${
          contacts
            .map(user => `
              <button
                class="yc-chat-row"
                data-contact-id="${user.id}"
              >

                ${avatar(user)}

                <div class="yc-chat-info">

                  <div class="yc-chat-name">
                    ${escapeHTML(user.name)}
                  </div>

                  <div class="yc-last-message">
                    ${escapeHTML(user.about || "")}
                  </div>

                </div>

                <span>
                  ${user.online ? "●" : ""}
                </span>

              </button>
            `)
            .join("")
        }

      </div>

      <div class="yc-status-section">

        <button
          class="yc-primary-btn"
          data-action="new-group"
        >
          + New group
        </button>

      </div>
    `;
  }

  /* ============================================================
     ACTIVE CHAT
     ============================================================ */

  function renderActiveChat() {

    const empty = $("#yc-empty");
    const chatView = $("#yc-chat-view");

    if (!empty || !chatView) return;

    if (!state.activeChat) {

      empty.style.display = "grid";
      chatView.style.display = "none";

      return;
    }

    empty.style.display = "none";
    chatView.style.display = "flex";

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) {
      state.activeChat = null;
      return;
    }

    $(".yc-app")?.classList.add("chat-open");

    const isGroup =
      chat.type === "group";

    const user =
      !isGroup
        ? getUser(chat.userId)
        : null;

    $("#yc-chat-avatar").innerHTML =
      isGroup
        ? `
          <div
            class="yc-avatar yc-avatar-fallback"
            style="--avatar-hue:190"
          >
            ⚡
          </div>
        `
        : avatar(user, "small");

    $("#yc-chat-name").textContent =
      isGroup
        ? chat.name
        : user?.name || "Unknown";

    $("#yc-chat-status").textContent =
      isGroup
        ? `${chat.members.length} members`
        : user?.online
          ? "online"
          : `last seen ${relativeTime(
              user?.lastSeen || now()
            )}`;

    renderMessages(chat, isGroup);

    chat.unread = 0;

    saveDatabase();
  }

  /* ============================================================
     MESSAGES
     ============================================================ */

  function renderMessages(chat, isGroup) {

    const container = $("#yc-messages");

    if (!container) return;

    let lastDay = "";

    container.innerHTML = chat.messages
      .map(message => {

        const day =
          formatDate(message.timestamp);

        let divider = "";

        if (day !== lastDay) {
          divider = `
            <div class="yc-day-divider">
              ${day}
            </div>
          `;

          lastDay = day;
        }

        const mine =
          message.sender === APP.currentUserId;

        const sender =
          isGroup && !mine
            ? getUser(message.sender)
            : null;

        const reactions =
          message.reactions || [];

        return `
          ${divider}

          <div
            class="yc-message-line ${
              mine ? "mine" : ""
            }"
          >

            <div
              class="yc-bubble ${
                message.replyTo
                  ? "reply"
                  : ""
              }"
              data-message-id="${message.id}"
            >

              ${
                sender
                  ? `
                    <div class="yc-sender-name">
                      ${escapeHTML(sender.name)}
                    </div>
                  `
                  : ""
              }

              ${
                message.replyTo
                  ? `
                    <div class="yc-reply-preview">
                      ${escapeHTML(
                        message.replyTo.text || ""
                      )}
                    </div>
                  `
                  : ""
              }

              <div class="yc-message-text">
                ${escapeHTML(message.text || "")}
              </div>

              <div class="yc-message-meta">

                <span>
                  ${formatTime(message.timestamp)}
                </span>

                ${
                  mine
                    ? `
                      <span
                        class="yc-check ${
                          message.status === "read"
                            ? "read"
                            : ""
                        }"
                      >
                        ${
                          message.status === "read"
                            ? "✓✓"
                            : message.status === "delivered"
                              ? "✓✓"
                              : "✓"
                        }
                      </span>
                    `
                    : ""
                }

              </div>

              ${
                reactions.length
                  ? `
                    <div class="yc-reactions">

                      ${reactions
                        .slice(0, 4)
                        .map(r => `
                          <button
                            class="yc-reaction"
                            data-reaction="${r.emoji}"
                            data-message-id="${message.id}"
                          >
                            ${r.emoji}
                          </button>
                        `)
                        .join("")}

                    </div>
                  `
                  : ""
              }

            </div>

          </div>
        `;
      })
      .join("");

    requestAnimationFrame(() => {
      container.scrollTop =
        container.scrollHeight;
    });
  }

  /* ============================================================
     OPEN CHAT
     ============================================================ */

  function openChat(chatId) {

    const chat =
      getChat(chatId) ||
      getGroup(chatId);

    if (!chat) return;

    state.activeChat = chatId;
    state.tab = "chats";
    state.replyTo = null;

    cancelReply();

    $(".yc-app")?.classList.add("chat-open");

    render();

    setTimeout(() => {
      $("#yc-message-input")?.focus();
    }, 100);
  }

  /* ============================================================
     SEND MESSAGE
     ============================================================ */

  function sendMessage() {

    if (!state.activeChat) {
      toast("Select a chat first.");
      return;
    }

    const input =
      $("#yc-message-input");

    if (!input) return;

    const text =
      input.value.trim();

    if (!text) return;

    if (text.length > APP.maxMessageLength) {
      toast("Message is too long.");
      return;
    }

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) return;

    const message = {
      id: uid("msg"),
      sender: APP.currentUserId,
      text,
      timestamp: now(),
      status: "sent",
      reactions: []
    };

    if (state.replyTo) {
      message.replyTo = {
        id: state.replyTo.id,
        text: state.replyTo.text
      };
    }

    chat.messages.push(message);

    input.value = "";
    input.style.height = "auto";

    cancelReply();

    saveDatabase();

    renderActiveChat();
    renderSidebar();

    simulateDelivery(message.id);

    playSound();

    /*
      Demo auto-reply:
      Only activates for the sample chats.
    */

    simulateReply(chat);
  }

  /* ============================================================
     DELIVERY
     ============================================================ */

  function simulateDelivery(messageId) {

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) return;

    const message =
      chat.messages.find(
        m => m.id === messageId
      );

    if (!message) return;

    setTimeout(() => {

      message.status = "delivered";

      saveDatabase();
      renderActiveChat();

    }, 500);

    setTimeout(() => {

      message.status = "read";

      saveDatabase();
      renderActiveChat();

    }, 1200);
  }

  /* ============================================================
     DEMO REPLIES
     ============================================================ */

  function simulateReply(chat) {

    if (
      chat.type !== "private" ||
      !["chat_alex", "chat_max", "chat_nora"]
        .includes(chat.id)
    ) {
      return;
    }

    const replies = [
      "⚡ That's awesome.",
      "Got it!",
      "No way 😂",
      "Let's do it.",
      "🔥",
      "I'm on it.",
      "That looks insane.",
      "Absolutely.",
      "LOL 😂",
      "⚡ SYSTEM ONLINE"
    ];

    const selected =
      replies[
        Math.floor(
          Math.random() * replies.length
        )
      ];

    setTimeout(() => {

      const message = {
        id: uid("msg"),
        sender: chat.userId,
        text: selected,
        timestamp: now(),
        status: "delivered",
        reactions: []
      };

      chat.messages.push(message);

      if (state.activeChat !== chat.id) {
        chat.unread =
          (chat.unread || 0) + 1;
      }

      saveDatabase();

      render();

      if (state.activeChat === chat.id) {
        playSound();
      }

    }, 1400);
  }

  /* ============================================================
     MESSAGE MENU
     ============================================================ */

  function handleMessageClick(messageId) {

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) return;

    const message =
      chat.messages.find(
        m => m.id === messageId
      );

    if (!message) return;

    state.selectedMessage = message;

    showMessageMenu(message);
  }

  function showMessageMenu(message) {

    openModal(`
      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Message
        </div>

        <button
          class="yc-icon-btn"
          data-action="close-modal"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.reply()"
        >
          ↩ Reply
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.copyMessage()"
        >
          ▣ Copy
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.forwardMessage()"
        >
          ➜ Forward
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.reactQuick()"
        >
          ❤️ React
        </button>

        ${
          message.sender === APP.currentUserId
            ? `
              <button
                class="yc-secondary-btn"
                style="width:100%;margin-bottom:8px"
                onclick="window.YOYOCHAT.deleteMessage()"
              >
                🗑 Delete
              </button>
            `
            : ""
        }

      </div>
    `);
  }

  /* ============================================================
     REPLY
     ============================================================ */

  function replyToSelected() {

    if (!state.selectedMessage) return;

    state.replyTo =
      state.selectedMessage;

    $("#yc-reply-text").textContent =
      state.replyTo.text;

    $("#yc-reply-bar")
      .classList.add("show");

    closeModal();

    $("#yc-message-input")?.focus();
  }

  function cancelReply() {

    state.replyTo = null;

    $("#yc-reply-bar")
      ?.classList.remove("show");
  }

  /* ============================================================
     REACTIONS
     ============================================================ */

  function reactToMessage(messageId, emoji) {

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) return;

    const message =
      chat.messages.find(
        m => m.id === messageId
      );

    if (!message) return;

    message.reactions ||= [];

    const existing =
      message.reactions.find(
        r =>
          r.userId ===
          APP.currentUserId
      );

    if (existing) {
      existing.emoji = emoji;
    } else {
      message.reactions.push({
        userId: APP.currentUserId,
        emoji
      });
    }

    saveDatabase();

    renderActiveChat();
  }

  function quickReact() {

    if (!state.selectedMessage) return;

    reactToMessage(
      state.selectedMessage.id,
      "❤️"
    );

    closeModal();
  }

  /* ============================================================
     EMOJI
     ============================================================ */

  function toggleEmoji() {

    const panel =
      $("#yc-emoji-panel");

    if (!panel) return;

    panel.classList.toggle("open");
  }

  function insertEmoji(emoji) {

    const input =
      $("#yc-message-input");

    if (!input) return;

    const start =
      input.selectionStart;

    const end =
      input.selectionEnd;

    input.value =
      input.value.slice(0, start) +
      emoji +
      input.value.slice(end);

    input.focus();

    input.selectionStart =
      input.selectionEnd =
        start + emoji.length;
  }

  /* ============================================================
     NEW CHAT
     ============================================================ */

  function showNewChat() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          New chat
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <input
          class="yc-form-input"
          id="yc-contact-search"
          placeholder="Search contacts..."
        >

        <div id="yc-new-chat-list">

          ${db.contacts
            .map(user => `
              <button
                class="yc-chat-row"
                style="width:100%"
                onclick="
                  window.YOYOCHAT.startChat('${user.id}')
                "
              >

                ${avatar(user)}

                <div class="yc-chat-info">

                  <div class="yc-chat-name">
                    ${escapeHTML(user.name)}
                  </div>

                  <div class="yc-last-message">
                    ${escapeHTML(user.username)}
                  </div>

                </div>

              </button>
            `)
            .join("")}

        </div>

      </div>
    `);
  }

  function startChat(userId) {

    let chat =
      db.chats.find(
        c => c.userId === userId
      );

    if (!chat) {

      chat = {
        id: uid("chat"),
        type: "private",
        userId,
        pinned: false,
        muted: false,
        unread: 0,
        messages: []
      };

      db.chats.push(chat);

      saveDatabase();
    }

    closeModal();

    openChat(chat.id);
  }

  /* ============================================================
     ATTACHMENTS
     ============================================================ */

  function showAttachmentMenu() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Attach
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <div style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:10px;
        ">

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('photo')"
          >
            📷 Photo
          </button>

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('camera')"
          >
            📸 Camera
          </button>

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('document')"
          >
            📄 Document
          </button>

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('location')"
          >
            📍 Location
          </button>

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('contact')"
          >
            👤 Contact
          </button>

          <button
            class="yc-secondary-btn"
            onclick="window.YOYOCHAT.attachment('poll')"
          >
            📊 Poll
          </button>

        </div>

      </div>
    `);
  }

  function attachment(type) {

    closeModal();

    if (type === "photo") {

      const input =
        document.createElement("input");

      input.type = "file";
      input.accept = "image/*";

      input.onchange = () => {

        const file = input.files?.[0];

        if (!file) return;

        toast(
          `Selected ${file.name}`
        );

        /*
          Static GitHub version:
          selected files are not uploaded to a server.
        */

      };

      input.click();

      return;
    }

    const labels = {
      camera: "Camera",
      document: "Document",
      location: "Location",
      contact: "Contact",
      poll: "Poll"
    };

    toast(
      `${labels[type]} attachment selected`
    );
  }

  /* ============================================================
     PROFILE
     ============================================================ */

  function openContactProfile(userId) {

    const user = getUser(userId);

    if (!user) return;

    state.profileUser = userId;

    const page =
      $("#yc-profile-page");

    page.innerHTML = `

      <div class="yc-profile-cover"></div>

      <div class="yc-profile-content">

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeProfile()"
          style="
            position:absolute;
            right:20px;
            top:-150px;
          "
        >
          ×
        </button>

        <div class="yc-profile-avatar">
          ${avatar(user, "large")}
        </div>

        <div class="yc-profile-name">
          ${escapeHTML(user.name)}
        </div>

        <div class="yc-profile-username">
          ${escapeHTML(user.username)}
        </div>

        <div class="yc-profile-bio">
          ${escapeHTML(user.about || "")}
        </div>

        <div class="yc-profile-actions">

          <button
            class="yc-primary-btn"
            onclick="
              window.YOYOCHAT.messageUser('${user.id}')
            "
          >
            💬 Message
          </button>

          <button
            class="yc-secondary-btn"
            onclick="
              window.YOYOCHAT.callUser(
                '${user.id}',
                'voice'
              )
            "
          >
            ☎ Call
          </button>

          <button
            class="yc-secondary-btn"
            onclick="
              window.YOYOCHAT.callUser(
                '${user.id}',
                'video'
              )
            "
          >
            ▣ Video
          </button>

        </div>

        <div style="
          margin-top:30px;
          padding:18px;
          border-radius:16px;
          background:rgba(0,191,255,.05);
          border:1px solid rgba(0,191,255,.1);
        ">

          <div class="yc-section-label">
            CONTACT INFO
          </div>

          <div style="margin-top:12px">
            <strong>Username</strong>
            <div style="color:#6f8d99">
              ${escapeHTML(user.username)}
            </div>
          </div>

          <div style="margin-top:15px">
            <strong>Status</strong>
            <div style="color:#6f8d99">
              ${user.online ? "Online" : "Offline"}
            </div>
          </div>

        </div>

      </div>
    `;

    page.classList.add("open");
  }

  function closeProfile() {
    $("#yc-profile-page")
      ?.classList.remove("open");
  }

  function messageUser(userId) {

    closeProfile();

    startChat(userId);
  }

  /* ============================================================
     STATUS CREATION
     ============================================================ */

  function createStatus() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          New status
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <textarea
          class="yc-form-textarea"
          id="yc-status-text"
          maxlength="700"
          placeholder="What's happening?"
        ></textarea>

        <button
          class="yc-primary-btn"
          style="width:100%"
          onclick="window.YOYOCHAT.publishStatus()"
        >
          Publish status ⚡
        </button>

      </div>
    `);
  }

  function publishStatus() {

    const text =
      $("#yc-status-text")
        ?.value
        .trim();

    if (!text) {
      toast("Write something first.");
      return;
    }

    db.statuses.push({
      id: uid("status"),
      userId: APP.currentUserId,
      text,
      timestamp: now(),
      seen: false
    });

    saveDatabase();

    closeModal();

    state.tab = "status";

    render();

    toast("Status published ⚡");
  }

  /* ============================================================
     CALL SYSTEM
     ============================================================ */

  function startCall(type) {

    if (!state.activeChat) {
      toast("Open a chat first.");
      return;
    }

    const chat =
      getChat(state.activeChat);

    if (!chat) return;

    callUser(chat.userId, type);
  }

  function callUser(userId, type) {

    const user = getUser(userId);

    if (!user) return;

    db.calls.push({
      id: uid("call"),
      userId,
      type,
      direction: "outgoing",
      timestamp: now(),
      status: "completed"
    });

    saveDatabase();

    openModal(`

      <div class="yc-modal-body"
        style="text-align:center;padding:35px">

        ${avatar(user, "large")}

        <h2 style="margin-top:15px">
          ${escapeHTML(user.name)}
        </h2>

        <p style="color:#6e8b98">
          ${
            type === "video"
              ? "▣ Video calling"
              : "☎ Calling"
          }
        </p>

        <button
          class="yc-primary-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          End call
        </button>

      </div>
    `);

    setTimeout(() => {

      if ($("#yc-modal-layer")?.classList.contains("open")) {
        toast("Call ended.");
      }

    }, 4000);
  }

  /* ============================================================
     SEARCH MESSAGES
     ============================================================ */

  function searchMessages() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Search messages
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <input
          class="yc-form-input"
          id="yc-message-search"
          placeholder="Search in this chat..."
        >

        <div id="yc-message-results"></div>

      </div>
    `);

    const input =
      $("#yc-message-search");

    input?.addEventListener(
      "input",
      () => {

        const query =
          input.value
            .trim()
            .toLowerCase();

        const chat =
          getChat(state.activeChat) ||
          getGroup(state.activeChat);

        const results =
          chat?.messages.filter(message =>
            message.text
              .toLowerCase()
              .includes(query)
          ) || [];

        $("#yc-message-results").innerHTML =
          results
            .map(message => `
              <div style="
                padding:10px;
                border-bottom:1px solid rgba(0,191,255,.08)
              ">
                <div style="font-size:13px">
                  ${escapeHTML(message.text)}
                </div>

                <div style="
                  color:#638592;
                  font-size:10px;
                  margin-top:4px
                ">
                  ${formatDate(message.timestamp)}
                  ·
                  ${formatTime(message.timestamp)}
                </div>
              </div>
            `)
            .join("");
      }
    );
  }

  /* ============================================================
     GROUP CREATION
     ============================================================ */

  function createGroup() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Create group
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <input
          class="yc-form-input"
          id="yc-group-name"
          placeholder="Group name"
          maxlength="80"
        >

        <textarea
          class="yc-form-textarea"
          id="yc-group-description"
          placeholder="Group description"
        ></textarea>

        <button
          class="yc-primary-btn"
          style="width:100%"
          onclick="window.YOYOCHAT.publishGroup()"
        >
          Create group
        </button>

      </div>
    `);
  }

  function publishGroup() {

    const name =
      $("#yc-group-name")
        ?.value
        .trim();

    const description =
      $("#yc-group-description")
        ?.value
        .trim();

    if (!name) {
      toast("Enter a group name.");
      return;
    }

    const group = {
      id: uid("group"),
      type: "group",
      name,
      description,
      avatar: "",
      members: ["me"],
      admins: ["me"],
      unread: 0,
      messages: []
    };

    db.groups.push(group);

    saveDatabase();

    closeModal();

    render();

    toast("Group created ⚡");
  }

  /* ============================================================
     MAIN MENU
     ============================================================ */

  function showMainMenu() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          YOYOCHAT
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.openMyProfile()"
        >
          👤 Profile
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.settings()"
        >
          ⚙ Settings
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.notifications()"
        >
          🔔 Notifications
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.clearChats()"
        >
          🗑 Clear local chats
        </button>

      </div>
    `);
  }

  /* ============================================================
     CHAT MENU
     ============================================================ */

  function showChatMenu() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Chat options
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.togglePin()"
        >
          📌 Pin / unpin
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.toggleMute()"
        >
          🔕 Mute / unmute
        </button>

        <button
          class="yc-secondary-btn"
          style="width:100%;margin-bottom:8px"
          onclick="window.YOYOCHAT.clearCurrentChat()"
        >
          🗑 Clear messages
        </button>

      </div>
    `);
  }

  function togglePin() {

    const chat =
      getChat(state.activeChat);

    if (!chat) return;

    chat.pinned = !chat.pinned;

    saveDatabase();

    closeModal();

    render();

    toast(
      chat.pinned
        ? "Chat pinned."
        : "Chat unpinned."
    );
  }

  function toggleMute() {

    const chat =
      getChat(state.activeChat);

    if (!chat) return;

    chat.muted = !chat.muted;

    saveDatabase();

    closeModal();

    toast(
      chat.muted
        ? "Chat muted."
        : "Chat unmuted."
    );
  }

  function clearCurrentChat() {

    const chat =
      getChat(state.activeChat);

    if (!chat) return;

    chat.messages = [];

    saveDatabase();

    closeModal();

    renderActiveChat();
    renderSidebar();

    toast("Messages cleared.");
  }

  function clearChats() {

    db.chats.forEach(chat => {
      chat.messages = [];
      chat.unread = 0;
    });

    saveDatabase();

    closeModal();

    render();

    toast("Local chat history cleared.");
  }

  /* ============================================================
     PROFILE
     ============================================================ */

  function openMyProfile() {

    closeModal();

    const user = db.user;

    const page =
      $("#yc-profile-page");

    page.innerHTML = `

      <div class="yc-profile-cover"></div>

      <div class="yc-profile-content">

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeProfile()"
          style="
            position:absolute;
            right:20px;
            top:-150px;
          "
        >
          ×
        </button>

        <div class="yc-profile-avatar">
          ${avatar(user, "large")}
        </div>

        <div class="yc-profile-name">
          ${escapeHTML(user.name)}
        </div>

        <div class="yc-profile-username">
          ${escapeHTML(user.username)}
        </div>

        <div class="yc-profile-bio">
          ${escapeHTML(user.bio)}
        </div>

        <div class="yc-profile-actions">

          <button
            class="yc-primary-btn"
            onclick="window.YOYOCHAT.editProfile()"
          >
            Edit profile
          </button>

        </div>

      </div>
    `;

    page.classList.add("open");
  }

  function editProfile() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Edit profile
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <input
          class="yc-form-input"
          id="yc-profile-name-input"
          value="${escapeHTML(db.user.name)}"
          placeholder="Name"
        >

        <input
          class="yc-form-input"
          id="yc-profile-username-input"
          value="${escapeHTML(db.user.username)}"
          placeholder="@username"
        >

        <textarea
          class="yc-form-textarea"
          id="yc-profile-bio-input"
          placeholder="Bio"
        >${escapeHTML(db.user.bio)}</textarea>

        <button
          class="yc-primary-btn"
          style="width:100%"
          onclick="window.YOYOCHAT.saveProfile()"
        >
          Save profile
        </button>

      </div>
    `);
  }

  function saveProfile() {

    const name =
      $("#yc-profile-name-input")
        ?.value
        .trim();

    const username =
      $("#yc-profile-username-input")
        ?.value
        .trim();

    const bio =
      $("#yc-profile-bio-input")
        ?.value
        .trim();

    if (name) db.user.name = name;
    if (username) db.user.username = username;

    db.user.bio = bio;

    saveDatabase();

    closeModal();

    openMyProfile();

    render();

    toast("Profile updated ⚡");
  }

  /* ============================================================
     SETTINGS
     ============================================================ */

  function settings() {

    closeModal();

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Settings
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        ${settingToggle(
          "notifications",
          "Notifications",
          "Show message notifications"
        )}

        ${settingToggle(
          "sounds",
          "Message sounds",
          "Play message sounds"
        )}

        ${settingToggle(
          "enterToSend",
          "Enter to send",
          "Press Enter to send messages"
        )}

        ${settingToggle(
          "readReceipts",
          "Read receipts",
          "Show message read status"
        )}

        ${settingToggle(
          "onlineStatus",
          "Online status",
          "Show when you are online"
        )}

        ${settingToggle(
          "lastSeen",
          "Last seen",
          "Show your last seen time"
        )}

      </div>
    `);

    $$(".yc-setting-toggle").forEach(toggle => {

      toggle.addEventListener(
        "change",
        () => {

          const key =
            toggle.dataset.setting;

          db.settings[key] =
            toggle.checked;

          saveDatabase();

          toast("Setting updated.");
        }
      );

    });
  }

  function settingToggle(
    key,
    title,
    description
  ) {

    return `

      <label style="
        display:flex;
        align-items:center;
        gap:12px;
        padding:13px 0;
        border-bottom:1px solid rgba(0,191,255,.07);
        cursor:pointer;
      ">

        <input
          type="checkbox"
          class="yc-setting-toggle"
          data-setting="${key}"
          ${
            db.settings[key]
              ? "checked"
              : ""
          }
        >

        <span>

          <strong>
            ${title}
          </strong>

          <small style="
            display:block;
            color:#68838f;
            margin-top:3px
          ">
            ${description}
          </small>

        </span>

      </label>
    `;
  }

  /* ============================================================
     NOTIFICATIONS
     ============================================================ */

  function notifications() {

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Notifications
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        ${
          db.notifications.length
            ? db.notifications
                .slice()
                .reverse()
                .map(n => `
                  <div style="
                    padding:12px 0;
                    border-bottom:1px solid rgba(0,191,255,.08)
                  ">
                    ${escapeHTML(n.text)}

                    <small style="
                      display:block;
                      color:#607d8a;
                      margin-top:4px
                    ">
                      ${relativeTime(n.timestamp)}
                    </small>
                  </div>
                `)
                .join("")
            : `
              <div style="
                text-align:center;
                color:#66818e;
                padding:30px
              ">
                No notifications.
              </div>
            `
        }

      </div>
    `);
  }

  /* ============================================================
     MODALS
     ============================================================ */

  function openModal(html) {

    const layer =
      $("#yc-modal-layer");

    const modal =
      $("#yc-modal");

    if (!layer || !modal) return;

    modal.innerHTML = html;

    layer.classList.add("open");
  }

  function closeModal() {

    $("#yc-modal-layer")
      ?.classList.remove("open");
  }

  /* ============================================================
     TOAST
     ============================================================ */

  let toastTimer;

  function toast(message) {

    const element =
      $("#yc-toast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      element.classList.remove("show");
    }, 2300);
  }

  /* ============================================================
     SOUND
     ============================================================ */

  function playSound() {

    if (!db.settings.sounds) return;

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const context =
        new AudioContext();

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.frequency.value = 740;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.0001,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.035,
        context.currentTime + 0.01
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.13
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(
        context.currentTime + 0.14
      );

    } catch {}
  }

  /* ============================================================
     TABS
     ============================================================ */

  function setTab(tab) {

    state.tab = tab;

    $$(".yc-tab").forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.tab === tab
      );

    });

    renderSidebar();
  }

  /* ============================================================
     MESSAGE ACTIONS
     ============================================================ */

  function copySelectedMessage() {

    if (!state.selectedMessage) return;

    const text =
      state.selectedMessage.text;

    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        toast("Message copied.");
      })
      .catch(() => {
        toast("Copy unavailable.");
      });

    closeModal();
  }

  function forwardSelectedMessage() {

    if (!state.selectedMessage) return;

    const message =
      state.selectedMessage;

    closeModal();

    openModal(`

      <div class="yc-modal-header">

        <div class="yc-modal-title">
          Forward message
        </div>

        <button
          class="yc-icon-btn"
          onclick="window.YOYOCHAT.closeModal()"
        >
          ×
        </button>

      </div>

      <div class="yc-modal-body">

        <div style="
          padding:12px;
          border-radius:10px;
          background:rgba(0,191,255,.06);
          margin-bottom:12px
        ">
          ${escapeHTML(message.text)}
        </div>

        ${
          db.contacts
            .map(user => `
              <button
                class="yc-chat-row"
                style="width:100%"
                onclick="
                  window.YOYOCHAT.forwardTo(
                    '${user.id}',
                    '${message.id}'
                  )
                "
              >

                ${avatar(user, "small")}

                <div class="yc-chat-info">
                  <div class="yc-chat-name">
                    ${escapeHTML(user.name)}
                  </div>
                </div>

              </button>
            `)
            .join("")
        }

      </div>
    `);
  }

  function forwardTo(userId, messageId) {

    const original =
      state.selectedMessage;

    if (!original) return;

    let chat =
      db.chats.find(
        c => c.userId === userId
      );

    if (!chat) {

      chat = {
        id: uid("chat"),
        type: "private",
        userId,
        pinned: false,
        muted: false,
        unread: 0,
        messages: []
      };

      db.chats.push(chat);
    }

    chat.messages.push({
      id: uid("msg"),
      sender: "me",
      text: original.text,
      timestamp: now(),
      status: "sent",
      forwarded: true,
      reactions: []
    });

    saveDatabase();

    closeModal();

    toast("Message forwarded ⚡");
  }

  function deleteSelectedMessage() {

    if (!state.selectedMessage) return;

    const chat =
      getChat(state.activeChat) ||
      getGroup(state.activeChat);

    if (!chat) return;

    chat.messages =
      chat.messages.filter(
        message =>
          message.id !==
          state.selectedMessage.id
      );

    saveDatabase();

    state.selectedMessage = null;

    closeModal();

    renderActiveChat();

    toast("Message deleted.");
  }

  /* ============================================================
     GLOBAL API
     ============================================================ */

  window.YOYOCHAT = {

    open,
    close,

    send: sendMessage,

    closeModal,

    reply: replyToSelected,

    copyMessage: copySelectedMessage,

    forwardMessage: forwardSelectedMessage,

    deleteMessage: deleteSelectedMessage,

    reactQuick: quickReact,

    startChat,

    messageUser,

    callUser,

    createStatus,

    publishStatus,

    attachment,

    createGroup,

    publishGroup,

    settings,

    notifications,

    openMyProfile,

    editProfile,

    saveProfile,

    closeProfile,

    togglePin,

    toggleMute,

    clearCurrentChat,

    clearChats
  };

  /* ============================================================
     PUBLIC SHORTCUTS
     ============================================================ */

  window.openSocial = open;
  window.openYOYOCHAT = open;

  /* ============================================================
     AUTO INIT
     ============================================================ */

  function init() {

    loadDatabase();

    injectStyles();

    buildApp();

    /*
      Automatically connect any existing
      Social / Chat buttons in the main app.
    */

    document.addEventListener("click", event => {

      const opener =
        event.target.closest(
          "[data-open-social], .social-button, .open-social"
        );

      if (opener) {
        open();
      }

    });

  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
