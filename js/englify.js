/* Englify: the only JavaScript on the site (small on purpose).
   Multiple-choice feedback and all animations are CSS (see scss/_motion.scss).
   This file does five small jobs:
   1. play audio   2. check typed answers   3. show the score
   4. save the best score in this browser   5. fill the Progress page
   and two small polish jobs:
   6. header shadow on scroll   7. fade blocks in as they scroll into view */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var KEY = "englify:best:";

  function save(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  function load(k) { try { return JSON.parse(localStorage.getItem(KEY + k)); } catch (e) { return null; } }
  function norm(s) { return s.trim().toLowerCase().replace(/[.!?,]+$/, "").replace(/\s+/g, " "); }

  /* 1. audio (browser text-to-speech) */
  var canSpeak = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  $$("[data-say]").forEach(function (b) {
    if (!canSpeak) { b.hidden = true; return; }
    b.addEventListener("click", function () {
      var u = new SpeechSynthesisUtterance(b.getAttribute("data-say"));
      u.lang = "en-US"; u.rate = Number(b.getAttribute("data-rate")) || 1;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    });
  });

  /* 2. typed answers: check when the learner presses Enter or leaves the box */
  $$("input[data-answers]").forEach(function (input) {
    input.addEventListener("change", function () {
      if (!input.value.trim()) return;
      var ok = JSON.parse(input.getAttribute("data-answers")).some(function (a) { return norm(a) === norm(input.value); });
      var card = input.closest(".q");
      input.classList.toggle("is-correct", ok);
      input.classList.toggle("is-wrong", !ok);
      $(".fb.ok", card).classList.toggle("show", ok);
      $(".fb.bad", card).classList.toggle("show", !ok);
    });
  });

  /* 3 + 4. score button (lesson, quiz and level test) */
  var btn = $("[data-score]"), page = document.body.getAttribute("data-page");
  if (btn) btn.addEventListener("click", function () {
    var qs = $$(".q[data-scored]"), right = 0, blank = 0;
    qs.forEach(function (q) {
      var typed = $("input[data-answers]", q);
      if (typed) { if (!typed.value.trim()) blank++; else if (typed.classList.contains("is-correct")) right++; }
      else if (!$("input:checked", q)) blank++;
      else if ($("input[data-right]:checked", q)) right++;
    });
    var box = $("#score"), total = qs.length, pct = Math.round((right / total) * 100), html;
    if (blank) {
      html = "<h2 class=\"h3\">Almost there</h2><p>You have " + blank + " unanswered question" + (blank > 1 ? "s" : "") + ". Answer them all, then check again.</p>";
    } else if (btn.getAttribute("data-score") === "test") {
      var lvl = right <= 6 ? "A1" : right <= 11 ? "A2" : "B1";
      save("level-test", { score: right, total: total, level: lvl });
      html = "<p class=\"eyebrow\">Your recommended level</p><h2>" + lvl + "</h2><p class=\"lead\">You scored " + right + " of " + total + ".</p>" +
        "<div class=\"result-actions\"><a class=\"btn btn-primary\" href=\"course-" + lvl.toLowerCase() + ".html\">Start the " + lvl + " course</a></div>";
    } else {
      var best = load(page) || 0;
      if (pct > best) { best = pct; save(page, pct); }
      html = "<p class=\"eyebrow\">Your score</p><h2>" + right + " of " + total + " (" + pct + "%)</h2><p class=\"lead\">" +
        (pct >= 80 ? "Great work!" : pct >= 60 ? "Good job. Review the notes and try to beat your score." : "Keep going. Read the lesson notes again and try once more.") +
        "</p><p class=\"muted\">Best score: " + best + "%</p>";
    }
    box.innerHTML = html; box.hidden = false;
    box.style.animation = "none"; void box.offsetWidth; box.style.animation = ""; /* replay the pop-in on every check */
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* 5. progress page */
  if (page === "progress") {
    var done = 0;
    $$("[data-best]").forEach(function (td) {
      var v = load(td.getAttribute("data-best"));
      if (typeof v === "number") {
        td.textContent = v + "%" + (v >= 60 ? " \u2713" : "");
        if (v >= 60 && td.getAttribute("data-best").indexOf("lesson-") === 0) done++;
      }
    });
    $("#doneCount").textContent = done;
    var t = load("level-test");
    if (t) $("#testResult").textContent = t.level + " (" + t.score + "/" + t.total + ")";
    $("[data-reset]").addEventListener("click", function () {
      if (!confirm("Clear all saved scores?")) return;
      try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(KEY) === 0) localStorage.removeItem(k); }); } catch (e) { /* ignore */ }
      location.reload();
    });
  }

  /* 6. header shadow: appears once the page has scrolled a little */
  var head = $(".site-header");
  if (head) {
    var queued = false;
    var onScroll = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { head.classList.toggle("is-scrolled", window.scrollY > 4); queued = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 7. fade blocks in as they scroll into view. Only blocks below the fold are
     touched, and nothing is hidden if the browser can't observe scrolling or
     the visitor asked for reduced motion. */
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var main = $("main");
  if (main && !calm && "IntersectionObserver" in window) {
    var SEL = ".card:not(.score-card), .feature, .step, .section-head, .cta-band, .faq, .member, .table-wrap";
    var blocks = $$(SEL, main).filter(function (el) {
      return !el.hidden && !el.parentElement.closest(SEL) && el.getBoundingClientRect().top > window.innerHeight * 0.92;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        el.classList.add("rv-in");
        /* clean up afterwards so hover effects on cards work as normal */
        setTimeout(function () { el.classList.remove("rv", "rv-in"); el.style.removeProperty("--rv-d"); }, 1100);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    blocks.forEach(function (el) {
      var mates = blocks.filter(function (b) { return b.parentElement === el.parentElement; });
      el.style.setProperty("--rv-d", (mates.indexOf(el) % 3) * 0.07 + "s"); /* small stagger inside a row of cards */
      el.classList.add("rv");
      io.observe(el);
    });
  }
})();
