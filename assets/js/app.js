// Aditi Tiwari — portfolio (2026 redesign)
// Vanilla-JS port of the Claude Design export: same markup, same motion,
// same WebGL "glass" hero shader — no React, no design-canvas runtime.
(function () {
  "use strict";
  var SD = window.SD;
  var pad = SD.pad;

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  var state = {
    route: initialRoute(),
    time: "", hover: null, openQ: 0, copied: false, sent: false,
    wide: window.matchMedia("(min-width: 900px)").matches,
    active: 0, hire: 0, role: 0
  };

  function initialRoute() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    return h || "home";
  }

  // ---------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function smooth(v) { return v * v * (3 - 2 * v); }

  // Resolve an <image-slot>-equivalent to either a real <img> or an honest
  // "pending" placeholder, matching the asset map in data.js.
  function imgTag(id, hint, cls, imgStyle) {
    var src = SD.IMAGES[id];
    cls = cls || "";
    if (src) {
      return '<img class="washed-img ' + cls + '" src="' + esc((window.__BASE__ || "") + src) + '" alt="' + esc(hint || "") + '" loading="lazy" ' +
        'style="width:100%;height:100%;object-fit:cover;object-position:top;' + (imgStyle || "") + '">';
    }
    return '<div class="pending-slot ' + cls + '"><div class="ps-label">' + esc(hint || "Screens pending") + '</div><div class="ps-note">Screen export pending — drop the real image in here.</div></div>';
  }

  // ---------------------------------------------------------------------
  // Derived scope helpers (ported from renderVals()/fxVals()/hireVals()/caseVals())
  // ---------------------------------------------------------------------
  function words(arr) {
    return arr.map(function (pair, i) {
      var t = pair[0], s = pair[1];
      return { t: t, serif: !!s, d: i * 70, chars: Array.prototype.slice.call(t).map(function (ch) { return ch; }) };
    });
  }

  function navActive() {
    var s = state.route.split("/")[0];
    return (s === "case" || s === "project") ? "work" : s;
  }

  function caseObj() {
    var r = state.route;
    return r.indexOf("case/") === 0 ? SD.CASES.filter(function (f) { return f.id === r.slice(5); })[0] : null;
  }
  function projObj() {
    var r = state.route;
    return r.indexOf("project/") === 0 ? SD.SUP.filter(function (f) { return f.id === r.slice(8); })[0] : null;
  }

  function flagshipsScope() {
    return SD.FLAG.map(function (f, i) {
      return Object.assign({}, f, { n: pad(i), imgId: "card-" + f.id });
    });
  }
  function supportingScope() {
    return SD.SUP.map(function (s, i) {
      return Object.assign({}, s, { n: pad(i + 4), d: i * 90, imgId: "card-" + s.id, imgHint: s.title + " — " + s.images[0].toLowerCase() });
    });
  }

  function fxScope(flagships, ai) {
    var wide = state.wide;
    return flagships.map(function (f, i) {
      var on = i === ai;
      return Object.assign({}, f, {
        grow: wide ? (on ? "5.2 1 0%" : "1 1 0%") : "0 0 auto",
        h: wide ? "auto" : (on ? "480px" : "84px"),
        scale: on ? "1" : "1.14", flute: on ? "0" : "1",
        openOp: on ? "1" : "0", openY: on ? "0px" : "28px",
        closedOp: on ? "0" : "1", delay: on ? ".35s" : "0s",
        cursor: on ? "Read case" : "Open"
      });
    });
  }

  function hireScope() {
    var hi = state.hire, s = SD.HIRE[hi];
    return {
      hire: SD.HIRE.map(function (o, i) {
        return { label: o[0], bg: i === hi ? "#010101" : "#FFFFFF", fg: i === hi ? "#FFFFFF" : "#010101", i: i };
      }),
      hireSel: { big: s[1], project: s[2], line: s[3], route: s[4] }
    };
  }

  function caseStepsScope(cf, c) {
    var wide = state.wide, S = [], k = 0;
    function add(label, o, stage) {
      k++; S.push(Object.assign({ n: pad(k - 1), label: label, stage: stage || "chapter" }, o));
    }
    if (cf.context) add("Context", { title: cf.context.title, paras: cf.context.paras });
    add("The problem", { lead: cf.problem });
    if (cf.pains) add("What research found", { title: cf.painsTitle, items: cf.pains.map(function (p) { return { a: p[0], b: p[1] }; }) });
    add("Success, defined up front", { serifLead: cf.success }, "metrics");
    add("What I did", { items: cf.did.map(function (b) { return { b: b }; }), note: "The team — " + cf.team });
    if (cf.research) {
      add("Research", { title: cf.research.title, body: cf.research.intro, quotes: cf.research.quotes, bars: cf.research.bars, note: cf.research.note }, "quote");
      S[S.length - 1].quote = cf.research.quotes[0][0];
    }
    if (cf.personas) {
      add("Who I designed for", { title: c.personaTitle, items: cf.personas.map(function (p) { return { a: p[1] + " · " + p[2], b: p[4] + " Needs: " + p[5] }; }), note: cf.personaNote, quote: cf.personas[0][3] }, "quote");
    }
    if (cf.drivers) add(c.driversLabel, { title: c.driversTitle, body: c.driversIntro, items: cf.drivers.map(function (p) { return { a: p[0], b: p[1] }; }) });
    add("Constraints", { items: cf.constraints.map(function (b) { return { b: b }; }) });
    add("The hard decision", { serifTitle: cf.hardTitle, body: cf.hard });
    (cf.decisions || []).forEach(function (d) { add(d[1], { serifTitle: d[2], body: d[3] }); });
    add(cf.didntTitle, { body: cf.didnt, pairs: c.tradeoffs || [] });
    k++; var solN = pad(k - 1), L = cf.solution.length;
    cf.solution.forEach(function (pair, j) {
      S.push({ n: solN, label: "The solution · " + (j + 1) + " / " + L, title: pair[0], body: pair[1].charAt(0).toUpperCase() + pair[1].slice(1), fig: cf.id + "-fig-" + (j + 1), figN: pad(j), stage: "fig" });
    });
    if (cf.system) add("Visual system", { body: cf.system.body, swatches: cf.system.swatches.map(function (hex) { return { hex: hex }; }), note: cf.system.validation }, "swatches");
    add("Outcome", { items: cf.outcome.map(function (b) { return { b: b }; }), big: true }, "metrics");
    add("Reflection", { body: cf.differently, quote: cf.opinion, note: "An opinion I hold because of " + cf.title }, "quote");

    return S.map(function (s, i) {
      return {
        i: i, n: s.n, label: s.label, title: s.title || "", serifTitle: s.serifTitle || "", lead: s.lead || "",
        serifLead: s.serifLead || "", body: s.body || "", note: s.note || "", quote: s.quote || "", fig: s.fig || "", figN: s.figN || "",
        paras: (s.paras || []).map(function (t) { return { t: t }; }),
        items: (s.items || []).map(function (it, j) { return { n: pad(j), a: it.a || "", hasA: !!it.a, b: it.b }; }),
        quotes: (s.quotes || []).map(function (q) { return { q: q[0], who: q[1], dot: q[1] === "Client" ? "#010101" : "#D64A1B" }; }),
        bars: (s.bars || []).map(function (b, j) { return { l: b[0], v: b[1], w: Math.round(b[1] / 35 * 100) + "%", col: j === 0 ? "#D64A1B" : "#010101" }; }),
        pairs: s.pairs || [], swatches: s.swatches || [],
        hasTitle: !!s.title, hasSerifTitle: !!s.serifTitle, hasLead: !!s.lead, hasSerifLead: !!s.serifLead, hasBody: !!s.body,
        hasItems: !!(s.items && s.items.length), hasQuotes: !!(s.quotes && s.quotes.length), hasBars: !!(s.bars && s.bars.length),
        hasPairs: !!(s.pairs && s.pairs.length), hasNote: !!s.note,
        itemSize: s.big ? "clamp(19px,1.7vw,24px)" : "16px",
        narrowFig: !wide && !!s.fig, narrowSw: !wide && !!s.swatches, narrowQuote: !wide && s.stage === "quote" && !!s.quote,
        isFig: !!s.fig, isText: !s.fig, firstFig: !!s.fig && s.label.indexOf("· 1 /") > -1,
        metricsInline: s.stage === "metrics", quoteInline: s.stage === "quote" && !!s.quote, swInline: !!(s.swatches && s.swatches.length)
      };
    });
  }

  function caseScope(cf) {
    if (!cf) return null;
    var isOD = cf.supIndex != null;
    var i = isOD ? cf.supIndex + 4 : SD.FLAG.indexOf(cf);
    var nx = isOD ? SD.SUP[(cf.supIndex + 1) % SD.SUP.length] : SD.FLAG[(i + 1) % SD.FLAG.length];
    var c = Object.assign({}, cf, {
      n: pad(i), label: isOD ? "Case study · Supporting project " + pad(i) : "Case study " + pad(i) + " / 04",
      hasQuick: !!cf.quick, quick: (cf.quick || []).map(function (q, j) { return { n: pad(j), tag: q[0], t: q[1], b: q[2], d: j * 80 }; }),
      hasLink: !!cf.link, linkHref: cf.link ? cf.link.url : "#", linkLabel: cf.link ? cf.link.label : "",
      glance: cf.glance.map(function (g) { return { k: g[0], v: g[1] }; }),
      metrics: cf.metrics.map(function (m, j) { return Object.assign({}, m, { d: j * 80, ink: j === 0 ? "#D64A1B" : "#010101" }); }),
      resultLine: cf.resultLine,
      tA: cf.tA || "Gave up", tB: cf.tB || "For", tDeco: cf.tDeco || "line-through",
      tradeoffs: (cf.tradeoffs || []).map(function (t) { return { gave: t[0], "for": t[1] }; }),
      heroId: cf.id + "-hero", heroHint: cf.imgHint + " — hero image"
    });
    var steps = caseStepsScope(cf, c);
    var next = isOD
      ? { title: nx.title, label: "Next project · " + pad(((cf.supIndex + 1) % SD.SUP.length) + 4), route: "case/" + (nx.caseId || nx.id) }
      : { title: nx.title, label: "Next case study · " + pad((i + 1) % SD.FLAG.length) + " / 04", route: "case/" + nx.id };
    c.next = next;
    c.steps = steps;
    c.heroCols = state.wide ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1fr)";
    c.caseCols = state.wide ? "minmax(0,3fr) minmax(0,8fr)" : "minmax(0,1fr)";
    c.stickPos = state.wide ? "sticky" : "static";
    c.labelDir = state.wide ? "column" : "row";
    c.labelAlign = state.wide ? "flex-start" : "baseline";
    return c;
  }

  function projScope(pf) {
    if (!pf) return null;
    var i = SD.SUP.indexOf(pf), nx = SD.SUP[(i + 1) % SD.SUP.length];
    return Object.assign({}, pf, {
      n: pad(i + 4),
      meta: pf.meta.map(function (m) { return { k: m[0], v: m[1] }; }),
      hasLink: !!pf.link, linkHref: pf.link ? pf.link.url : "#", linkLabel: pf.link ? pf.link.label : "",
      hasContext: !!pf.context, hasRecognition: !!pf.recognition, hasNote: !!pf.note,
      images: pf.images.map(function (t, j) { return { id: pf.id + "-img-" + (j + 1), t: t }; }),
      next: { title: nx.title, route: "case/" + (nx.caseId || nx.id) }
    });
  }

  // ---------------------------------------------------------------------
  // Dynamic hover / focus classes (stand-ins for the design's inline
  // `style-hover` / `style-focus` attributes, which plain CSS can't do).
  // ---------------------------------------------------------------------
  var hvSheet = document.getElementById("hv-sheet");
  if (!hvSheet) { hvSheet = document.createElement("style"); hvSheet.id = "hv-sheet"; document.head.appendChild(hvSheet); }
  var hvCache = {};
  function hv(css) {
    if (!css) return "";
    if (hvCache[css]) return hvCache[css];
    var cls = "hv" + Object.keys(hvCache).length;
    hvCache[css] = cls;
    hvSheet.appendChild(document.createTextNode("." + cls + ":hover{" + css + "}"));
    return cls;
  }
  var fcCache = {};
  function fc(css) {
    if (!css) return "";
    if (fcCache[css]) return fcCache[css];
    var cls = "fc" + Object.keys(fcCache).length;
    fcCache[css] = cls;
    hvSheet.appendChild(document.createTextNode("." + cls + ":focus-visible{" + css + "}"));
    return cls;
  }

  function base() { return window.__BASE__ || ""; }

  window.__APP = { state: state, SD: SD, esc: esc, imgTag: imgTag, words: words, pad: pad, clamp01: clamp01, smooth: smooth,
    navActive: navActive, caseObj: caseObj, projObj: projObj, flagshipsScope: flagshipsScope, supportingScope: supportingScope,
    fxScope: fxScope, hireScope: hireScope, caseScope: caseScope, projScope: projScope, hv: hv, fc: fc, base: base };
})();
