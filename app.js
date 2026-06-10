const songs = [
  {
    id: "after",
    title: "激情過後",
    singer: "張清芳",
    cover: "熱播金曲",
    lyric: "回憶像一首慢慢淡去的歌",
    pronounce: "huí yì xiàng yì shǒu màn màn dàn qù de gē",
  },
  {
    id: "love",
    title: "我是真的付出我的愛",
    singer: "周華健",
    cover: "國語經典",
    lyric: "我是真的付出我的愛",
    pronounce: "wǒ shì zhēn de fù chū wǒ de ài",
  },
  {
    id: "friend",
    title: "朋友",
    singer: "周華健",
    cover: "合唱推薦",
    lyric: "朋友一生一起走",
    pronounce: "péng yǒu yì shēng yì qǐ zǒu",
  },
  {
    id: "penghu",
    title: "外婆的澎湖灣",
    singer: "潘安邦",
    cover: "懷舊點播",
    lyric: "晚風輕拂澎湖灣",
    pronounce: "wǎn fēng qīng fú péng hú wān",
  },
  {
    id: "home",
    title: "家後",
    singer: "江蕙",
    cover: "台語暖歌",
    lyric: "有你甲我作伴",
    pronounce: "ū lí kah guá tsò-phuānn",
  },
  {
    id: "story",
    title: "光陰的故事",
    singer: "張艾嘉",
    cover: "回憶歌單",
    lyric: "流水它帶走光陰的故事",
    pronounce: "liú shuǐ tā dài zǒu guāng yīn de gù shì",
  },
];

const rooms = [
  {
    id: "blessing",
    title: "祝訊唱歌房",
    shortTitle: "祝訊房",
    host: "美玲老師",
    tags: ["祝訊", "新手友善"],
    icon: "🌷",
    song: "生日祝福、節慶問候、點歌送暖",
    online: 520,
    time: "今晚 19:00",
    queue: "目前 3 位排唱，可先送祝福訊息給朋友。",
    defaultSong: "penghu",
  },
  {
    id: "golden",
    title: "金曲唱歌房",
    shortTitle: "金曲房",
    host: "阿忠伯",
    tags: ["金曲", "新手友善"],
    icon: "🎙",
    song: "懷舊國語、台語金曲、雙人合唱",
    online: 123,
    time: "今晚 20:00",
    queue: "目前 5 位排唱，主持人會協助調整音量。",
    defaultSong: "love",
  },
  {
    id: "chat",
    title: "閒聊房",
    shortTitle: "閒聊房",
    host: "桂香姐",
    tags: ["閒聊", "新手友善"],
    icon: "👏",
    song: "聽歌聊天、掌聲互動、Call-in 陪伴",
    online: 456,
    time: "每天 15:00",
    queue: "目前不用排隊，可先聽主播分享生活。",
    defaultSong: "friend",
  },
];

const companions = [
  {
    id: "mei",
    name: "玉梅",
    initials: "梅",
    area: "台南東區",
    time: "平日晚上",
    song: "喜歡鄧麗君與鳳飛飛",
    comfort: "先聊歌單，熟了再 Call-in",
  },
  {
    id: "chen",
    name: "陳伯",
    initials: "陳",
    area: "高雄左營",
    time: "週末下午",
    song: "台語老歌與合唱都可以",
    comfort: "希望每次通話 15 分鐘內",
  },
  {
    id: "lin",
    name: "淑玲",
    initials: "玲",
    area: "嘉義西區",
    time: "上午 10 點",
    song: "正在練月亮代表我的心",
    comfort: "願意加入小房間，不接受私下交換電話",
  },
];

const state = {
  activeFilter: "全部",
  currentRoom: null,
  currentSong: songs[3],
  joinedRooms: new Set(),
  greetings: 0,
  calls: 1,
  safePaused: false,
  records: [
    {
      title: "排定 Call-in",
      detail: "已與玉梅安排今天 19:30 練唱月亮代表我的心。",
      time: "今日 09:10",
    },
  ],
};

const roomList = document.querySelector("#roomList");
const companionGrid = document.querySelector("#companionGrid");
const songList = document.querySelector("#songList");
const songSearch = document.querySelector("#songSearch");
const currentRoomName = document.querySelector("#currentRoomName");
const currentRoomDetail = document.querySelector("#currentRoomDetail");
const currentSongTitle = document.querySelector("#currentSongTitle");
const currentSongSinger = document.querySelector("#currentSongSinger");
const lyricLine = document.querySelector("#lyricLine");
const lyricPronounce = document.querySelector("#lyricPronounce");
const queueStatus = document.querySelector("#queueStatus");
const chatWindow = document.querySelector("#chatWindow");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const joinQueueButton = document.querySelector("#joinQueueButton");
const callInButton = document.querySelector("#callInButton");
const stopButton = document.querySelector("#stopButton");
const recordTimeline = document.querySelector("#recordTimeline");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduleBuddy = document.querySelector("#scheduleBuddy");
const safetyForm = document.querySelector("#safetyForm");
const safetyList = document.querySelector("#safetyList");
const safetySummaryTitle = document.querySelector("#safetySummaryTitle");
const pauseInteraction = document.querySelector("#pauseInteraction");
const clearRecords = document.querySelector("#clearRecords");
const quickGreeting = document.querySelector("#quickGreeting");
const demoSongButton = document.querySelector("#demoSongButton");
const toast = document.querySelector("#toast");

