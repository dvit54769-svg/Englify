/* =====================================================================
   Englify: exercise runner
   Shows one question at a time with instant feedback.
   Types: mc (multiple choice), type (typed answer), listen (audio + mc),
          speak (read aloud), write (short writing with word counter)
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});
  var ui = E.ui, esc = ui.esc, icon = ui.icon;
  var keyHandler = null, activeRec = null;

  function norm(s) { return String(s).trim().toLowerCase().replace(/[.!?,]+$/, "").replace(/\s+/g, " "); }
  function words(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
  function sentences(s) { return s.split(/[.!?]+/).filter(function (x) { return x.trim().length > 0; }).length; }
  function blankify(q) { return esc(q).replace(/___+/g, '<span class="blank" aria-label="blank"></span>'); }

  function stop() {
    if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
    if (activeRec) { activeRec.stop(); activeRec = null; }
    ui.speech.stop();
  }

  function start(o) {
    stop();
    var root = o.root, items = o.items, i = 0, score = 0, xp = 0, locked = false, recorded = false;
    var isTest = o.mode === "test";

    function count(ok, gain) {
      recorded = true;
      if (ok) score++;
      E.store.answered(ok);
      if (ok && gain && !isTest) { xp += gain; E.store.addXP(gain); }
    }

    function topHTML() {
      var pct = Math.round((i / items.length) * 100);
      return (
        '<div class="runner-top"><a class="btn btn-ghost btn-sm" href="' + o.backHref + '">' + icon("arrowLeft") + " Exit</a>" +
        '<div class="runner-prog"><div class="runner-meta"><strong>' + esc(o.title) + "</strong><span>Question " + (i + 1) + " of " + items.length + "</span></div>" +
        ui.bar(pct, o.barColor || "blue", "Progress") + "</div></div>"
      );
    }

    function optionsHTML(it) {
      return '<div class="options" role="group" aria-label="Answer choices">' + it.o.map(function (t, k) {
        return '<button type="button" class="option" data-k="' + k + '"><span class="opt-key">' + "ABCD".charAt(k) + '</span><span class="opt-text">' + esc(t) + "</span></button>";
      }).join("") + "</div>";
    }

    function correctText(it) {
      if (it.t === "mc" || it.t === "listen") return it.o[it.a];
      if (it.t === "type") return it.a[0];
      return "";
    }

    function feedback(ok, it, opts) {
      opts = opts || {};
      var fb = root.querySelector("#fb");
      fb.hidden = false;
      fb.className = "fb " + (ok ? "ok" : "bad");
      var head = opts.head || (ok ? "Correct!" : "Not quite.");
      var html = '<div class="fb-head">' + icon(ok ? "checkCircle" : "timesCircle") + "<strong>" + esc(head) + "</strong>" +
        (opts.gain ? '<span class="chip chip-xp">+' + opts.gain + " XP</span>" : "") + "</div>";
      if (!ok && !opts.noAnswer && correctText(it)) html += "<p>The correct answer is <strong>" + esc(correctText(it)) + "</strong>.</p>";
      if (opts.html) html += opts.html;
      if (it.e && !opts.noExplain) html += "<p>" + esc(it.e) + "</p>";
      if (it.t === "listen") html += '<p class="transcript"><strong>Transcript:</strong> \u201c' + esc(it.say) + "\u201d</p>";
      html += '<div class="fb-actions">';
      if (opts.retry) html += '<button type="button" class="btn btn-secondary" data-retry>' + icon("redo") + " Try again</button>";
      html += '<button type="button" class="btn btn-primary" data-next>' + (i === items.length - 1 ? "See results" : (opts.retry ? "Skip" : "Next question")) + " " + icon("arrowRight") + "</button></div>";
      fb.innerHTML = html;
      var nx = fb.querySelector("[data-next]");
      nx.addEventListener("click", next);
      var rt = fb.querySelector("[data-retry]");
      if (rt) rt.addEventListener("click", function () { render(true); });
      if (!opts.retry) { nx.focus(); }
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function next() {
      if (!recorded) count(false, 0);
      i++;
      if (i >= items.length) finish(); else render();
    }

    // ---------- question types ----------
    function bindOptions(it) {
      var btns = [].slice.call(root.querySelectorAll(".option"));
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          if (locked) return;
          locked = true;
          var k = +b.getAttribute("data-k"), ok = k === it.a;
          if (isTest) { b.classList.add("is-picked"); count(ok, 0); setTimeout(next, 300); return; }
          btns.forEach(function (x, n) { x.disabled = true; if (n === it.a) x.classList.add("is-correct"); else if (n === k) x.classList.add("is-wrong"); });
          count(ok, 10);
          feedback(ok, it, { gain: ok ? 10 : 0 });
        });
      });
    }

    function renderMC(it) {
      return '<h2 class="q-text">' + blankify(it.q) + "</h2>" + optionsHTML(it);
    }

    function renderListen(it) {
      var can = ui.speech.canSpeak;
      var audio = can
        ? '<div class="audio-card"><button type="button" class="btn btn-primary" data-play>' + icon("volume") + ' Play audio</button><button type="button" class="btn btn-secondary btn-sm" data-slow>Play slowly</button><small>Play it as many times as you like.</small></div>'
        : '<div class="audio-card"><p class="hint">Audio is not available in this browser, so read the transcript instead:</p><p class="say-text">\u201c' + esc(it.say) + "\u201d</p></div>";
      return audio + '<h2 class="q-text">' + blankify(it.q) + "</h2>" + optionsHTML(it);
    }

    function bindListen() {
      var p = root.querySelector("[data-play]"), s = root.querySelector("[data-slow]");
      if (p) p.addEventListener("click", function () { ui.speech.say(items[i].say, 0.95); });
      if (s) s.addEventListener("click", function () { ui.speech.say(items[i].say, 0.6); });
    }

    function renderType(it) {
      return '<h2 class="q-text">' + blankify(it.q) + '</h2><form class="type-form" id="typeForm" autocomplete="off"><label class="sr-only" for="ans">Your answer</label>' +
        '<input id="ans" class="input" type="text" placeholder="Type your answer" autocapitalize="none" spellcheck="false"><button type="submit" class="btn btn-primary">Check</button></form><p class="hint" id="typeHint"></p>';
    }

    function bindType(it) {
      var form = root.querySelector("#typeForm"), input = root.querySelector("#ans");
      input.focus();
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (locked) return;
        var v = norm(input.value);
        if (!v) { root.querySelector("#typeHint").textContent = "Type an answer first."; input.focus(); return; }
        locked = true;
        var ok = it.a.some(function (x) { return norm(x) === v; });
        input.disabled = true;
        form.querySelector("button").disabled = true;
        input.classList.add(ok ? "is-correct" : "is-wrong");
        if (isTest) { count(ok, 0); setTimeout(next, 300); return; }
        count(ok, 10);
        feedback(ok, it, { gain: ok ? 10 : 0 });
      });
    }

    function renderSpeak(it) {
      var can = ui.speech.canListen;
      return '<h2 class="q-text">Read this sentence aloud</h2><div class="say-card"><p class="say-text">\u201c' + esc(it.say) + "\u201d</p></div>" +
        '<div class="say-actions"><button type="button" class="btn btn-secondary" data-listen>' + icon("volume") + " Listen first</button>" +
        (can
          ? '<button type="button" class="btn btn-primary" data-rec>' + icon("mic") + ' Start speaking</button><button type="button" class="btn btn-ghost btn-sm" data-self>I can\u2019t use the microphone</button>'
          : '<button type="button" class="btn btn-primary" data-self>' + icon("check") + " I said it aloud</button>") +
        '</div><p class="hint" id="speakHint">' + (can ? "Allow microphone access when your browser asks. Speak clearly after pressing the button." : "Speech recognition is not available in this browser, so this is a self-check. Listen, say the sentence aloud, then press the button.") + "</p>";
    }

    function bindSpeak(it) {
      var hint = root.querySelector("#speakHint");
      var l = root.querySelector("[data-listen]"), r = root.querySelector("[data-rec]"), s = root.querySelector("[data-self]");
      if (l) l.addEventListener("click", function () { if (ui.speech.canSpeak) ui.speech.say(it.say, 0.9); else hint.textContent = "Audio is not available in this browser."; });
      if (s) s.addEventListener("click", function () {
        if (locked) return;
        locked = true; count(true, 5);
        feedback(true, it, { head: "Nice practice!", gain: 5, noExplain: true, html: "<p>This was a self-check. Say the sentence again to make it feel natural.</p>" });
      });
      if (r) r.addEventListener("click", function () {
        if (locked) return;
        r.disabled = true; r.classList.add("is-listening");
        r.innerHTML = icon("mic") + " Listening...";
        activeRec = ui.speech.listen(function (text) {
          var sim = ui.similarity(it.say, text), pct = Math.round(sim * 100);
          locked = true;
          activeRec = null;
          if (sim >= 0.7) {
            count(true, 10);
            feedback(true, it, { head: "Well said!", gain: 10, noExplain: true, html: "<p>We heard: \u201c" + esc(text) + "\u201d (" + pct + "% match)</p>" });
          } else {
            locked = false;
            feedback(false, it, { head: "Almost there.", noAnswer: true, noExplain: true, retry: true, html: "<p>We heard: \u201c" + esc(text) + "\u201d (" + pct + "% match). Try again more slowly.</p>" });
          }
        }, function (err) {
          activeRec = null;
          if (locked) return;
          r.disabled = false; r.classList.remove("is-listening");
          r.innerHTML = icon("mic") + " Start speaking";
          hint.textContent = err === "not-allowed" || err === "service-not-allowed"
            ? "Microphone access was blocked. Allow it in your browser, or use the self-check button."
            : "We could not hear you. Try again, or use the self-check button.";
        });
      });
    }

    function renderWrite(it) {
      return '<h2 class="q-text">' + esc(it.q) + "</h2>" + (it.tip ? '<p class="hint">' + esc(it.tip) + "</p>" : "") +
        '<label class="sr-only" for="wr">Your text</label><textarea id="wr" class="textarea" rows="7" placeholder="Write your answer here..."></textarea>' +
        '<div class="wr-meta"><span id="wc" class="chip">0 / ' + it.min + ' words</span></div>' +
        '<ul class="checks" id="checks"></ul><div class="wr-actions"><button type="button" class="btn btn-primary" id="wsubmit" disabled>Submit writing</button></div>';
    }

    function checksFor(text, min) {
      var t = text.trim(), n = words(t);
      return [
        { ok: n >= min, label: "At least " + min + " words (" + n + " so far)" },
        { ok: /^[A-Z]/.test(t), label: "Starts with a capital letter" },
        { ok: /[.!?]$/.test(t), label: "Ends with a period, question mark or exclamation mark" },
        { ok: sentences(t) >= 2, label: "Uses more than one sentence" },
      ];
    }

    function bindWrite(it) {
      var ta = root.querySelector("#wr"), wc = root.querySelector("#wc"), ul = root.querySelector("#checks"), btn = root.querySelector("#wsubmit");
      function update() {
        var n = words(ta.value), list = checksFor(ta.value, it.min);
        wc.textContent = n + " / " + it.min + " words";
        wc.classList.toggle("chip-ok", n >= it.min);
        ul.innerHTML = list.map(function (c) { return '<li class="' + (c.ok ? "ok" : "") + '">' + icon(c.ok ? "checkCircle" : "timesCircle") + "<span>" + esc(c.label) + "</span></li>"; }).join("");
        btn.disabled = n < it.min;
      }
      ta.addEventListener("input", update);
      update();
      btn.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        ta.disabled = true; btn.disabled = true;
        var list = checksFor(ta.value, it.min);
        var missing = list.filter(function (c) { return !c.ok; });
        count(true, 15);
        var msg = "<p>You wrote " + words(ta.value) + " words in " + sentences(ta.value) + " sentence" + (sentences(ta.value) === 1 ? "" : "s") + ".</p>";
        msg += missing.length
          ? "<p>To improve: " + missing.map(function (c) { return esc(c.label.toLowerCase()); }).join("; ") + ".</p>"
          : "<p>Great! Your text has a capital letter, end punctuation and more than one sentence.</p>";
        feedback(true, it, { head: "Writing submitted!", gain: 15, noExplain: true, html: msg });
      });
    }

    // ---------- render one question ----------
    function render(isRetry) {
      var it = items[i];
      locked = false;
      if (!isRetry) recorded = false;
      if (activeRec) { activeRec.stop(); activeRec = null; }
      ui.speech.stop();
      var body = it.t === "mc" ? renderMC(it) : it.t === "listen" ? renderListen(it) : it.t === "type" ? renderType(it) : it.t === "speak" ? renderSpeak(it) : renderWrite(it);
      var passage = o.passage ? '<aside class="passage card" aria-label="Reading text"><h3>' + icon("book") + " Read the text</h3><p>" + esc(o.passage) + "</p></aside>" : "";
      root.innerHTML = '<section class="runner">' + topHTML() + passage +
        '<div class="q-card card">' + '<div class="q-skill"><span class="tag tag-' + (it.color || o.color || "blue") + '">' + esc(it.tag || o.tag || "") + "</span></div>" + body + "</div>" +
        '<div id="fb" class="fb" hidden aria-live="polite"></div></section>';
      if (it.t === "mc") bindOptions(it);
      else if (it.t === "listen") { bindOptions(it); bindListen(); }
      else if (it.t === "type") bindType(it);
      else if (it.t === "speak") bindSpeak(it);
      else bindWrite(it);
      if (!isRetry) window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ---------- results ----------
    function finish() {
      var pct = Math.round((score / items.length) * 100);
      var res = { score: score, total: items.length, pct: pct, xp: xp };
      if (o.record) { var bonus = o.record(res) || 0; res.xp += bonus; }
      if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
      if (o.renderResult) {
        root.innerHTML = o.renderResult(res);
        if (o.afterResult) o.afterResult(root, res);
      } else {
        var msg = pct >= 90 ? "Excellent work!" : pct >= 70 ? "Great job!" : pct >= 50 ? "Good effort. Keep practicing!" : "Keep going! Review the lesson and try again.";
        var color = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--accent)" : "var(--primary)";
        var acts = (o.actions ? o.actions(res) : []).map(function (a) {
          return a.href
            ? '<a class="btn ' + (a.kind === "secondary" ? "btn-secondary" : "btn-primary") + '" href="' + a.href + '">' + esc(a.label) + " " + icon("arrowRight") + "</a>"
            : '<button type="button" class="btn ' + (a.kind === "secondary" ? "btn-secondary" : "btn-primary") + '" data-again>' + icon("redo") + " " + esc(a.label) + "</button>";
        }).join("");
        root.innerHTML = '<section class="result card"><div class="result-grid">' +
          ui.ring(pct, 168, 14, color, '<strong class="ring-big">' + pct + '%</strong><span>' + res.score + "/" + res.total + "</span>") +
          '<div><p class="eyebrow">' + esc(o.title) + "</p><h2>" + msg + "</h2><p class=\"lead\">You answered " + res.score + " of " + res.total + " correctly.</p>" +
          '<div class="chips"><span class="chip chip-xp">' + icon("bolt") + " +" + res.xp + " XP earned</span></div>" +
          '<div class="result-actions">' + acts + "</div></div></div></section>";
        var again = root.querySelector("[data-again]");
        if (again && o.again) again.addEventListener("click", o.again);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // keyboard shortcuts: A-D or 1-4 pick an option, Enter goes on
    keyHandler = function (ev) {
      if (ev.target && /^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
      var k = ev.key.toLowerCase(), idx = "abcd".indexOf(k);
      if (idx < 0 && /^[1-4]$/.test(k)) idx = +k - 1;
      if (idx > -1) {
        var b = root.querySelectorAll(".option")[idx];
        if (b && !b.disabled) { b.click(); ev.preventDefault(); }
      }
    };
    document.addEventListener("keydown", keyHandler);

    render();
  }

  E.runner = { start: start, stop: stop };
})();
