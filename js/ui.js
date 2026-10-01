/* =====================================================================
   Englify: UI helpers (icons, toasts, progress ring, speech)
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // inline SVG icon (decorative by default)
  function icon(name, cls) {
    var d = E.ICONS[name];
    if (!d) return "";
    return '<svg class="i ' + (cls || "") + '" viewBox="' + d[0] + '" fill="currentColor" aria-hidden="true" focusable="false">' + d[1] + "</svg>";
  }

  // circular progress ring (SVG)
  function ring(pct, size, stroke, color, inner) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
    return (
      '<div class="ring" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--ring-track)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>' +
      '<div class="ring-inner">' + (inner || "") + "</div></div>"
    );
  }

  function bar(pct, color, label) {
    return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"' + (label ? ' aria-label="' + esc(label) + '"' : "") + '><span class="fill-' + (color || "blue") + '" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span></div>';
  }

  // toast messages (XP, achievements, info)
  function toast(msg, kind) {
    var box = document.getElementById("toasts");
    if (!box) return;
    var el = document.createElement("div");
    el.className = "toast toast-" + (kind || "info");
    var ic = kind === "xp" ? "bolt" : kind === "ach" ? "trophy" : kind === "error" ? "timesCircle" : "checkCircle";
    el.innerHTML = icon(ic) + "<span>" + esc(msg) + "</span>";
    box.appendChild(el);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { el.classList.add("out"); }, 2200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2700);
  }

  // ---------- speech: listening audio + speaking practice ----------
  var speech = {
    canSpeak: typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined",
    canListen: typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    say: function (text, rate, onEnd) {
      if (!speech.canSpeak) { if (onEnd) onEnd(); return; }
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = rate || 1;
        var voices = window.speechSynthesis.getVoices() || [];
        var v = voices.filter(function (x) { return /^en/i.test(x.lang); })[0];
        if (v) u.voice = v;
        u.onend = function () { if (onEnd) onEnd(); };
        u.onerror = function () { if (onEnd) onEnd(); };
        window.speechSynthesis.speak(u);
      } catch (e) { if (onEnd) onEnd(); }
    },
    stop: function () { try { if (speech.canSpeak) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } },
    // returns a controller with .stop(); callbacks: onResult(text), onEnd(error)
    listen: function (onResult, onEnd) {
      var R = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!R) { onEnd("unsupported"); return { stop: function () {} }; }
      var rec = new R(), got = false;
      rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = function (ev) { got = true; onResult(ev.results[0][0].transcript); };
      rec.onerror = function (ev) { onEnd(ev.error || "error"); };
      rec.onend = function () { if (!got) onEnd("none"); else onEnd(null); };
      try { rec.start(); } catch (e) { onEnd("error"); }
      return { stop: function () { try { rec.stop(); } catch (e) { /* ignore */ } } };
    },
  };
  if (speech.canSpeak) { try { window.speechSynthesis.getVoices(); } catch (e) { /* ignore */ } }

  // how close is what you said to the target sentence (0 to 1)
  function similarity(target, said) {
    function words(s) { return s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean); }
    var t = words(target), s = words(said), pool = s.slice(), hit = 0;
    t.forEach(function (w) { var i = pool.indexOf(w); if (i > -1) { hit++; pool.splice(i, 1); } });
    return t.length ? hit / t.length : 0;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  E.ui = { esc: esc, icon: icon, ring: ring, bar: bar, toast: toast, speech: speech, similarity: similarity, shuffle: shuffle };
})();
