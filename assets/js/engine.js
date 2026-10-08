// Router + physics engine: scroll reveal, custom cursor, magnetic buttons,
// tilt/glare, marquee, the WebGL "glass" hero shader, and the flagship /
// accordion / contact-form interactions. Ported from the Claude Design
// export's Component class, with React state replaced by direct DOM writes.
(function () {
  "use strict";
  var A = window.__APP, SD = A.SD, S = window.__SCREENS, state = A.state;
  var clamp01 = A.clamp01, smooth = A.smooth, pad = A.pad;
  var root = document.getElementById("app");
  var refs = {};

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function collectRefs() {
    refs = {};
    $$("[data-ref]").forEach(function (el) { refs[el.dataset.ref] = el; });
  }

  function titleFor() {
    var c = A.caseObj() || A.projObj();
    return c ? c.title + " — Aditi Tiwari" : SD.TITLES.home;
  }

  function screenHTML() {
    var sec = state.route.split("/")[0];
    if (sec === "work") return S.workHTML();
    if (sec === "how") return S.howHTML();
    if (sec === "about") return S.aboutHTML();
    if (sec === "contact") return S.contactHTML();
    if (sec === "case") { var cf = A.caseObj(); if (cf) return S.caseHTML(cf); state.route = "home"; return S.homeHTML(); }
    if (sec === "project") { var pf = A.projObj(); if (pf) return S.projectHTML(pf); state.route = "home"; return S.homeHTML(); }
    return S.homeHTML();
  }

  var vwEls = [];
  function render() {
    root.innerHTML = screenHTML();
    collectRefs();
    document.title = SD.TITLES[state.route.split("/")[0]] || titleFor();
    vwEls = $$("[data-vw]");
    setupReveals();
    initGL();
    placeInd(A.navActive());
    tickClock();
    applyFxState();
    setTimeout(revealVisible, 1500);
  }

  // ---------------------------------------------------------------------
  // Nav pill indicator
  // ---------------------------------------------------------------------
  function placeInd(key) {
    var row = refs.navRow, ind = refs.navInd;
    if (!row || !ind) return;
    var el = key ? row.querySelector('[data-nav="' + key + '"]') : null;
    if (!el) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.width = el.offsetWidth + "px";
    ind.style.transform = "translateX(" + el.offsetLeft + "px)";
  }

  // ---------------------------------------------------------------------
  // Clock
  // ---------------------------------------------------------------------
  function tickClock() {
    var t;
    try { t = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) + " IST"; } catch (e) { t = ""; }
    if (refs.clock) refs.clock.textContent = "Mandi, IN · " + t;
    if (refs.contactClock) refs.contactClock.textContent = "Mandi · " + t;
  }
  setInterval(tickClock, 20000);

  // ---------------------------------------------------------------------
  // Scroll-reveal (word / glass / clip / up)
  // ---------------------------------------------------------------------
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function setupReveals() {
    var red = reduced();
    $$("[data-reveal]").forEach(function (el) {
      if (el.dataset.rvd) return; el.dataset.rvd = "1";
      if (red) { el._shown = true; return; }
      var t = el.dataset.reveal, d = +(el.dataset.d || 0), ease = "cubic-bezier(.16,1,.3,1)";
      if (t === "word") { el.style.transform = "translateY(105%) rotate(4deg)"; el.style.transition = "transform 1.1s " + ease + " " + (d + 120) + "ms"; }
      else if (t === "glass") { el.style.transition = "opacity 1.6s " + ease + " " + (d + 500) + "ms"; }
      else if (t === "clip") { el.style.clipPath = "inset(8% 8% 8% 8% round 28px)"; el.style.transition = "clip-path 1.2s " + ease + " " + d + "ms"; }
      else { el.style.opacity = "0"; el.style.transform = "translateY(36px)"; el.style.filter = "blur(8px)"; el.style.transition = "opacity .9s " + ease + " " + d + "ms, transform 1s " + ease + " " + d + "ms, filter .9s " + ease + " " + d + "ms"; }
      io.observe(el);
    });
    $$("[data-count]").forEach(function (el) { if (!el.dataset.cnt) { el.dataset.cnt = "1"; if (!red) io.observe(el); } });
  }
  function revealVisible() {
    var H = window.innerHeight;
    $$("[data-rvd]").forEach(function (el) {
      if (el._shown) return;
      var r = el.getBoundingClientRect();
      if (r.top < H && r.bottom > 0) { show(el); io.unobserve(el); }
    });
  }
  function show(el) {
    el._shown = true;
    if (el.dataset.reveal) {
      if (el.dataset.reveal === "clip") el.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
      else if (el.dataset.reveal === "glass") el.style.opacity = "0";
      else { el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "none"; }
    }
    if (el.dataset.count !== undefined && !el._counted) {
      el._counted = true;
      var m = el.textContent.match(/^([^\d]*)(\d+)(.*)$/); if (!m) return;
      var end = +m[2], dur = 1400;
      setTimeout(function () {
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
          el.textContent = m[1] + Math.round(end * e) + m[3];
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      }, 300);
    }
  }

  // ---------------------------------------------------------------------
  // Cursor / magnetic buttons / tilt+glare
  // ---------------------------------------------------------------------
  var mouse = { x: innerWidth / 2, y: innerHeight / 2, t: 0, moved: false };
  var fine = window.matchMedia("(pointer: fine)").matches;
  var cx = mouse.x, cy = mouse.y, magEl = null, tiltEl = null;

  function onMove(x, y) {
    mouse.x = x; mouse.y = y; mouse.t = performance.now(); mouse.moved = true;
    if (refs.preview) refs.preview.style.transform = "translate(" + (x + 28) + "px, " + (y - 90) + "px)";
    if (magEl) {
      var r = magEl.getBoundingClientRect();
      magEl.style.transform = "translate(" + ((x - r.left - r.width / 2) * 0.25) + "px, " + ((y - r.top - r.height / 2) * 0.35) + "px)";
    }
    if (tiltEl) {
      var tr = tiltEl.getBoundingClientRect(), px = (x - tr.left) / tr.width - 0.5, py = (y - tr.top) / tr.height - 0.5;
      tiltEl.style.transform = "perspective(900px) rotateX(" + (-py * 12) + "deg) rotateY(" + (px * 14) + "deg) scale(1.02)";
      var g = tiltEl.querySelector("[data-glare]");
      if (g) { g.style.opacity = "1"; g.style.background = "radial-gradient(circle at " + ((px + 0.5) * 100) + "% " + ((py + 0.5) * 100) + "%, rgba(255,255,255,.5), rgba(255,255,255,0) 55%)"; }
    }
  }
  function onOver(e) {
    var tg = e.target; if (!tg || !tg.closest) return;
    var t = tg.closest("[data-cursor]"), lab = t ? t.dataset.cursor : "", c = refs.cursor;
    if (c) {
      var big = !!lab;
      c.style.width = big ? "84px" : "10px"; c.style.height = big ? "84px" : "10px";
      c.style.margin = big ? "-42px 0 0 -42px" : "-5px 0 0 -5px";
    }
    if (refs.cursorLabel) refs.cursorLabel.textContent = lab || "";
    var mg = tg.closest("[data-magnetic]");
    if (mg !== magEl) { if (magEl) magEl.style.transform = ""; magEl = mg; }
    var tl = tg.closest("[data-tilt]");
    if (tl !== tiltEl) {
      if (tiltEl) { tiltEl.style.transform = ""; var og = tiltEl.querySelector("[data-glare]"); if (og) og.style.opacity = "0"; var gs = tiltEl.querySelector("[data-glass]"); if (gs) gs.style.opacity = ""; }
      tiltEl = tl;
      if (tl) { var gs2 = tl.querySelector("[data-glass]"); if (gs2) gs2.style.opacity = "0"; }
    }
    // hover-driven actions
    var hv = tg.closest("[data-hover-act]");
    if (hv) {
      var act = hv.dataset.hoverAct;
      if (act === "nav-enter") placeInd(hv.dataset.hoverKey);
      else if (act === "fx-enter") { if (state.wide) setActive(+hv.dataset.hoverKey); }
      else if (act === "work-enter") updatePreview({ title: hv.dataset.hoverTitle, domain: hv.dataset.hoverDomain, metric: hv.dataset.hoverMetric });
      else if (act === "q-hover") { if (state.wide) { state.openQ = +hv.dataset.hoverKey; applyAccordionState(); } }
    }
  }
  window.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener("touchstart", function (e) { var t = e.touches && e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; mouse.t = performance.now(); } }, { passive: true });
  window.addEventListener("touchmove", function (e) { var t = e.touches && e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; mouse.t = performance.now(); } }, { passive: true });
  window.addEventListener("mouseover", onOver);
  if (fine && refs.cursor) refs.cursor.style.display = "flex";

  // ---------------------------------------------------------------------
  // Flagship panel hover-expand (direct DOM update, no re-render — keeps
  // the CSS `transition: flex .85s` animating smoothly).
  // ---------------------------------------------------------------------
  function setActive(i) { if (state.active !== i) { state.active = i; applyFxState(); } }
  function applyFxState() {
    if (state.route !== "home") return;
    var flagships = A.flagshipsScope();
    var fx = A.fxScope(flagships, state.active);
    fx.forEach(function (f, i) {
      var el = refs["fx-" + i]; if (!el) return;
      el.style.flex = f.grow; el.style.height = f.h; el.dataset.cursor = f.cursor;
      var scaleEl = el.children[0]; if (scaleEl) scaleEl.style.transform = "scale(" + f.scale + ")";
      var fluteEl = el.children[2]; if (fluteEl) fluteEl.style.opacity = f.flute;
      var wideFace = el.querySelector('[data-face="wide"]'); if (wideFace) wideFace.style.opacity = f.closedOp;
      var narrowFace = el.querySelector('[data-face="narrow"]'); if (narrowFace) narrowFace.style.opacity = f.closedOp;
      var kicker = el.children[4]; if (kicker) kicker.style.opacity = f.openOp;
      var panel = el.children[5];
      if (panel) { panel.style.opacity = f.openOp; panel.style.transform = "translateY(" + f.openY + ")"; }
    });
  }

  // ---------------------------------------------------------------------
  // Work-index hover preview tooltip
  // ---------------------------------------------------------------------
  function updatePreview(hv) {
    if (!refs.preview) return;
    refs.preview.style.opacity = hv ? "1" : "0";
    refs.preview.style.scale = hv ? "1" : ".85";
    if (hv) {
      if (refs.previewDomain) refs.previewDomain.textContent = hv.domain || "";
      if (refs.previewTitle) refs.previewTitle.textContent = hv.title || "";
      if (refs.previewMetric) refs.previewMetric.textContent = hv.metric || "";
    }
  }

  // ---------------------------------------------------------------------
  // How-I-work accordion (direct DOM update so grid-rows / rotate animate)
  // ---------------------------------------------------------------------
  function applyAccordionState() {
    if (state.route !== "how") return;
    $$('[data-act="toggle-q"]').forEach(function (row, i) {
      var open = state.openQ === i;
      var num = row.children[0].children[0];
      var plus = row.children[0].children[2];
      var rowsWrap = row.children[1];
      num.style.color = open ? "#D64A1B" : "#010101";
      plus.style.transform = "rotate(" + (open ? "45deg" : "0deg") + ")";
      rowsWrap.style.gridTemplateRows = open ? "1fr" : "0fr";
    });
  }

  // ---------------------------------------------------------------------
  // Home "quick match" hire selector
  // ---------------------------------------------------------------------
  function applyHireState() {
    $$('[data-act="pick-hire"]').forEach(function (btn) {
      var i = +btn.dataset.i, active = i === state.hire;
      btn.style.background = active ? "#010101" : "#FFFFFF";
      btn.style.color = active ? "#FFFFFF" : "#010101";
    });
    var s = SD.HIRE[state.hire];
    if (refs.hireBig) refs.hireBig.textContent = s[1];
    if (refs.hireProject) refs.hireProject.textContent = s[2];
    if (refs.hireLine) refs.hireLine.textContent = s[3];
    if (refs.hireSel && refs.hireSel.animate && !reduced()) {
      refs.hireSel.animate([{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 550, easing: "cubic-bezier(.16,1,.3,1)" });
    }
  }

  // ---------------------------------------------------------------------
  // Contact: role picker / copy email / submit
  // ---------------------------------------------------------------------
  function applyRoleState() {
    $$('[data-act="pick-role"]').forEach(function (btn) {
      var i = +btn.dataset.i, active = i === state.role;
      btn.style.borderColor = active ? "#D64A1B" : "rgba(255,255,255,.35)";
      btn.style.background = active ? "#D64A1B" : "transparent";
    });
  }
  var copyTimer;
  function copyEmail() {
    try { navigator.clipboard.writeText("taditi555@gmail.com"); } catch (e) {}
    state.copied = true;
    if (refs.copyLabel) refs.copyLabel.textContent = "Copied";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () { state.copied = false; if (refs.copyLabel) refs.copyLabel.textContent = "Copy"; }, 1800);
  }
  function submitContact() {
    state.sent = true;
    if (refs.contactFormWrap) {
      refs.contactFormWrap.innerHTML = '<div style="min-height:300px;display:flex;flex-direction:column;justify-content:center;gap:18px"><span style="width:56px;height:56px;border-radius:50%;background:#D64A1B;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:24px">✓</span><p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(28px,3vw,42px);line-height:1.1">Thanks — I\'ll get back to you within two working days.</p></div>';
    }
  }

  // ---------------------------------------------------------------------
  // Click / submit delegation
  // ---------------------------------------------------------------------
  root.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]"); if (!el) return;
    var act = el.dataset.act;
    if (act === "go") { e.preventDefault(); go(el.dataset.route); }
    else if (act === "scroll-work") { scrollWork(); }
    else if (act === "to-top") { window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (act === "pick-hire") { state.hire = +el.dataset.i; applyHireState(); }
    else if (act === "go-hire-sel") { go(SD.HIRE[state.hire][4]); }
    else if (act === "fx-click") { var i = +el.dataset.i; if (state.active === i) go("case/" + SD.FLAG[i].id); else setActive(i); }
    else if (act === "toggle-q") { var qi = +el.dataset.i; state.openQ = state.openQ === qi ? -1 : qi; applyAccordionState(); }
    else if (act === "pick-role") { state.role = +el.dataset.i; applyRoleState(); }
    else if (act === "copy-email") { copyEmail(); }
  });
  root.addEventListener("submit", function (e) {
    if (e.target.closest && e.target.closest('[data-act="submit-contact"]')) { e.preventDefault(); submitContact(); }
  });

  // nav / work-list mouseleave (re-attached on every render)
  function wireLeaveListeners() {
    if (refs.nav) refs.nav.addEventListener("mouseleave", function () { placeInd(A.navActive()); });
    if (state.route === "work") {
      var list = root.querySelector("main");
      if (list) list.addEventListener("mouseleave", function (e) { if (!e.relatedTarget || !root.contains(e.relatedTarget)) updatePreview(null); });
    }
  }

  // ---------------------------------------------------------------------
  // Page-transition flute overlay + routing
  // ---------------------------------------------------------------------
  function go(route) {
    if (route === state.route) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    var obj = SD.CASES.filter(function (f) { return "case/" + f.id === route; })[0] || SD.SUP.filter(function (s) { return "project/" + s.id === route; })[0];
    var label = obj ? obj.title : (SD.LABELS[route.split("/")[0]] || "");
    function commit() {
      state.route = route; state.hover = null;
      render(); wireLeaveListeners();
      window.scrollTo(0, 0);
      try { history.pushState(null, "", "#/" + (route === "home" ? "" : route)); } catch (e) {}
    }
    var ov = refs.overlay;
    if (!ov || reduced() || !ov.animate) { commit(); return; }
    var strips = $$("[data-flute]", ov);
    if (refs.ovlabelText) refs.ovlabelText.textContent = label;
    var ease = "cubic-bezier(.76,0,.24,1)";
    var ins = strips.map(function (s, i) {
      return s.animate([{ transform: "scaleY(0)", transformOrigin: "50% 100%" }, { transform: "scaleY(1)", transformOrigin: "50% 100%" }], { duration: 520, delay: i * 30, easing: ease, fill: "forwards" });
    });
    var lab = refs.ovlabel;
    if (lab && lab.animate) lab.animate([{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 320, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
    Promise.all(ins.map(function (a) { return a.finished; })).then(function () {
      commit();
      setTimeout(function () {
        strips.forEach(function (s, i) {
          s.animate([{ transform: "scaleY(1)", transformOrigin: "50% 0%" }, { transform: "scaleY(0)", transformOrigin: "50% 0%" }], { duration: 600, delay: (strips.length - 1 - i) * 30, easing: ease, fill: "forwards" });
        });
        if (refs.ovlabel && refs.ovlabel.animate) refs.ovlabel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
      }, 160);
    });
  }
  function scrollWork() {
    var cb = refs.cube; if (cb) window.scrollTo({ top: cb.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  }
  window.addEventListener("popstate", function () {
    var h = (location.hash || "").replace(/^#\/?/, "");
    state.route = h || "home"; state.hover = null;
    render(); wireLeaveListeners();
    window.scrollTo(0, 0);
  });

  // ---------------------------------------------------------------------
  // WebGL "glass" hero shader
  // ---------------------------------------------------------------------
  var gl = null, glCanvas = null, glU = null, glProgram, glDisabled = false, glSlow = 0;
  var sceneCanvas = document.createElement("canvas"), sceneCtx = sceneCanvas.getContext("2d");
  var lens = { x: innerWidth * 0.7, y: innerHeight * 0.45, r: 0 };

  function initGL() {
    var cv = refs.gl; if (!cv || cv === glCanvas) return; glCanvas = cv;
    gl = null; glSlow = 0; if (glDisabled) return;
    try { gl = cv.getContext("webgl", { antialias: false, premultipliedAlpha: false }); } catch (e) {}
    if (!gl) return;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, SD.VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, SD.FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { gl = null; return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    function u(n) { return gl.getUniformLocation(pr, n); }
    glU = { mouse: u("u_mouse"), r: u("u_r"), n: u("u_n"), s: u("u_s"), t: u("u_t") };
  }
  function pal() {
    var r = state.route, k = r.indexOf("case/") === 0 ? r.slice(5) : (r.indexOf("project/") === 0 ? "project" : r);
    return SD.PALS[k] || SD.PALS.home;
  }
  function drawScene(t, e) {
    var c = sceneCtx, W = sceneCanvas.width, H = sceneCanvas.height; if (!W || !H) return;
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, W, H);
    var wide = W / H > 1.1, m = Math.min(W, H), cx2 = (wide ? 0.72 : 0.5) * W, cy2 = (wide ? 0.46 : 0.3) * H, last = SD.BLOBS.length - 1;
    var P = pal();
    SD.BLOBS.forEach(function (b, i) {
      var k = 1 - e, main = i === last;
      var x = cx2 + (b[2] + 0.05 * Math.sin(t * b[4] + b[5])) * m * 1.5 * k, y = cy2 + (b[3] + 0.05 * Math.cos(t * b[4] * 1.3 + b[5])) * m * 1.5 * k;
      var rr = main ? m * (b[1] * (1 - e) + 0.12 * e) : m * b[1] * (1 - e * 0.6), a = main ? 1 : 1 - e;
      if (a <= 0.01 || rr <= 0) return;
      var RGB = P[i], hard = main ? 0.25 + 0.73 * e : 0.18;
      var g = c.createRadialGradient(x, y, 0, x, y, rr);
      g.addColorStop(0, "rgba(" + RGB[0] + "," + RGB[1] + "," + RGB[2] + "," + a + ")");
      g.addColorStop(hard, "rgba(" + RGB[0] + "," + RGB[1] + "," + RGB[2] + "," + a + ")");
      g.addColorStop(1, "rgba(" + RGB[0] + "," + RGB[1] + "," + RGB[2] + ",0)");
      c.fillStyle = g; c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.fill();
    });
  }
  function renderGL(t) {
    var cv = refs.gl, hero = refs.heroSec;
    if (!gl || !cv || cv !== glCanvas || !hero || glDisabled) return;
    if (gl.isContextLost && gl.isContextLost()) return;
    var g0 = performance.now();
    var hr = hero.getBoundingClientRect(), H = innerHeight; if (hr.bottom <= 0 || hr.top > H) return;
    var tot = hero.offsetHeight - H, isHome = state.route === "home";
    var p = tot > 80 ? clamp01(-hr.top / tot) : clamp01(-hr.top / hero.offsetHeight);
    var e = isHome ? smooth(clamp01(p / 0.85)) : smooth(p) * 0.7;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.25), w = cv.clientWidth, h = cv.clientHeight, W = Math.round(w * dpr), Hh = Math.round(h * dpr);
    if (cv.width !== W || cv.height !== Hh) { cv.width = W; cv.height = Hh; gl.viewport(0, 0, W, Hh); sceneCanvas.width = Math.round(w * 0.45); sceneCanvas.height = Math.round(h * 0.45); }
    drawScene(t, e);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
    var cr = cv.getBoundingClientRect(), now = performance.now(), wide = w / h > 1.1;
    var live = now - mouse.t < 2500 && mouse.y > cr.top && mouse.y < cr.bottom;
    var tx, ty, tr;
    if (live) { tx = mouse.x - cr.left; ty = mouse.y - cr.top; tr = Math.min(w, h) * (wide ? 0.17 : 0.2); }
    else { tx = w * ((wide ? 0.72 : 0.5) + 0.14 * Math.sin(t * 0.00045)); ty = h * ((wide ? 0.46 : 0.3) + 0.1 * Math.sin(t * 0.0007 + 1)); tr = Math.min(w, h) * 0.13; }
    lens.x += (tx - lens.x) * 0.12; lens.y += (ty - lens.y) * 0.12; lens.r += (tr - lens.r) * 0.08;
    gl.uniform2f(glU.mouse, lens.x * dpr, (h - lens.y) * dpr); gl.uniform1f(glU.r, lens.r * dpr);
    gl.uniform1f(glU.n, wide ? 24 : 12); gl.uniform1f(glU.s, 1 - e); gl.uniform1f(glU.t, t);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    var gdt = performance.now() - g0; glSlow = gdt > 40 ? glSlow + 1 : Math.max(0, glSlow - 1); if (glSlow > 4) glDisabled = true;
    var pct = Math.round(e * 100);
    if (refs.clarity) refs.clarity.textContent = pct >= 100 ? "Clear." : "Clarity " + pct + "%";
    if (refs.clarityBar) refs.clarityBar.style.transform = "scaleX(" + e + ")";
  }

  // ---------------------------------------------------------------------
  // Belief chip-cloud (scroll-driven dispersal) on Home
  // ---------------------------------------------------------------------
  function frameBelief(H, red) {
    var b = refs.belief; if (!b) return;
    var r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) return;
    var p = red ? 1 : clamp01(-r.top / (b.offsetHeight - H));
    var chips = $$("[data-chip]", b), n = chips.length, left = 0;
    chips.forEach(function (c, i) {
      var s = ((i * 7) % n) / n, l = clamp01((p - 0.06 - s * 0.4) / 0.16), e = l * l; if (l < 1) left++;
      c.style.transform = "translate3d(" + (c.dataset.dx * e) + "px, " + (c.dataset.dy * e) + "px, " + (c.dataset.dz * e) + "px) rotateX(" + ((i % 2 ? 1 : -1) * 50 * e) + "deg) rotateZ(" + ((i % 3 - 1) * 24 * e) + "deg)";
      c.style.opacity = String(1 - l); c.style.filter = "blur(" + (5 * e) + "px)";
    });
    var words = $$("[data-bw]", b), m = words.length;
    words.forEach(function (w, j) {
      var l = clamp01((p - 0.32 - (j / m) * 0.4) / 0.1);
      w.style.opacity = String(0.1 + 0.9 * l); w.style.transform = "translateY(" + ((1 - l) * 18) + "px)"; w.style.filter = "blur(" + ((1 - l) * 6) + "px)";
    });
    if (refs.counter) refs.counter.textContent = String(Math.max(1, left));
  }

  // ---------------------------------------------------------------------
  // Main rAF loop
  // ---------------------------------------------------------------------
  var lastY = window.scrollY, vel = 0, mqx = 0, fc = 0, glT = 0;
  function frame(t) {
    var H = innerHeight, y = window.scrollY, max = document.documentElement.scrollHeight - H, red = reduced();
    vel += ((y - lastY) - vel) * 0.18; lastY = y;
    if (refs.ring) refs.ring.setAttribute("stroke-dashoffset", String(125.66 * (1 - (max > 0 ? Math.min(1, y / max) : 0))));
    if (refs.prog) refs.prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var c = refs.cursor;
    if (c && c.style.display === "flex") { cx += (mouse.x - cx) * 0.2; cy += (mouse.y - cy) * 0.2; c.style.transform = "translate(" + cx + "px, " + cy + "px)"; }
    if (++fc % 12 === 0) revealVisible();
    var hi = refs.heroImg;
    if (hi && !red) { var r = hi.getBoundingClientRect(); var p = clamp01(1 - (r.top - H * 0.25) / (H * 0.75)); hi.style.transform = "scale(" + (0.88 + 0.12 * p) + ")"; }
    var mq = refs.marq;
    if (mq) {
      var half = mq.scrollWidth / 2;
      mqx -= red ? 0 : 0.7 + Math.min(40, Math.abs(vel)) * 0.35;
      if (-mqx > half) mqx += half;
      var sk = Math.max(-14, Math.min(14, vel * -0.25));
      mq.style.transform = "translateX(" + mqx + "px) skewX(" + sk + "deg)";
    }
    frameBelief(H, red);
    if (fine && mouse.moved && vwEls.length) {
      mouse.moved = false;
      var mx = mouse.x, my = mouse.y;
      for (var i = 0; i < vwEls.length; i++) {
        var el = vwEls[i], rr = el.getBoundingClientRect();
        if (rr.bottom < -40 || rr.top > H + 40) continue;
        var d = Math.hypot(rr.left + rr.width / 2 - mx, rr.top + rr.height / 2 - my), f = Math.max(0, 1 - d / 260);
        el.style.fontWeight = String(Math.round(500 + 200 * f * f));
      }
    }
    if (!glT || t - glT > 33) { glT = t; renderGL(red ? 0 : t); }
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------
  function boot() {
    var mq = window.matchMedia("(min-width: 900px)");
    state.wide = mq.matches;
    mq.addEventListener("change", function () { state.wide = mq.matches; render(); wireLeaveListeners(); });
    render();
    wireLeaveListeners();
    applyHireState();
    window.addEventListener("resize", function () { placeInd(A.navActive()); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeInd(A.navActive()); });
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
