/* =====================================================================
   Englify: app (router + header + theme + mobile menu)
   Pages use hash routes, for example  index.html#/courses
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});
  var P = E.pages, ui = E.ui, store = E.store;
  var header = document.getElementById("siteHeader");

  function skillGuard(fn) {
    return function (a, b, c) { return E.SKILLS[b] ? fn(a, b, c) : P.notFound(); };
  }
  function practiceGuard(skill, level) { return E.SKILLS[skill] ? P.practiceRun(skill, level) : P.notFound(); }

  // [pattern, handler, nav item, page title]
  var routes = [
    [/^\/?$/, P.home, "home", "Home"],
    [/^\/courses\/?$/, P.courses, "courses", "Courses"],
    [/^\/course\/(A1|A2|B1)\/?$/, P.courseDetail, "courses", "Course"],
    [/^\/lesson\/(A1|A2|B1)\/(\w+)\/?$/, skillGuard(P.lesson), "courses", "Lesson"],
    [/^\/lesson\/(A1|A2|B1)\/(\w+)\/practice\/?$/, skillGuard(P.lessonPractice), "courses", "Lesson practice"],
    [/^\/level-test\/?$/, P.levelTest, "level-test", "Level Test"],
    [/^\/practice\/?$/, P.practiceHome, "practice", "Practice"],
    [/^\/practice\/(\w+)\/(A1|A2|B1)\/?$/, practiceGuard, "practice", "Practice"],
    [/^\/quiz\/?$/, P.quizHome, "quiz", "Quiz"],
    [/^\/quiz\/(A1|A2|B1)\/?$/, P.quizRun, "quiz", "Quiz"],
    [/^\/progress\/?$/, P.progress, "progress", "Progress"],
    [/^\/profile\/?$/, P.profile, "profile", "Profile"],
    [/^\/login\/?$/, P.login, "profile", "Log in"],
    [/^\/signup\/?$/, P.signup, "profile", "Sign up"],
    [/^\/about\/?$/, P.about, "about", "About"],
  ];

  function currentPath() {
    var h = (window.location.hash || "").replace(/^#/, "").split("?")[0];
    return h || "/";
  }

  function render() {
    E.runner.stop();
    closeMenu();
    var path = currentPath(), hit = null;
    for (var i = 0; i < routes.length && !hit; i++) {
      var m = path.match(routes[i][0]);
      if (m) hit = { route: routes[i], args: m.slice(1) };
    }
    var nav = hit ? hit.route[2] : "";
    [].forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      var on = a.getAttribute("data-nav") === nav;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (hit) hit.route[1].apply(null, hit.args); else P.notFound();
    document.title = (hit ? hit.route[3] + " | " : "") + "Englify: Fluency, Confidence, Progress";
    window.scrollTo(0, 0);
    var main = document.getElementById("main");
    if (main) main.focus({ preventScroll: true });
  }

  // ---------- header chips + user button ----------
  function updateChrome() {
    var s = store.get(), u = E.auth.user();
    var st = document.getElementById("chipStreak"), xp = document.getElementById("chipXp"), slot = document.getElementById("userSlot"), slotM = document.getElementById("userSlotMobile");
    if (st) st.innerHTML = ui.icon("fire") + "<span>" + store.streak() + "</span>";
    if (xp) xp.innerHTML = ui.icon("bolt") + "<span>" + s.xp + " XP</span>";
    var html = u
      ? '<a class="user-btn" href="#/profile" aria-label="Profile: ' + ui.esc(u.name) + '"><span class="avatar avatar-sm">' + ui.esc(u.name.charAt(0).toUpperCase()) + "</span><span class=\"user-name\">" + ui.esc(u.name.split(" ")[0]) + "</span></a>"
      : '<a class="btn btn-secondary btn-sm" href="#/login">Log in</a><a class="btn btn-primary btn-sm hide-sm" href="#/signup">Sign up</a>';
    if (slot) slot.innerHTML = html;
    if (slotM) slotM.innerHTML = u ? "" : '<a class="btn btn-secondary" href="#/login">Log in</a><a class="btn btn-primary" href="#/signup">Sign up</a>';
  }

  // ---------- theme ----------
  function effectiveTheme() {
    var t = E.storage.get("englify:theme");
    if (t === "dark" || t === "light") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme() {
    var t = E.storage.get("englify:theme");
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    var btn = document.getElementById("themeBtn");
    if (btn) {
      var dark = effectiveTheme() === "dark";
      btn.innerHTML = ui.icon(dark ? "sun" : "moon");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", dark ? "Light mode" : "Dark mode");
    }
  }

  // ---------- mobile menu ----------
  function closeMenu() {
    header.classList.remove("nav-open");
    var b = document.getElementById("menuBtn");
    if (b) { b.setAttribute("aria-expanded", "false"); b.innerHTML = ui.icon("bars"); b.setAttribute("aria-label", "Open menu"); }
  }
  function toggleMenu() {
    var open = header.classList.toggle("nav-open");
    var b = document.getElementById("menuBtn");
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.innerHTML = ui.icon(open ? "times" : "bars");
    b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  function init() {
    store.init();
    // icons in static markup
    [].forEach.call(document.querySelectorAll("[data-icon]"), function (el) { el.insertAdjacentHTML("afterbegin", ui.icon(el.getAttribute("data-icon"))); });
    applyTheme();
    updateChrome();
    store.on(updateChrome);

    document.getElementById("themeBtn").addEventListener("click", function () {
      E.storage.set("englify:theme", effectiveTheme() === "dark" ? "light" : "dark");
      applyTheme();
    });
    var mb = document.getElementById("menuBtn");
    mb.addEventListener("click", toggleMenu);
    closeMenu();
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    document.addEventListener("click", function (e) {
      // composedPath still lists the header even if the clicked icon was replaced
      var path = e.composedPath ? e.composedPath() : [];
      if (header.classList.contains("nav-open") && path.indexOf(header) === -1) closeMenu();
    });
    if (window.matchMedia) {
      try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme); } catch (e) { /* older browsers */ }
    }
    window.addEventListener("hashchange", render);
    render();
  }

  E.init = init;
  init();
})();