const counters = {
  activeRoomCount: document.querySelector("#activeRoomCount"),
  greetingCount: document.querySelector("#greetingCount"),
  callCount: document.querySelector("#callCount"),
  safeScore: document.querySelector("#safeScore"),
};

let toastTimer;

function nowLabel() {
  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function addRecord(title, detail) {
  state.records.unshift({
    title,
    detail,
    time: `今日 ${nowLabel()}`,
  });
  renderRecords();
}

function updateCounters() {
  counters.activeRoomCount.textContent = state.joinedRooms.size;
  counters.greetingCount.textContent = state.greetings;
  counters.callCount.textContent = state.calls;
  counters.safeScore.textContent = state.safePaused ? "暫停" : "安心";
}

function roomMatchesFilter(room) {
  return state.activeFilter === "全部" || room.tags.includes(state.activeFilter);
}

function renderRooms() {
  const visibleRooms = rooms.filter(roomMatchesFilter);
  roomList.innerHTML = "";

  visibleRooms.forEach((room) => {
    const card = document.createElement("article");
    card.className = "room-card";
    card.innerHTML = `
      <div class="room-icon" aria-hidden="true">${room.icon}</div>
      <div>
        <div class="tag-row">${room.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        <h3>${room.title}</h3>
        <div class="room-meta">
          <span>主持：${room.host}</span>
          <span>${room.time}</span>
          <span>${room.online} 人</span>
        </div>
        <p class="room-song">${room.song}</p>
      </div>
      <button type="button" data-room-id="${room.id}">${state.joinedRooms.has(room.id) ? "回到房間" : "加入房間"}</button>
    `;

    card.querySelector("button").addEventListener("click", () => joinRoom(room.id));
    roomList.append(card);
  });
}

function setCurrentSong(songId, shouldRecord = true) {
  const song = songs.find((item) => item.id === songId);
  if (!song) {
    return;
  }

  state.currentSong = song;
  currentSongTitle.textContent = song.title;
  currentSongSinger.textContent = song.singer;
  lyricLine.textContent = song.lyric;
  lyricPronounce.textContent = song.pronounce;

  if (shouldRecord) {
    addRecord("點歌", `你點了「${song.title}」(${song.singer})，已同步到唱歌室。`);
    showToast(`已點歌：${song.title}`);
  }
}

function joinRoom(roomId) {
  const room = rooms.find((item) => item.id === roomId);
  if (!room) {
    return;
  }

  state.currentRoom = room;
  const isNewJoin = !state.joinedRooms.has(roomId);
  state.joinedRooms.add(roomId);
  currentRoomName.textContent = room.shortTitle;
  currentRoomDetail.textContent = `主持人 ${room.host}，${room.time}，目前 ${room.online} 人在線。`;
  queueStatus.textContent = room.queue;
  setCurrentSong(room.defaultSong, false);
  chatWindow.innerHTML = "";
  appendChat("主持人", `歡迎來到「${room.title}」，可以先聽歌，也可以在聊天室點歌。`);
  appendChat("友伴提醒", "公開房間不顯示電話，Call-in 前會再次確認。");

  if (isNewJoin) {
    addRecord("加入唱歌房", `你加入了「${room.title}」，內容包含：${room.song}。`);
    showToast(`已加入 ${room.title}`);
  } else {
    showToast(`已回到 ${room.title}`);
  }

  renderRooms();
  updateCounters();
}

function appendChat(name, message, mood = "") {
  const item = document.createElement("p");
  const bubble = document.createElement("span");
  const avatar = name === "你" ? "我" : name.slice(0, 1);

  item.className = `chat-message${name === "你" ? " is-me" : ""}`;
  item.dataset.avatar = avatar;
  bubble.className = "chat-bubble";
  bubble.textContent = mood ? `${name}：${message} ${mood}` : `${name}：${message}`;
  item.append(bubble);
  chatWindow.append(item);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderSongs() {
  const keyword = songSearch.value.trim().toLowerCase();
  const visibleSongs = songs.filter((song) => {
    const haystack = `${song.title} ${song.singer}`.toLowerCase();
    return haystack.includes(keyword);
  });

  songList.innerHTML = "";

  if (visibleSongs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "chat-placeholder";
    empty.textContent = "找不到歌曲，可以換一個歌名或歌手試試。";
    songList.append(empty);
    return;
  }

  visibleSongs.forEach((song) => {
    const item = document.createElement("article");
    item.className = "song-item";
    item.innerHTML = `
      <div class="song-cover">${song.cover}</div>
      <div>
        <strong>${song.title}</strong>
        <span>${song.singer}</span>
      </div>
      <button type="button" data-song-id="${song.id}" aria-label="點播 ${song.title}">▶</button>
    `;
    item.querySelector("button").addEventListener("click", () => setCurrentSong(song.id));
    songList.append(item);
  });
}

function renderCompanions() {
  companionGrid.innerHTML = "";
  scheduleBuddy.innerHTML = "";

  companions.forEach((buddy) => {
    const option = document.createElement("option");
    option.value = buddy.name;
    option.textContent = buddy.name;
    scheduleBuddy.append(option);

    const card = document.createElement("article");
    card.className = "companion-card";
    card.innerHTML = `
      <div class="avatar" aria-hidden="true">${buddy.initials}</div>
      <div>
        <h3>${buddy.name}</h3>
        <div class="buddy-meta">
          <span class="tag">${buddy.area}</span>
          <span class="tag">${buddy.time}</span>
        </div>
        <p class="buddy-song">${buddy.song}</p>
        <p>${buddy.comfort}</p>
      </div>
      <div class="buddy-actions">
        <button type="button" data-action="greet" data-buddy-id="${buddy.id}">送出問候</button>
        <button type="button" data-action="call" data-buddy-id="${buddy.id}">安排 Call-in</button>
      </div>
    `;

    card.querySelector('[data-action="greet"]').addEventListener("click", () => sendGreeting(buddy.id));
    card.querySelector('[data-action="call"]').addEventListener("click", () => scheduleBuddyCall(buddy.id));
    companionGrid.append(card);
  });
}

function sendGreeting(buddyId) {
  const buddy = companions.find((item) => item.id === buddyId);
  if (!buddy) {
    return;
  }

  state.greetings += 1;
  appendChat("你", `${buddy.name}，今天想聽你唱哪一首？`);
  addRecord("送出問候", `你向 ${buddy.name} 送出問候：「今天想聽你唱哪一首？」`);
  showToast(`已送出問候給 ${buddy.name}`);
  updateCounters();
}

function scheduleBuddyCall(buddyId) {
  const buddy = companions.find((item) => item.id === buddyId);
  if (!buddy) {
    return;
  }

  state.calls += 1;
  addRecord("安排 Call-in", `已邀請 ${buddy.name} 在 ${buddy.time} 先文字確認，再進行 15 分鐘 Call-in。`);
  showToast(`已替 ${buddy.name} 建立 Call-in 邀請`);
  updateCounters();
}

function renderSafetySummary() {
  const data = new FormData(safetyForm);
  const items = [];

  if (data.get("verifiedOnly")) {
    items.push("只接受已驗證會員加入你的私聊與 Call-in。");
  } else {
    items.push("可接受一般會員問候，系統仍會保留檢舉與暫停功能。");
  }

  if (data.get("textFirst")) {
    items.push("陌生好友必須先文字問候，雙方同意後才語音。");
  } else {
    items.push("允許較快進入語音，但仍需雙方確認。");
  }

  if (data.get("familyNotice")) {
    items.push("重要通話後會通知關懷聯絡人安全狀態。");
  } else {
    items.push("通話紀錄只保留在本機 demo 畫面。");
  }

  const topic = data.get("safeTopic")?.trim();
  if (topic) {
    items.push(`今日安心話題：${topic}。`);
  }

  safetyList.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    safetyList.append(listItem);
  });
  safetySummaryTitle.textContent = state.safePaused ? "陌生互動已暫停" : "目前是穩定安心模式";
  updateCounters();
}

