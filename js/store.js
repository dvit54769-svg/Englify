/* =====================================================================
   Englify: data store
   - Saves progress in the browser (localStorage). No server needed.
   - Falls back to memory if localStorage is blocked.
   - Demo accounts are stored only in this browser (not real security).
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});
  var mem = {};

  var ls = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return mem[k] === undefined ? null : mem[k]; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { delete mem[k]; } },
  };
  E.storage = ls;

  function readJSON(k, fallback) {
    try { var v = ls.get(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }

  // ---------- dates ----------
  function dateKey(d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  E.dateKey = dateKey;

  // ---------- state ----------
  var KEY_SESSION = "englify:session", KEY_USERS = "englify:users", KEY_PROG = "englify:progress:";
  var listeners = [];
  var S = null; // current progress state

  function blank() {
    return { level: "A1", goal: 50, xp: 0, days: {}, lessons: {}, quizzes: [], test: null, answered: 0, correct: 0, ach: {}, tried: {}, goalHit: {} };
  }
  function session() { return readJSON(KEY_SESSION, null); }
  function progKey() { var s = session(); return KEY_PROG + (s ? s.email : "guest"); }
  function load() {
    var saved = readJSON(progKey(), null);
    S = Object.assign(blank(), saved || {});
  }
  function save() { ls.set(progKey(), JSON.stringify(S)); }
  function emit() { listeners.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } }); }

  function dayXp(s, key) { return s.days[key] ? s.days[key].xp : 0; }

  function streakOf(s) {
    var d = new Date();
    if (!dayXp(s, dateKey(d))) {
      d.setDate(d.getDate() - 1);
      if (!dayXp(s, dateKey(d))) return 0;
    }
    var n = 0;
    while (dayXp(s, dateKey(d)) > 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- achievements ----------
  var ACH = [
    { id: "first", title: "First Step", desc: "Answer your first question correctly", icon: "star", color: "blue", test: function (s) { return s.correct >= 1; } },
    { id: "explorer", title: "Six Skills Explorer", desc: "Try all six skills", icon: "layer", color: "purple", test: function (s) { return Object.keys(s.tried).length >= 6; } },
    { id: "goal", title: "Goal Getter", desc: "Reach your daily goal", icon: "target", color: "blue", test: function (s) { return Object.keys(s.goalHit).length >= 1; } },
    { id: "fire3", title: "On Fire", desc: "Reach a 3-day streak", icon: "fire", color: "orange", test: function (s) { return streakOf(s) >= 3; } },
    { id: "week", title: "Week Warrior", desc: "Reach a 7-day streak", icon: "calendar", color: "orange", test: function (s) { return streakOf(s) >= 7; } },
    { id: "xp100", title: "100 XP", desc: "Earn 100 XP", icon: "bolt", color: "purple", test: function (s) { return s.xp >= 100; } },
    { id: "xp500", title: "XP Champion", desc: "Earn 500 XP", icon: "trophy", color: "orange", test: function (s) { return s.xp >= 500; } },
    { id: "finder", title: "Level Finder", desc: "Complete the level test", icon: "clipboard", color: "blue", test: function (s) { return !!s.test; } },
    { id: "quiz80", title: "Quiz Master", desc: "Score 80% or more in a quiz", icon: "medal", color: "purple", test: function (s) { return s.quizzes.some(function (q) { return q.score / q.total >= 0.8; }); } },
    { id: "perfect", title: "Perfect Score", desc: "Get 100% in a quiz", icon: "shield", color: "orange", test: function (s) { return s.quizzes.some(function (q) { return q.score === q.total; }); } },
    { id: "levelclear", title: "Level Complete", desc: "Finish all six lessons of one level", icon: "rocket", color: "blue", test: function (s) {
      return E.LEVEL_KEYS.some(function (l) { return E.SKILL_KEYS.every(function (k) { var x = s.lessons[l + ":" + k]; return x && x.done; }); });
    } },
  ];
  E.ACHIEVEMENTS = ACH;

  function checkAch() {
    ACH.forEach(function (a) {
      if (!S.ach[a.id] && a.test(S)) {
        S.ach[a.id] = dateKey();
        if (E.ui && E.ui.toast) E.ui.toast("Achievement unlocked: " + a.title, "ach");
      }
    });
  }

  // ---------- public store API ----------
  var store = {
    init: function () { load(); },
    get: function () { return S; },
    on: function (fn) { listeners.push(fn); },
    save: function () { save(); emit(); },

    streak: function () { return streakOf(S); },
    todayXp: function () { return dayXp(S, dateKey()); },
    goalPct: function () { return Math.min(100, Math.round((dayXp(S, dateKey()) / S.goal) * 100)); },
    lastDays: function (n) {
      var out = [], d = new Date();
      d.setDate(d.getDate() - (n - 1));
      for (var i = 0; i < n; i++) {
        out.push({ key: dateKey(d), label: d.toLocaleDateString("en-US", { weekday: "short" }), xp: dayXp(S, dateKey(d)), today: dateKey(d) === dateKey() });
        d.setDate(d.getDate() + 1);
      }
      return out;
    },
    accuracy: function () { return S.answered ? Math.round((S.correct / S.answered) * 100) : 0; },
    lessonsDone: function (level) {
      var n = 0;
      E.SKILL_KEYS.forEach(function (k) { var x = S.lessons[level + ":" + k]; if (x && x.done) n++; });
      return n;
    },
    totalDone: function () { return E.LEVEL_KEYS.reduce(function (a, l) { return a + store.lessonsDone(l); }, 0); },
    lesson: function (level, skill) { return S.lessons[level + ":" + skill] || null; },

    addXP: function (n, silent) {
      if (!n) return;
      var key = dateKey();
      var before = dayXp(S, key);
      S.xp += n;
      S.days[key] = { xp: before + n };
      if (before < S.goal && before + n >= S.goal && !S.goalHit[key]) {
        S.goalHit[key] = true;
        if (E.ui && E.ui.toast) E.ui.toast("Daily goal reached! Great job.", "ach");
      }
      if (!silent && E.ui && E.ui.toast) E.ui.toast("+" + n + " XP", "xp");
      checkAch();
      store.save();
    },
    answered: function (ok) {
      S.answered++;
      if (ok) S.correct++;
      checkAch();
      save();
    },
    tried: function (skill) { S.tried[skill] = true; save(); },
    lessonResult: function (level, skill, pct) {
      var k = level + ":" + skill, old = S.lessons[k] || { best: 0, attempts: 0, done: false };
      old.best = Math.max(old.best, pct);
      old.attempts++;
      if (pct >= 60) old.done = true;
      S.lessons[k] = old;
      checkAch();
      store.save();
    },
    quizResult: function (level, score, total) {
      S.quizzes.unshift({ date: dateKey(), level: level, score: score, total: total });
      S.quizzes = S.quizzes.slice(0, 20);
      checkAch();
      store.save();
    },
    testResult: function (score, total, level) {
      S.test = { date: dateKey(), score: score, total: total, level: level };
      S.level = level;
      checkAch();
      store.save();
    },
    setLevel: function (level) { S.level = level; store.save(); },
    setGoal: function (goal) { S.goal = goal; store.save(); },
    reset: function () { var keep = { level: S.level, goal: S.goal }; S = Object.assign(blank(), keep); store.save(); },
  };
  E.store = store;

  // ---------- demo accounts ----------
  function hash(str) { // small non-secure hash, demo only
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  E.auth = {
    user: function () { return session(); },
    signup: function (f) {
      var errors = {};
      var name = (f.name || "").trim(), email = (f.email || "").trim().toLowerCase();
      if (name.length < 2) errors.name = "Please enter your name (at least 2 letters).";
      if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
      if ((f.password || "").length < 6) errors.password = "Password must be at least 6 characters.";
      if (f.password !== f.confirm) errors.confirm = "Passwords do not match.";
      var users = readJSON(KEY_USERS, []);
      if (!errors.email && users.some(function (u) { return u.email === email; })) errors.email = "This email already has an account. Try logging in.";
      if (Object.keys(errors).length) return { ok: false, errors: errors };

      var guest = readJSON(KEY_PROG + "guest", null);
      users.push({ name: name, email: email, hash: hash(f.password + ":" + email), joined: dateKey() });
      ls.set(KEY_USERS, JSON.stringify(users));
      ls.set(KEY_SESSION, JSON.stringify({ email: email, name: name, joined: dateKey() }));
      // keep the guest progress when creating an account
      if (guest && guest.xp > 0) ls.set(KEY_PROG + email, JSON.stringify(guest));
      load();
      if (f.level) { S.level = f.level; }
      save(); emit();
      return { ok: true };
    },
    login: function (f) {
      var email = (f.email || "").trim().toLowerCase();
      var users = readJSON(KEY_USERS, []);
      var u = users.filter(function (x) { return x.email === email; })[0];
      if (!u || u.hash !== hash((f.password || "") + ":" + email)) return { ok: false, errors: { form: "Email or password is not correct." } };
      ls.set(KEY_SESSION, JSON.stringify({ email: u.email, name: u.name, joined: u.joined }));
      load(); emit();
      return { ok: true };
    },
    logout: function () { ls.del(KEY_SESSION); load(); emit(); },
    rename: function (name) {
      var s = session(); if (!s) return;
      s.name = name; ls.set(KEY_SESSION, JSON.stringify(s));
      var users = readJSON(KEY_USERS, []);
      users.forEach(function (u) { if (u.email === s.email) u.name = name; });
      ls.set(KEY_USERS, JSON.stringify(users)); emit();
    },
  };
})();
