/* =====================================================================
   Englify: pages
   Each function draws one page into #app. The router (app.js) calls them.
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});
  var ui = E.ui, esc = ui.esc, icon = ui.icon, store = E.store, L = E.LEVELS, SK = E.SKILLS;
  var app = null;

  function mount(html, bind) {
    app = document.getElementById("app");
    app.innerHTML = '<div class="page">' + html + "</div>";
    if (bind) bind(app);
  }

  // ---------- small building blocks ----------
  function levelTag(l) { return '<span class="tag tag-' + L[l].color + '">' + l + " " + L[l].name + "</span>"; }
  function bubble(name, tone, big) { return '<span class="bubble tone-' + tone + (big ? " bubble-lg" : "") + '">' + icon(name) + "</span>"; }
  function skillBubble(k, big) { return bubble(SK[k].icon, SK[k].color, big); }
  function head(eyebrow, title, lead, narrow) {
    return '<header class="page-head"><div class="container' + (narrow ? " narrow" : "") + '">' + (eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + "</p>" : "") + "<h1>" + title + "</h1>" + (lead ? '<p class="lead">' + lead + "</p>" : "") + "</div></header>";
  }
  function nextLesson(level) {
    for (var i = 0; i < E.SKILL_KEYS.length; i++) {
      var k = E.SKILL_KEYS[i], x = store.lesson(level, k);
      if (!x || !x.done) return { level: level, skill: k };
    }
    return null;
  }
  function segmented(name, current) {
    return '<div class="segmented" role="radiogroup" aria-label="Choose level">' + E.LEVEL_KEYS.map(function (l) {
      return '<label class="seg tone-' + L[l].color + '"><input type="radio" name="' + name + '" value="' + l + '"' + (l === current ? " checked" : "") + '><span>' + l + " <small>" + L[l].name + "</small></span></label>";
    }).join("") + "</div>";
  }
  function lessonStatus(level, skill) {
    var x = store.lesson(level, skill);
    if (!x) return '<span class="status">Not started</span>';
    return '<span class="status ' + (x.done ? "done" : "") + '">' + (x.done ? icon("checkCircle") + " Completed \u00B7 " : "In progress \u00B7 ") + "best " + x.best + "%</span>";
  }
  function pickItems(level, skill) {
    var c = E.COURSES[level][skill], all = ui.shuffle(c.items);
    if (skill === "writing") return all.slice(0, 1);
    if (skill === "speaking") return all.slice(0, 3);
    if (skill === "reading") return all;
    return all.slice(0, 5);
  }

  /* ============================== HOME ============================== */
  function home() {
    var s = store.get(), next = nextLesson(s.level), started = s.xp > 0;
    var cta = started && next
      ? '<a class="btn btn-primary btn-lg" href="#/lesson/' + next.level + "/" + next.skill + '">Continue learning ' + icon("arrowRight") + "</a>"
      : '<a class="btn btn-primary btn-lg" href="#/courses">Start Learning ' + icon("arrowRight") + "</a>";
    var pct = store.goalPct();

    var benefits = [
      ["layer", "blue", "Organized by level", "Choose A1, A2 or B1 and follow a clear path from your starting point."],
      ["language", "purple", "Six skills in one place", "Grammar, vocabulary, listening, speaking, reading and writing."],
      ["check", "orange", "Instant feedback", "See right away if your answer is correct and why."],
      ["bolt", "blue", "Stay motivated", "Earn XP, keep your streak and unlock achievements."],
    ];
    var steps = [
      ["1", "Choose your level", "Take the level test or pick A1, A2 or B1."],
      ["2", "Learn and practice", "Read a short lesson, then do interactive exercises."],
      ["3", "Get instant feedback", "Every answer shows what is right and why."],
      ["4", "Track your progress", "Watch your XP, streak and scores grow."],
    ];

    mount(
      '<section class="hero"><div class="container hero-grid"><div class="hero-copy">' +
        '<p class="eyebrow">Learn English. Build Confidence. Step by Step.</p>' +
        '<h1>Learn English, <span class="grad-text">Build Your Future</span></h1>' +
        '<p class="lead">Improve your vocabulary, strengthen your grammar, and reach your goals with Englify.</p>' +
        '<div class="hero-cta">' + cta + '<a class="btn btn-secondary btn-lg" href="#/level-test">Take Level Test</a></div>' +
        '<ul class="hero-points"><li>' + icon("check") + " 6 English skills</li><li>" + icon("check") + " 3 levels: A1, A2, B1</li><li>" + icon("check") + " Instant feedback</li></ul></div>" +
        '<div class="hero-visual" aria-hidden="true">' +
          '<div class="hv hv-goal"><p>Daily Goal</p>' + ui.ring(pct, 96, 10, "var(--secondary)", "<strong>" + pct + "%</strong>") + "<small>" + store.todayXp() + " / " + s.goal + " XP</small></div>" +
          '<div class="hv hv-streak"><span class="bubble tone-orange">' + icon("fire") + "</span><div><strong>" + store.streak() + "-day streak</strong><small>Keep it going!</small></div></div>" +
          '<div class="hv hv-quiz"><span class="tag tag-blue">Grammar</span><p>She <span class="blank"></span> a teacher.</p><div class="hv-opt">am</div><div class="hv-opt ok">' + icon("check") + " is</div><div class=\"hv-opt\">are</div></div>" +
          '<div class="hv hv-level"><div class="hv-level-top">' + levelTag(s.level) + "<span>" + store.lessonsDone(s.level) + "/6 lessons</span></div>" + ui.bar((store.lessonsDone(s.level) / 6) * 100, "purple") + "</div>" +
        "</div></div></section>" +

      '<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Learning Benefits</p><h2>Everything you need to practice English</h2></div><div class="grid grid-4">' +
        benefits.map(function (b) { return '<article class="card feature">' + bubble(b[0], b[1], true) + "<h3>" + b[2] + "</h3><p>" + b[3] + "</p></article>"; }).join("") +
      "</div></div></section>" +

      '<section class="section section-alt"><div class="container"><div class="section-head"><p class="eyebrow">How Englify Works</p><h2>Four simple steps</h2></div><ol class="steps">' +
        steps.map(function (st) { return '<li class="card step"><span class="step-n">' + st[0] + "</span><h3>" + st[1] + "</h3><p>" + st[2] + "</p></li>"; }).join("") +
      "</ol></div></section>" +

      '<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Skills</p><h2>Practice every part of English</h2></div><div class="grid grid-3">' +
        E.SKILL_KEYS.map(function (k) {
          return '<a class="card skill-card tone-' + SK[k].color + '" href="#/practice/' + k + "/" + s.level + '">' + skillBubble(k, true) + "<div><h3>" + SK[k].name + "</h3><p>" + SK[k].desc + "</p></div>" + icon("arrowRight", "go") + "</a>";
        }).join("") +
      "</div></div></section>" +

      '<section class="section section-alt"><div class="container"><div class="section-head"><p class="eyebrow">Levels</p><h2>Find the right level for you</h2></div><div class="grid grid-3">' +
        E.LEVEL_KEYS.map(function (l) {
          return '<article class="card level-card tone-' + L[l].color + '"><div class="level-badge">' + l + "</div><h3>" + L[l].name + "</h3><p>" + L[l].desc + '</p><a class="btn btn-secondary btn-sm" href="#/course/' + l + '">View course ' + icon("arrowRight") + "</a></article>";
        }).join("") +
      "</div></div></section>" +

      '<section class="section"><div class="container"><div class="cta-band"><div><h2>Small steps. Big progress.</h2><p>Not sure where to start? Take the 15-question level test and get a recommended level in about five minutes.</p></div><a class="btn btn-accent btn-lg" href="#/level-test">Take Level Test ' + icon("arrowRight") + "</a></div></div></section>"
    );
  }

  /* ============================== COURSES ============================== */
  function courses() {
    var s = store.get();
    mount(
      head("Courses", "Choose your course", "Each level has six lessons, one for every skill. Start with the level that fits you, or take the <a href=\"#/level-test\">level test</a> to find it.") +
      '<section class="section-tight"><div class="container"><div class="grid grid-3">' +
      E.LEVEL_KEYS.map(function (l) {
        var done = store.lessonsDone(l), rec = (s.test && s.test.level === l) || (!s.test && s.level === l && s.xp > 0);
        return '<article class="card course-card tone-' + L[l].color + '"><div class="course-top"><div class="level-badge">' + l + "</div>" + (rec ? '<span class="tag tag-green">Recommended</span>' : "") + "</div>" +
          "<h2>" + L[l].name + "</h2><p>" + L[l].desc + '</p><p class="can"><strong>You will be able to:</strong> ' + L[l].can + "</p>" +
          '<div class="course-prog"><div class="row-between"><span>Progress</span><strong>' + done + "/6 lessons</strong></div>" + ui.bar((done / 6) * 100, L[l].color, l + " progress") + "</div>" +
          '<ul class="skill-chips">' + E.SKILL_KEYS.map(function (k) {
            var x = store.lesson(l, k);
            return '<li class="' + (x && x.done ? "done" : "") + '">' + (x && x.done ? icon("check") : "") + SK[k].name + "</li>";
          }).join("") + "</ul>" +
          '<a class="btn btn-primary" href="#/course/' + l + '">Open course ' + icon("arrowRight") + "</a></article>";
      }).join("") + "</div></div></section>"
    );
  }

  function courseDetail(level) {
    var done = store.lessonsDone(level), c = E.COURSES[level];
    mount(
      '<header class="page-head tone-' + L[level].color + '"><div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/courses">Courses</a> ' + icon("arrowRight") + " <span>" + level + " " + L[level].name + "</span></nav>" +
        '<div class="head-row"><div><p class="eyebrow">' + level + " course</p><h1>" + L[level].name + " English</h1><p class=\"lead\">" + L[level].desc + "</p></div>" +
        '<div class="head-ring">' + ui.ring((done / 6) * 100, 120, 12, "var(--tone)", "<strong>" + done + "/6</strong><span>lessons</span>") + "</div></div></div></header>" +
      '<section class="section-tight"><div class="container"><h2 class="h3">Lessons</h2><div class="grid grid-3">' +
      E.SKILL_KEYS.map(function (k) {
        return '<a class="card lesson-card tone-' + SK[k].color + '" href="#/lesson/' + level + "/" + k + '"><div class="lesson-top">' + skillBubble(k) + '<span class="tag tag-' + SK[k].color + '">' + SK[k].name + "</span></div>" +
          "<h3>" + esc(c[k].title) + "</h3><p>" + esc(c[k].summary) + "</p>" + lessonStatus(level, k) + '<span class="go-link">Open lesson ' + icon("arrowRight") + "</span></a>";
      }).join("") + "</div>" +
      '<div class="card quiz-cta"><div>' + bubble("question", "purple", true) + "</div><div><h3>Ready for the " + level + " quiz?</h3><p>Answer 10 mixed questions and earn bonus XP.</p></div><a class=\"btn btn-secondary\" href=\"#/quiz/" + level + '">Start quiz ' + icon("arrowRight") + "</a></div></div></section>"
    );
  }

  /* ============================== LESSON (learn) ============================== */
  function lesson(level, skill) {
    var c = E.COURSES[level][skill], x = store.lesson(level, skill);
    mount(
      '<header class="page-head tone-' + SK[skill].color + '"><div class="container narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/courses">Courses</a> ' + icon("arrowRight") + ' <a href="#/course/' + level + '">' + level + " " + L[level].name + "</a> " + icon("arrowRight") + " <span>" + SK[skill].name + "</span></nav>" +
        '<div class="head-row"><div class="lesson-title">' + skillBubble(skill, true) + "<div><p class=\"eyebrow\">" + SK[skill].name + " \u00B7 " + level + "</p><h1>" + esc(c.title) + '</h1><p class="lead">' + esc(c.summary) + "</p></div></div>" +
        (x ? '<div class="chips"><span class="chip">Best score ' + x.best + "%</span></div>" : "") + "</div></div></header>" +
      '<section class="section-tight"><div class="container narrow"><h2 class="h3">' + icon("bulb") + " Learn</h2>" +
      c.learn.map(function (b) {
        return '<article class="card learn-block"><h3>' + esc(b.h) + "</h3>" + (b.p ? "<p>" + esc(b.p) + "</p>" : "") +
          (b.ex ? '<ul class="examples">' + b.ex.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "") +
          (b.ul ? '<ul class="tips">' + b.ul.map(function (e) { return "<li>" + icon("check") + "<span>" + esc(e) + "</span></li>"; }).join("") + "</ul>" : "") + "</article>";
      }).join("") +
      (c.passage ? '<article class="card learn-block"><h3>Preview: the text</h3><p class="muted">You will read a short text in the practice. Read it carefully before answering.</p></article>' : "") +
      '<div class="lesson-cta"><a class="btn btn-primary btn-lg" href="#/lesson/' + level + "/" + skill + '/practice">Start practice ' + icon("arrowRight") + '</a><a class="btn btn-ghost" href="#/course/' + level + '">Back to course</a></div></div></section>'
    );
  }

  /* ============================== LESSON (practice run) ============================== */
  function lessonPractice(level, skill) {
    var c = E.COURSES[level][skill];
    mount('<section class="section-tight"><div class="container narrow" id="run"></div></section>');
    function go() {
      store.tried(skill);
      E.runner.start({
        root: document.getElementById("run"), items: c.items, passage: c.passage || null,
        title: SK[skill].name + " \u00B7 " + level, tag: SK[skill].name, color: SK[skill].color, barColor: SK[skill].color,
        mode: "lesson", backHref: "#/lesson/" + level + "/" + skill,
        record: function (res) {
          var was = store.lesson(level, skill), wasDone = was && was.done;
          store.lessonResult(level, skill, res.pct);
          if (res.pct >= 60 && !wasDone) { store.addXP(20); return 20; }
          return 0;
        },
        again: go,
        actions: function (res) {
          var nx = nextLesson(level), list = [];
          if (nx && !(nx.skill === skill)) list.push({ label: "Next lesson: " + SK[nx.skill].name, href: "#/lesson/" + nx.level + "/" + nx.skill });
          else if (!nx) list.push({ label: "Take the " + level + " quiz", href: "#/quiz/" + level });
          list.push({ label: "Try again", kind: "secondary" });
          list.push({ label: "Back to course", href: "#/course/" + level, kind: "secondary" });
          return list;
        },
      });
    }
    go();
  }

  /* ============================== PRACTICE ============================== */
  function practiceHome() {
    var s = store.get(), lvl = s.level;
    function grid() {
      return E.SKILL_KEYS.map(function (k) {
        return '<a class="card skill-card tone-' + SK[k].color + '" href="#/practice/' + k + "/" + lvl + '">' + skillBubble(k, true) + "<div><h3>" + SK[k].name + "</h3><p>" + SK[k].desc + "</p></div>" + icon("arrowRight", "go") + "</a>";
      }).join("");
    }
    mount(
      head("Practice", "Practice a skill", "Pick a level and a skill. Each session gives you fresh questions with instant feedback.") +
      '<section class="section-tight"><div class="container"><div class="toolbar"><span class="toolbar-label">Level</span>' + segmented("plevel", lvl) + '</div><div class="grid grid-3" id="pgrid">' + grid() + "</div></div></section>",
      function (root) {
        [].forEach.call(root.querySelectorAll('input[name="plevel"]'), function (r) {
          r.addEventListener("change", function () { lvl = r.value; root.querySelector("#pgrid").innerHTML = grid(); });
        });
      }
    );
  }

  function practiceRun(skill, level) {
    mount('<section class="section-tight"><div class="container narrow" id="run"></div></section>');
    var c = E.COURSES[level][skill];
    function go() {
      store.tried(skill);
      E.runner.start({
        root: document.getElementById("run"), items: pickItems(level, skill), passage: c.passage || null,
        title: "Practice \u00B7 " + SK[skill].name + " \u00B7 " + level, tag: SK[skill].name, color: SK[skill].color, barColor: SK[skill].color,
        mode: "practice", backHref: "#/practice",
        record: function () { store.addXP(10); return 10; },
        again: go,
        actions: function () {
          return [{ label: "Practice again", kind: "primary" }, { label: "Choose another skill", href: "#/practice", kind: "secondary" }, { label: "See progress", href: "#/progress", kind: "secondary" }];
        },
      });
    }
    go();
  }

  /* ============================== LEVEL TEST ============================== */
  function levelFromScore(n) { return n <= 6 ? "A1" : n <= 11 ? "A2" : "B1"; }

  function levelTest() {
    var s = store.get(), t = s.test;
    mount(
      head("Level Test", "Find your level", "Answer 15 multiple-choice questions, from easy to hard. You will get a recommended level at the end.", true) +
      '<section class="section-tight"><div class="container narrow" id="run"><div class="card intro-card">' +
        '<ul class="tips big"><li>' + icon("check") + "<span>15 questions about grammar and vocabulary</span></li><li>" + icon("check") + "<span>About 5 minutes. No timer.</span></li><li>" + icon("check") + "<span>Answers are not shown during the test, so answer honestly.</span></li><li>" + icon("check") + "<span>You can retake the test at any time.</span></li></ul>" +
        (t ? '<p class="muted">Last result: ' + t.score + "/" + t.total + " \u00B7 recommended " + levelTag(t.level) + "</p>" : "") +
        '<button type="button" class="btn btn-primary btn-lg" id="startTest">' + (t ? "Retake the test" : "Start test") + " " + icon("arrowRight") + "</button></div></div></section>",
      function (root) {
        root.querySelector("#startTest").addEventListener("click", run);
      }
    );

    function run() {
      var box = document.getElementById("run");
      E.runner.start({
        root: box, items: E.TEST.map(function (q) { return Object.assign({}, q, { tag: "Level test", color: "blue" }); }),
        title: "Level test", tag: "Level test", color: "blue", mode: "test", backHref: "#/level-test",
        record: function (res) {
          var lvl = levelFromScore(res.score);
          res.level = lvl;
          store.testResult(res.score, res.total, lvl);
          store.addXP(25);
          return 25;
        },
        renderResult: function (res) {
          var lvl = res.level;
          return '<section class="result card tone-' + L[lvl].color + '"><div class="result-grid">' +
            ui.ring(res.pct, 168, 14, "var(--tone)", '<strong class="ring-big">' + res.score + "</strong><span>of " + res.total + "</span>") +
            '<div><p class="eyebrow">Your recommended level</p><h2>' + lvl + " \u00B7 " + L[lvl].name + '</h2><p class="lead">' + L[lvl].can + "</p>" +
            '<div class="chips"><span class="chip chip-xp">' + icon("bolt") + " +25 XP earned</span></div>" +
            '<div class="result-actions"><a class="btn btn-primary" href="#/course/' + lvl + '">Start ' + lvl + " course " + icon("arrowRight") + '</a><button type="button" class="btn btn-secondary" data-again>' + icon("redo") + ' Retake test</button><a class="btn btn-ghost" href="#/practice">Go to practice</a></div>' +
            '<p class="muted small">Your level is saved. You can change it any time in <a href="#/profile">Profile</a>.</p></div></div></section>';
        },
        afterResult: function (r) { var b = r.querySelector("[data-again]"); if (b) b.addEventListener("click", run); },
      });
    }
  }

  /* ============================== QUIZ ============================== */
  function quizHome() {
    var s = store.get(), lvl = s.level, hist = s.quizzes.slice(0, 5);
    mount(
      head("Quiz", "Test what you have learned", "Ten mixed questions with instant feedback. Finish the quiz to earn bonus XP.") +
      '<section class="section-tight"><div class="container"><div class="grid grid-2"><div class="card intro-card"><h2 class="h3">How it works</h2><ol class="numlist">' +
        "<li>Choose a level.</li><li>Answer 10 questions about grammar, vocabulary and listening.</li><li>See if each answer is correct, with a short explanation.</li><li>Get your score and earn +30 bonus XP.</li></ol>" +
        '<div class="toolbar"><span class="toolbar-label">Level</span>' + segmented("qlevel", lvl) + '</div><a class="btn btn-primary btn-lg" id="qstart" href="#/quiz/' + lvl + '">Start quiz ' + icon("arrowRight") + "</a></div>" +
        '<div class="card"><h2 class="h3">Recent scores</h2>' +
        (hist.length
          ? '<ul class="score-list">' + hist.map(function (q) {
            var p = Math.round((q.score / q.total) * 100);
            return "<li><span>" + levelTag(q.level) + '</span><span class="muted">' + q.date + "</span><strong>" + q.score + "/" + q.total + "</strong>" + '<span class="score-pill ' + (p >= 80 ? "good" : p >= 50 ? "mid" : "low") + '">' + p + "%</span></li>";
          }).join("") + "</ul>"
          : '<p class="empty">No quizzes yet. Your scores will appear here.</p>') + "</div></div></div></section>",
      function (root) {
        [].forEach.call(root.querySelectorAll('input[name="qlevel"]'), function (r) {
          r.addEventListener("change", function () { root.querySelector("#qstart").setAttribute("href", "#/quiz/" + r.value); });
        });
      }
    );
  }

  function quizRun(level) {
    mount('<section class="section-tight"><div class="container narrow" id="run"></div></section>');
    var c = E.COURSES[level];
    function build() {
      var pool = [];
      ["grammar", "vocabulary", "listening"].forEach(function (k) {
        c[k].items.forEach(function (it) { pool.push(Object.assign({}, it, { tag: SK[k].name, color: SK[k].color })); });
      });
      return ui.shuffle(pool).slice(0, 10);
    }
    function go() {
      E.runner.start({
        root: document.getElementById("run"), items: build(),
        title: "Quiz \u00B7 " + level, tag: "Quiz", color: "purple", barColor: "purple", mode: "quiz", backHref: "#/quiz",
        record: function (res) { store.quizResult(level, res.score, res.total); store.addXP(30); return 30; },
        again: go,
        actions: function () {
          return [{ label: "Try another quiz", kind: "primary" }, { label: "See progress", href: "#/progress", kind: "secondary" }, { label: "Back to course", href: "#/course/" + level, kind: "secondary" }];
        },
      });
    }
    go();
  }

  /* ============================== PROGRESS ============================== */
  function progress() {
    var s = store.get(), days = store.lastDays(7), pct = store.goalPct();
    var scale = Math.max(s.goal, Math.max.apply(null, days.map(function (d) { return d.xp; })), 1);
    var overall = Math.round((store.totalDone() / 18) * 100);
    var stats = [
      ["bolt", "purple", s.xp, "Total XP"],
      ["fire", "orange", store.streak(), "Day streak"],
      ["check", "blue", store.accuracy() + "%", "Accuracy"],
      ["book", "purple", store.totalDone() + "/18", "Lessons completed"],
    ];
    mount(
      head("Progress", "Your learning progress", "See your scores, XP, daily goal, streak and achievements in one place.") +
      '<section class="section-tight"><div class="container">' +
      '<div class="grid grid-4 stats">' + stats.map(function (x) {
        return '<div class="card stat tone-' + x[1] + '">' + bubble(x[0], x[1]) + "<div><strong>" + x[2] + "</strong><span>" + x[3] + "</span></div></div>";
      }).join("") + "</div>" +

      '<div class="grid grid-2 gap-top"><div class="card"><h2 class="h3">' + icon("target") + " Daily goal</h2><div class=\"goal-row\">" +
        ui.ring(pct, 132, 12, pct >= 100 ? "var(--success)" : "var(--secondary)", "<strong>" + pct + "%</strong><span>" + store.todayXp() + "/" + s.goal + " XP</span>") +
        '<div><p class="muted">' + (pct >= 100 ? "You reached your goal today. Great work!" : "Earn " + Math.max(0, s.goal - store.todayXp()) + " more XP today to reach your goal.") + '</p><a class="btn btn-secondary btn-sm" href="#/profile">Change goal</a></div></div>' +
        '<h3 class="h4">This week</h3><div class="week" role="img" aria-label="XP earned in the last 7 days"><div class="week-plot">' +
        '<div class="goal-line" style="bottom:' + Math.round((s.goal / scale) * 100) + '%"><span>Goal ' + s.goal + " XP</span></div>" +
        days.map(function (d) {
          return '<div class="wcol' + (d.today ? " today" : "") + '"><span style="height:' + Math.max(d.xp ? 4 : 0, Math.round((d.xp / scale) * 100)) + '%"></span></div>';
        }).join("") + '</div><div class="week-labels">' +
        days.map(function (d) { return '<div class="wlab' + (d.today ? " today" : "") + '"><small>' + d.label + "</small><em>" + d.xp + "</em></div>"; }).join("") +
      "</div></div></div>" +

      '<div class="card"><h2 class="h3">' + icon("chart") + ' Course progress</h2><div class="overall">' + ui.ring(overall, 92, 10, "var(--primary)", "<strong>" + overall + "%</strong>") + '<p class="muted">Overall progress across all three levels.</p></div><ul class="lvl-prog">' +
        E.LEVEL_KEYS.map(function (l) {
          var d = store.lessonsDone(l);
          return '<li><div class="row-between"><a href="#/course/' + l + '">' + levelTag(l) + "</a><strong>" + d + "/6</strong></div>" + ui.bar((d / 6) * 100, L[l].color, l + " progress") + "</li>";
        }).join("") + "</ul></div></div>" +

      '<div class="card gap-top"><h2 class="h3">' + icon("book") + " Skills in " + levelTag(s.level) + '</h2><div class="grid grid-3 skill-prog">' +
        E.SKILL_KEYS.map(function (k) {
          var x = store.lesson(s.level, k), b = x ? x.best : 0;
          return '<a class="sp tone-' + SK[k].color + '" href="#/lesson/' + s.level + "/" + k + '">' + skillBubble(k) + '<div class="sp-body"><div class="row-between"><strong>' + SK[k].name + "</strong><span>" + b + "%</span></div>" + ui.bar(b, SK[k].color, SK[k].name + " best score") + "</div></a>";
        }).join("") + "</div></div>" +

      '<div class="card gap-top"><h2 class="h3">' + icon("trophy") + " Scores</h2>" +
        (s.test ? '<p class="score-line">' + icon("clipboard") + " Level test: <strong>" + s.test.score + "/" + s.test.total + "</strong> \u00B7 recommended " + levelTag(s.test.level) + ' <span class="muted">(' + s.test.date + ")</span></p>" : "") +
        (s.quizzes.length
          ? '<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Level</th><th>Score</th><th>Result</th></tr></thead><tbody>' + s.quizzes.slice(0, 8).map(function (q) {
            var p = Math.round((q.score / q.total) * 100);
            return "<tr><td>" + q.date + "</td><td>" + levelTag(q.level) + "</td><td>" + q.score + "/" + q.total + '</td><td><span class="score-pill ' + (p >= 80 ? "good" : p >= 50 ? "mid" : "low") + '">' + p + "%</span></td></tr>";
          }).join("") + "</tbody></table></div>"
          : '<p class="empty">No quiz scores yet. <a href="#/quiz">Take your first quiz</a>.</p>') + "</div>" +

      '<div class="card gap-top"><h2 class="h3">' + icon("medal") + " Achievements <small class=\"muted\">" + Object.keys(s.ach).length + "/" + E.ACHIEVEMENTS.length + "</small></h2><div class=\"grid grid-4 achs\">" +
        E.ACHIEVEMENTS.map(function (a) {
          var got = s.ach[a.id];
          return '<div class="ach tone-' + a.color + (got ? " got" : "") + '">' + bubble(got ? a.icon : "lock", got ? a.color : "blue") + "<div><strong>" + a.title + "</strong><span>" + a.desc + "</span>" + (got ? "<em>Unlocked " + got + "</em>" : "") + "</div></div>";
        }).join("") + "</div></div>" +
      "</div></section>"
    );
  }

  /* ============================== AUTH + PROFILE ============================== */
  function field(o) {
    return '<div class="field"><label for="' + o.id + '">' + o.label + '</label><input class="input" id="' + o.id + '" name="' + o.id + '" type="' + (o.type || "text") + '"' +
      (o.auto ? ' autocomplete="' + o.auto + '"' : "") + (o.value ? ' value="' + esc(o.value) + '"' : "") + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + ' aria-describedby="err-' + o.id + '"><p class="field-error" id="err-' + o.id + '" role="alert"></p></div>';
  }
  function showErrors(root, errors) {
    [].forEach.call(root.querySelectorAll(".field-error"), function (p) { p.textContent = ""; });
    [].forEach.call(root.querySelectorAll(".input, .textarea"), function (i) { i.removeAttribute("aria-invalid"); });
    var first = null;
    Object.keys(errors).forEach(function (k) {
      var p = root.querySelector("#err-" + k), i = root.querySelector("#" + k);
      if (p) p.textContent = errors[k];
      if (i) { i.setAttribute("aria-invalid", "true"); if (!first) first = i; }
    });
    if (first) first.focus();
  }

  function login() {
    if (E.auth.user()) { location.hash = "#/profile"; return; }
    mount(
      '<section class="auth"><div class="card auth-card"><h1 class="h2">Welcome back</h1><p class="muted">Log in to continue your learning.</p>' +
      '<form id="f" novalidate><p class="form-error" id="err-form" role="alert"></p>' + field({ id: "email", label: "Email", type: "email", auto: "email", ph: "you@example.com" }) + field({ id: "password", label: "Password", type: "password", auto: "current-password" }) +
      '<button class="btn btn-primary btn-block" type="submit">' + icon("login") + ' Log in</button></form><p class="muted center">New to Englify? <a href="#/signup">Create an account</a></p><p class="demo-note">' + icon("info") + " Demo accounts are saved only in this browser.</p></div></section>",
      function (root) {
        var form = root.querySelector("#f");
        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var r = E.auth.login({ email: form.email.value, password: form.password.value });
          if (!r.ok) { showErrors(root, r.errors); return; }
          ui.toast("Welcome back!", "ok"); location.hash = "#/profile";
        });
      }
    );
  }

  function signup() {
    if (E.auth.user()) { location.hash = "#/profile"; return; }
    var s = store.get();
    mount(
      '<section class="auth"><div class="card auth-card"><h1 class="h2">Create your account</h1><p class="muted">Save your progress and settings. It is free.</p>' +
      '<form id="f" novalidate>' + field({ id: "name", label: "Your name", auto: "name", ph: "Dara" }) + field({ id: "email", label: "Email", type: "email", auto: "email", ph: "you@example.com" }) +
      field({ id: "password", label: "Password (at least 6 characters)", type: "password", auto: "new-password" }) + field({ id: "confirm", label: "Confirm password", type: "password", auto: "new-password" }) +
      '<div class="field"><label for="level">Your level</label><select class="input" id="level" name="level">' + E.LEVEL_KEYS.map(function (l) { return '<option value="' + l + '"' + (l === s.level ? " selected" : "") + ">" + l + " " + L[l].name + "</option>"; }).join("") + "</select></div>" +
      '<button class="btn btn-primary btn-block" type="submit">' + icon("userPlus") + ' Sign up</button></form><p class="muted center">Already have an account? <a href="#/login">Log in</a></p><p class="demo-note">' + icon("info") + " Demo accounts are saved only in this browser. Your current guest progress will be kept.</p></div></section>",
      function (root) {
        var form = root.querySelector("#f");
        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var r = E.auth.signup({ name: form.name.value, email: form.email.value, password: form.password.value, confirm: form.confirm.value, level: form.level.value });
          if (!r.ok) { showErrors(root, r.errors); return; }
          ui.toast("Account created. Welcome to Englify!", "ok"); location.hash = "#/profile";
        });
      }
    );
  }

  function profile() {
    var u = E.auth.user(), s = store.get();
    var initials = u ? u.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase() : "G";
    var stats = [
      ["Total XP", s.xp], ["Day streak", store.streak()], ["Accuracy", store.accuracy() + "%"], ["Questions answered", s.answered],
      ["Lessons completed", store.totalDone() + "/18"], ["Quizzes taken", s.quizzes.length], ["Achievements", Object.keys(s.ach).length + "/" + E.ACHIEVEMENTS.length], ["Level test", s.test ? s.test.level : "Not taken"],
    ];
    mount(
      head("Profile", u ? "Hello, " + esc(u.name.split(" ")[0]) : "Your profile", u ? "Manage your account and learning preferences." : "You are learning as a guest. Create an account to keep your progress with your name.") +
      '<section class="section-tight"><div class="container"><div class="grid grid-2">' +
      '<div class="card"><div class="acct"><span class="avatar">' + initials + "</span><div>" +
        (u
          ? '<h2 class="h3">' + esc(u.name) + '</h2><p class="muted">' + esc(u.email) + "</p><p class=\"muted small\">Member since " + u.joined + "</p>"
          : '<h2 class="h3">Guest</h2><p class="muted">Progress is saved in this browser.</p>') + "</div></div>" +
        (u
          ? '<form id="nameForm" class="inline-form" novalidate><div class="field"><label for="dname">Display name</label><input class="input" id="dname" name="dname" value="' + esc(u.name) + '" autocomplete="name"><p class="field-error" id="err-dname" role="alert"></p></div><button class="btn btn-secondary" type="submit">Save name</button></form><button type="button" class="btn btn-ghost" id="logout">' + icon("logout") + " Log out</button>"
          : '<div class="row-gap"><a class="btn btn-primary" href="#/signup">' + icon("userPlus") + ' Sign up</a><a class="btn btn-secondary" href="#/login">' + icon("login") + " Log in</a></div>") + "</div>" +

      '<div class="card"><h2 class="h3">' + icon("cog") + " Learning preferences</h2>" +
        '<div class="field"><label for="plevel">Current level</label><select class="input" id="plevel">' + E.LEVEL_KEYS.map(function (l) { return '<option value="' + l + '"' + (l === s.level ? " selected" : "") + ">" + l + " " + L[l].name + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label for="pgoal">Daily goal</label><select class="input" id="pgoal">' + [30, 50, 100].map(function (g) { return '<option value="' + g + '"' + (g === s.goal ? " selected" : "") + ">" + g + " XP per day" + (g === 30 ? " (relaxed)" : g === 50 ? " (regular)" : " (serious)") + "</option>"; }).join("") + "</select></div>" +
        '<p class="muted small">Your level decides which course we suggest first. <a href="#/level-test">Not sure? Take the level test.</a></p></div></div>' +

      '<div class="card gap-top"><h2 class="h3">' + icon("chart") + " Statistics</h2><div class=\"grid grid-4 mini-stats\">" +
        stats.map(function (x) { return '<div class="mini"><strong>' + x[1] + "</strong><span>" + x[0] + "</span></div>"; }).join("") + "</div></div>" +

      '<div class="card gap-top danger-zone"><div><h2 class="h3">Reset progress</h2><p class="muted">Clear XP, streak, lessons, quizzes and achievements for this ' + (u ? "account" : "guest profile") + ". This cannot be undone.</p></div><button type=\"button\" class=\"btn btn-danger\" id=\"reset\">" + icon("redo") + " Reset progress</button></div>" +
      "</div></section>",
      function (root) {
        var lvl = root.querySelector("#plevel"), goal = root.querySelector("#pgoal");
        lvl.addEventListener("change", function () { store.setLevel(lvl.value); ui.toast("Level updated to " + lvl.value, "ok"); });
        goal.addEventListener("change", function () { store.setGoal(+goal.value); ui.toast("Daily goal set to " + goal.value + " XP", "ok"); });
        var lo = root.querySelector("#logout");
        if (lo) lo.addEventListener("click", function () { E.auth.logout(); ui.toast("You are logged out.", "ok"); location.hash = "#/"; });
        var nf = root.querySelector("#nameForm");
        if (nf) nf.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var v = nf.dname.value.trim();
          if (v.length < 2) { showErrors(root, { dname: "Please enter at least 2 letters." }); return; }
          E.auth.rename(v); ui.toast("Name saved", "ok"); profile();
        });
        // two-step confirm (no pop-up): press once to arm, press again within 5 seconds to reset
        var rb = root.querySelector("#reset"), armed = false, timer = null;
        rb.addEventListener("click", function () {
          if (!armed) {
            armed = true; rb.textContent = "Click again to confirm";
            timer = setTimeout(function () { armed = false; rb.innerHTML = icon("redo") + " Reset progress"; }, 5000);
            return;
          }
          clearTimeout(timer); store.reset(); ui.toast("Progress reset", "ok"); profile();
        });
      }
    );
  }

  /* ============================== ABOUT ============================== */
  function about() {
    var faq = [
      ["Is Englify free?", "Yes. Englify is a student project. There is no payment or subscription."],
      ["Do I need an account?", "No. You can learn as a guest and your progress is saved in this browser. An account only adds your name and lets several people share one device."],
      ["Where is my progress saved?", "In your browser on this device. If you clear your browser data, your progress is removed too."],
      ["What do A1, A2 and B1 mean?", "They are common levels of English. A1 is beginner, A2 is elementary and B1 is intermediate."],
      ["Which browser is best for audio and speaking?", "Listening audio works in most modern browsers. Speaking recognition works best in Chrome or Edge; other browsers use a simple self-check."],
    ];
    var team = [["Veasna Touch", "UI/UX and frontend development support", "blue"], ["Chantrea Bis", "Project coordination, content and frontend development support", "purple"], ["Sreymai Louern", "UI design, content, testing and frontend development support", "orange"]];
    mount(
      head("About", "About Englify", "Englify is a small web-based English learning website with short, interactive and structured activities.") +
      '<section class="section-tight"><div class="container"><div class="grid grid-3">' +
        '<article class="card feature">' + bubble("info", "blue", true) + "<h2 class=\"h3\">About Englify</h2><p>Students can choose an English level, study short lessons, complete exercises, take quizzes and see their progress. It is inspired by Duolingo, but Englify has its own content, interface and colors.</p></article>" +
        '<article class="card feature">' + bubble("target", "purple", true) + "<h2 class=\"h3\">Purpose</h2><p>To make English practice more accessible and easier to follow, and to guide learners from one activity to the next without unnecessary complexity.</p></article>" +
        '<article class="card feature">' + bubble("bulb", "orange", true) + "<h2 class=\"h3\">Learning approach</h2><p>Learn a little, practice right away, get instant feedback, take a quiz and track your progress. Small steps, big progress.</p></article></div>" +

      '<div class="section-head gap-top"><p class="eyebrow">Features</p><h2>What you can do on Englify</h2></div><div class="grid grid-4">' +
        [["layer", "blue", "3 levels", "A1, A2 and B1 courses with six lessons each."], ["clipboard", "purple", "Level test", "15 questions to find your level."], ["mic", "orange", "Listening and speaking", "Audio, read-aloud and self-check practice."], ["trophy", "blue", "XP and streaks", "Daily goal, streak and achievements."]].map(function (f) {
          return '<article class="card feature">' + bubble(f[0], f[1]) + "<h3>" + f[2] + "</h3><p>" + f[3] + "</p></article>";
        }).join("") + "</div>" +

      '<div class="grid grid-2 gap-top"><div><div class="section-head"><p class="eyebrow">FAQ</p><h2>Questions and answers</h2></div>' +
        faq.map(function (f) { return '<details class="faq"><summary>' + f[0] + icon("chevron") + "</summary><p>" + f[1] + "</p></details>"; }).join("") + "</div>" +
        '<div><div class="section-head"><p class="eyebrow">Contact</p><h2>Send us a message</h2></div><form class="card" id="contact" novalidate><div id="contactOk" class="form-ok" hidden></div>' +
          field({ id: "cname", label: "Your name", auto: "name" }) + field({ id: "cemail", label: "Email", type: "email", auto: "email" }) +
          '<div class="field"><label for="cmsg">Message</label><textarea class="textarea" id="cmsg" name="cmsg" rows="4"></textarea><p class="field-error" id="err-cmsg" role="alert"></p></div>' +
          '<button class="btn btn-primary" type="submit">' + icon("mail") + " Send message</button><p class=\"demo-note\">" + icon("info") + " This is a school project. Messages are not sent anywhere.</p></form></div></div>" +

      '<div class="section-head gap-top"><p class="eyebrow">Team</p><h2>Built by</h2></div><div class="grid grid-3">' +
        team.map(function (t) {
          return '<article class="card member tone-' + t[2] + '"><span class="avatar">' + t[0].split(" ").map(function (w) { return w.charAt(0); }).join("") + "</span><div><h3>" + t[0] + "</h3><p>" + t[1] + "</p></div></article>";
        }).join("") + "</div></div></section>",
      function (root) {
        var f = root.querySelector("#contact");
        f.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var errs = {};
          if (f.cname.value.trim().length < 2) errs.cname = "Please enter your name.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.cemail.value.trim())) errs.cemail = "Please enter a valid email address.";
          if (f.cmsg.value.trim().length < 10) errs.cmsg = "Please write at least 10 characters.";
          showErrors(root, errs);
          var ok = root.querySelector("#contactOk");
          if (Object.keys(errs).length) { ok.hidden = true; return; }
          ok.hidden = false; ok.textContent = "Thank you, " + f.cname.value.trim() + "! Your message looks good. (Demo form: nothing is sent.)";
          f.cname.value = ""; f.cemail.value = ""; f.cmsg.value = "";
        });
      }
    );
  }

  function notFound() {
    mount('<section class="auth"><div class="card auth-card center"><h1 class="h2">Page not found</h1><p class="muted">We could not find that page.</p><a class="btn btn-primary" href="#/">Go to Home</a></div></section>');
  }

  E.pages = { home: home, courses: courses, courseDetail: courseDetail, lesson: lesson, lessonPractice: lessonPractice, practiceHome: practiceHome, practiceRun: practiceRun, levelTest: levelTest, quizHome: quizHome, quizRun: quizRun, progress: progress, profile: profile, login: login, signup: signup, about: about, notFound: notFound };
})();