function renderRecords() {
  recordTimeline.innerHTML = "";

  if (state.records.length === 0) {
    const empty = document.createElement("li");
    const time = document.createElement("time");
    const title = document.createElement("strong");
    const detail = document.createElement("p");

    time.textContent = "尚無紀錄";
    title.textContent = "開始今天的陪伴";
    detail.textContent = "加入唱歌房、送出問候或安排 Call-in 後，這裡會自動更新。";
    empty.append(time, title, detail);
    recordTimeline.append(empty);
    return;
  }

  state.records.forEach((record) => {
    const item = document.createElement("li");
    const time = document.createElement("time");
    const title = document.createElement("strong");
    const detail = document.createElement("p");

    time.textContent = record.time;
    title.textContent = record.title;
    detail.textContent = record.detail;
    item.append(time, title, detail);
    recordTimeline.append(item);
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderRooms();
  });
});

document.querySelectorAll(".entry-button").forEach((button) => {
  button.addEventListener("click", () => {
    const targetMap = {
      host: "#rooms",
      listener: "#rooms",
      chat: "#companions",
      profile: "#safety",
    };
    const label = button.textContent.trim();
    document.querySelector(targetMap[button.dataset.entry]).scrollIntoView({ behavior: "smooth" });
    showToast(`已開啟：${label}`);
  });
});

document.querySelectorAll(".tool-button").forEach((button) => {
  button.addEventListener("click", () => {
    const labels = {
      smile: "送出微笑表情",
      mic: "麥克風已準備",
      gift: "送出小禮物",
    };
    const message = labels[button.dataset.tool];
    appendChat("你", message);
    addRecord("唱歌室互動", message);
    showToast(message);
  });
});

document.querySelectorAll(".reaction-button").forEach((button) => {
  button.addEventListener("click", () => {
    const reaction = button.dataset.reaction;
    state.greetings += 1;
    appendChat("你", "給大家一個鼓勵", reaction);
    addRecord("聊天室表情", `你在聊天室送出 ${reaction} 互動。`);
    showToast(`已送出 ${reaction}`);
    updateCounters();
  });
});

songSearch.addEventListener("input", renderSongs);

demoSongButton.addEventListener("click", () => {
  setCurrentSong("story");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) {
    showToast("請先輸入想說的話");
    return;
  }

  appendChat("你", message);
  addRecord("聊天室互動", `你在聊天室說：「${message}」`);
  chatInput.value = "";
});

joinQueueButton.addEventListener("click", () => {
  if (!state.currentRoom) {
    showToast("請先加入一間唱歌房");
    return;
  }

  queueStatus.textContent = "你已加入排唱，前面還有 2 位。主持人會在輪到你之前提醒。";
  appendChat("友伴提醒", "已幫你排唱，輪到你前可先喝水、看歌詞。");
  addRecord("加入排唱", `你在「${state.currentRoom.title}」加入排唱隊伍。`);
  showToast("已加入排唱");
});

stopButton.addEventListener("click", () => {
  lyricLine.textContent = "已暫停，想唱時再繼續";
  lyricPronounce.textContent = "請放心慢慢來";
  addRecord("暫停唱歌", "你在唱歌室按下停止，系統保留目前歌曲。");
  showToast("唱歌室已暫停");
});

callInButton.addEventListener("click", () => {
  if (!state.currentRoom) {
    showToast("請先加入一間唱歌房");
    return;
  }

  state.calls += 1;
  appendChat("友伴提醒", "已送出 Call-in 邀請，對方同意後才會開始通話。");
  addRecord("房間 Call-in", `你從「${state.currentRoom.title}」送出 Call-in 問候。`);
  showToast("Call-in 邀請已送出");
  updateCounters();
});

scheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(scheduleForm);
  const buddy = data.get("scheduleBuddy");
  const time = data.get("scheduleTime");
  const topic = data.get("scheduleTopic")?.trim() || "唱歌與日常問候";

  state.calls += 1;
  addRecord("新增陪伴行程", `已安排與 ${buddy} 在 ${time} Call-in，主題：${topic}。`);
  showToast("陪伴行程已加入");
  updateCounters();
});

safetyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderSafetySummary();
  addRecord("更新安全設定", "你更新了今日安心話題與互動界線。");
  showToast("安全設定已更新");
});

safetyForm.addEventListener("change", () => {
  renderSafetySummary();
});

pauseInteraction.addEventListener("click", () => {
  state.safePaused = !state.safePaused;
  pauseInteraction.textContent = state.safePaused ? "恢復陌生互動" : "暫停陌生互動 30 分鐘";
  addRecord(
    state.safePaused ? "暫停陌生互動" : "恢復陌生互動",
    state.safePaused ? "已暫停陌生訊息與 Call-in 邀請。" : "已恢復陌生訊息與 Call-in 邀請。"
  );
  renderSafetySummary();
  showToast(state.safePaused ? "已暫停陌生互動" : "已恢復陌生互動");
});

clearRecords.addEventListener("click", () => {
  state.records = [];
  renderRecords();
  showToast("Demo 紀錄已清空");
});

quickGreeting.addEventListener("click", () => {
  const buddy = companions[0];
  state.greetings += 1;
  appendChat("你", `${buddy.name}，今晚一起聽金曲好嗎？`);
  addRecord("快速問候", `你向 ${buddy.name} 送出今日問候，邀請她今晚一起聽歌。`);
  showToast("今日問候已送出");
  updateCounters();
});

renderRooms();
renderSongs();
renderCompanions();
renderSafetySummary();
renderRecords();
setCurrentSong(state.currentSong.id, false);
updateCounters();
