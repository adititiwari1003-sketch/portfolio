// HTML builders for each screen + the shared chrome (header, pill nav,
// cursor, page-transition overlay, footer). Pure string templates —
// assets/js/engine.js wires up refs, actions and physics after insertion.
(function () {
  "use strict";
  var A = window.__APP, SD = A.SD, esc = A.esc, imgTag = A.imgTag, pad = A.pad, hv = A.hv, fc = A.fc;

  function wordsHTML(ws, size) {
    return ws.map(function (w) {
      if (w.serif) {
        return '<span style="display:inline-block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em">' +
          '<span data-reveal="word" data-d="' + w.d + '" style="display:inline-block;font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">' + esc(w.t) + '</span></span>';
      }
      var chars = w.chars.map(function (ch) { return '<span data-vw style="display:inline-block;transition:font-weight .3s ease-out">' + esc(ch) + '</span>'; }).join("");
      return '<span style="display:inline-block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em">' +
        '<span data-reveal="word" data-d="' + w.d + '" style="display:inline-block;white-space:nowrap">' + chars + '</span></span>';
    }).join(" ");
  }

  // ---- chrome -----------------------------------------------------------
  function noiseAndProgress() {
    return '' +
      '<div aria-hidden="true" style="position:fixed;inset:0;z-index:400;pointer-events:none;opacity:.07;mix-blend-mode:multiply;' +
      'background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxODAnIGhlaWdodD0nMTgwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjg1JyBudW1PY3RhdmVzPScyJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PGZlQ29sb3JNYXRyaXggdHlwZT0nc2F0dXJhdGUnIHZhbHVlcz0nMCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNuKScvPjwvc3ZnPg==)"></div>' +
      '<div data-ref="prog" style="position:fixed;top:0;left:0;right:0;height:3px;background:#D64A1B;transform-origin:0 50%;transform:scaleX(0);z-index:120;pointer-events:none"></div>';
  }

  function headerHTML() {
    return '' +
      '<header style="position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px clamp(20px,5vw,72px);pointer-events:none">' +
        '<button data-act="go" data-route="home" data-cursor="Home" style="pointer-events:auto;background:none;border:0;padding:0;cursor:pointer;display:flex;align-items:baseline;gap:8px;font-size:15px;font-weight:600;letter-spacing:-0.01em">Aditi Tiwari<span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;font-size:17px;color:#6B635B">— Product Designer</span></button>' +
        '<div style="pointer-events:auto;display:flex;align-items:center;gap:10px;font-size:13px;color:#6B635B;background:rgba(255,255,255,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:6px 12px;border-radius:999px"><span style="width:7px;height:7px;border-radius:50%;background:#D64A1B;animation:pulse 2.2s infinite"></span><span data-ref="clock">Mandi, IN · </span></div>' +
      '</header>';
  }

  function navHTML() {
    var items = ["work", "how", "about"].map(function (k) {
      return '<button data-ref="navbtn-' + k + '" data-nav="' + k + '" data-act="go" data-route="' + k + '" data-hover-act="nav-enter" data-hover-key="' + k + '" style="position:relative;z-index:1;height:44px;padding:0 clamp(8px,2.2vw,18px);border:0;border-radius:999px;background:transparent;color:#FFFFFF;font-size:clamp(13px,1.1vw,14px);font-weight:500;cursor:pointer;white-space:nowrap">' + SD.LABELS[k] + '</button>';
    }).join("");
    return '' +
      '<nav data-ref="nav" style="position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:100;display:flex;align-items:center;gap:4px;padding:5px;background:rgba(1,1,1,.9);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);border-radius:999px;box-shadow:0 14px 44px rgba(1,1,1,.28),inset 0 1px 0 rgba(255,255,255,.14)">' +
        '<button data-act="go" data-route="home" aria-label="Home" class="' + hv("transform:rotate(-14deg) scale(1.06)") + '" style="position:relative;flex:none;width:44px;height:44px;border-radius:50%;border:0;background:#FFFFFF;color:#010101;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .45s cubic-bezier(.2,.8,.2,1)">' +
          '<svg width="44" height="44" viewBox="0 0 44 44" style="position:absolute;inset:0;transform:rotate(-90deg)"><circle cx="22" cy="22" r="20" fill="none" stroke="rgba(1,1,1,.1)" stroke-width="2"></circle><circle data-ref="ring" cx="22" cy="22" r="20" fill="none" stroke="#D64A1B" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="125.66" stroke-dashoffset="125.66"></circle></svg>' +
          '<span style="position:relative;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:19px;line-height:1">at</span>' +
        '</button>' +
        '<div data-ref="navRow" style="position:relative;display:flex">' +
          '<span data-ref="navInd" style="position:absolute;left:0;top:0;height:44px;width:0;border-radius:999px;background:#D64A1B;opacity:0;transition:transform .55s cubic-bezier(.3,1.35,.5,1),width .55s cubic-bezier(.3,1.35,.5,1),opacity .3s;pointer-events:none;box-shadow:0 4px 16px rgba(214,74,27,.45)"></span>' +
          items +
        '</div>' +
        '<button data-ref="contactBtn" data-act="go" data-route="contact" data-magnetic style="flex:none;height:44px;padding:0 clamp(12px,2.2vw,18px);border:0;border-radius:999px;background:#FFFFFF;color:#010101;font-size:clamp(13px,1.1vw,14px);font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap">Let\'s talk<span style="width:6px;height:6px;border-radius:50%;background:#D64A1B;animation:pulse 2.2s infinite"></span></button>' +
      '</nav>';
  }

  function cursorHTML() {
    return '<div data-ref="cursor" style="position:fixed;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:999px;background:#D64A1B;z-index:300;pointer-events:none;display:none;align-items:center;justify-content:center;color:#FFFFFF;font-size:12px;font-weight:500;letter-spacing:.02em;white-space:nowrap;overflow:hidden;transition:width .35s cubic-bezier(.2,.8,.2,1),height .35s cubic-bezier(.2,.8,.2,1),margin .35s cubic-bezier(.2,.8,.2,1)"><span data-ref="cursorLabel"></span></div>';
  }

  function overlayHTML() {
    var flutes = Array.from({ length: 12 }, function () { return '<span data-flute style="flex:1;height:100%;background:linear-gradient(90deg,#010101 0%,#151515 55%,#010101 100%);transform:scaleY(0);transform-origin:50% 100%"></span>'; }).join("");
    return '' +
      '<div data-ref="overlay" style="position:fixed;inset:0;z-index:250;pointer-events:none;display:flex">' + flutes +
        '<div data-ovlabel style="position:absolute;left:clamp(24px,5vw,72px);bottom:clamp(24px,5vw,72px);display:flex;align-items:baseline;gap:16px;color:#FFFFFF;opacity:0"><span style="width:14px;height:14px;border-radius:50%;background:#D64A1B"></span><span data-ref="ovlabelText" style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(48px,10vw,140px);line-height:1;letter-spacing:-0.02em"></span></div>' +
      '</div>';
  }

  function glHero(extraStyle) {
    return '<canvas data-ref="gl" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas><div style="position:absolute;inset:0;background:linear-gradient(to top,#FFFFFF 0%,rgba(255,255,255,.8) 20%,rgba(255,255,255,0) 55%);pointer-events:none"></div>';
  }

  function footerHTML() {
    var flutes = Array.from({ length: 28 }, function () {
      return '<span class="' + hv("backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);background:transparent;transition:backdrop-filter .15s,background .15s") + '" style="flex:1;backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);background:linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,0) 45%,rgba(0,0,0,.35));transition:backdrop-filter 1.2s ease,background 1.2s ease"></span>';
    }).join("");
    var linkHv = hv("background:#FFFFFF;color:#010101");
    return '' +
      '<footer style="background:#010101;color:#FFFFFF;padding:clamp(48px,8vh,88px) clamp(20px,5vw,72px) 120px;overflow:hidden">' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:28px;align-items:flex-start">' +
          '<p style="margin:0;max-width:360px;font-size:15px;line-height:1.5;color:#DDD3C9">Aditi Tiwari — Senior Product Designer · Designing clarity for AI and enterprise SaaS</p>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
            '<a href="mailto:taditi555@gmail.com" class="' + linkHv + '" style="color:#FFFFFF;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:10px 16px;font-size:14px;transition:background .3s,color .3s">Email</a>' +
            '<a href="https://www.linkedin.com/in/aditi-tiwari-39384918a" target="_blank" rel="noopener" class="' + linkHv + '" style="color:#FFFFFF;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:10px 16px;font-size:14px;transition:background .3s,color .3s">LinkedIn</a>' +
            '<a href="https://www.behance.net/adititiwar2841" target="_blank" rel="noopener" class="' + linkHv + '" style="color:#FFFFFF;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:10px 16px;font-size:14px;transition:background .3s,color .3s">Behance</a>' +
            '<button data-act="to-top" class="' + hv("background:#D64A1B;color:#FFFFFF") + '" style="background:#FFFFFF;color:#010101;border:0;border-radius:999px;padding:10px 16px;font-size:14px;cursor:pointer;transition:background .3s,color .3s">Back to top ↑</button>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;margin-top:clamp(40px,8vh,96px)">' +
          '<div style="font-weight:500;font-size:clamp(64px,17.5vw,300px);line-height:.8;letter-spacing:-0.07em;white-space:nowrap;padding:.06em 0">Aditi <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.03em;color:#FFB38A">Tiwari</span></div>' +
          '<div style="position:absolute;inset:0;display:flex">' + flutes + '</div>' +
        '</div>' +
        '<div style="margin-top:14px;font-size:12px;color:#B3A79B">Run your cursor across the glass.</div>' +
        '<div style="margin-top:24px;font-size:13px;color:#B3A79B">© 2026</div>' +
      '</footer>';
  }

  function chrome(mainHTML) {
    return noiseAndProgress() + headerHTML() + navHTML() + cursorHTML() + overlayHTML() + mainHTML + footerHTML();
  }

  // ---- Home ---------------------------------------------------------
  function homeHTML() {
    var heroWords = A.words(SD.HERO);
    var flagships = A.flagshipsScope();
    var fx = A.fxScope(flagships, A.state.active);
    var H = A.hireScope();
    var supporting = A.supportingScope();
    var marquee = SD.MARQ.concat(SD.MARQ);

    var heroWordsHTML = wordsHTML(heroWords);

    var hireBtns = H.hire.map(function (o) {
      return '<button data-act="pick-hire" data-i="' + o.i + '" style="height:46px;padding:0 18px;border-radius:999px;border:1px solid #010101;background:' + o.bg + ';color:' + o.fg + ';font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .3s,color .3s,transform .35s cubic-bezier(.2,.8,.2,1)" class="' + hv("transform:translateY(-3px)") + '">' + esc(o.label) + '</button>';
    }).join("");

    var fxPanels = fx.map(function (f, i) {
      return '<article data-ref="fx-' + i + '" data-act="fx-click" data-i="' + i + '" data-hover-act="fx-enter" data-hover-key="' + i + '" data-cursor="' + esc(f.cursor) + '" style="position:relative;flex:' + f.grow + ';height:' + f.h + ';min-width:0;min-height:0;border-radius:clamp(16px,1.8vw,26px);overflow:hidden;cursor:pointer;background:#1C1714;outline:1px solid rgba(255,255,255,.1);transition:flex .85s cubic-bezier(.7,0,.2,1),height .85s cubic-bezier(.7,0,.2,1)">' +
        '<div style="position:absolute;inset:0;transform:scale(' + f.scale + ');transition:transform 1.4s cubic-bezier(.16,1,.3,1)">' + imgTag(f.imgId, f.title + ' — ' + (f.card || ""), "", "") + '</div>' +
        '<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,rgba(1,1,1,.94) 0%,rgba(1,1,1,.55) 42%,rgba(1,1,1,.12) 100%)"></div>' +
        '<div style="position:absolute;inset:0;pointer-events:none;opacity:' + f.flute + ';transition:opacity .6s;background:repeating-linear-gradient(90deg,rgba(255,255,255,.09) 0 1px,rgba(255,255,255,0) 1px 9px,rgba(0,0,0,.18) 9px 12px),linear-gradient(to top,rgba(214,74,27,.35),rgba(214,74,27,0) 60%)"></div>' +
        '<div data-face="wide" style="position:absolute;left:0;right:0;bottom:28px;top:24px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;opacity:' + f.closedOp + ';transition:opacity .4s;pointer-events:none"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:22px;color:#FFB38A">' + f.n + '</span><span style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(18px,1.6vw,26px);font-weight:500;letter-spacing:-0.02em;white-space:nowrap">' + esc(f.title) + '</span></div>' +
        '<div data-face="narrow" style="position:absolute;left:20px;right:20px;top:0;height:84px;display:none;align-items:center;justify-content:space-between;gap:12px;opacity:' + f.closedOp + ';transition:opacity .4s;pointer-events:none"><span style="font-size:19px;font-weight:500;letter-spacing:-0.02em">' + esc(f.title) + '</span><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:20px;color:#FFB38A">' + f.n + '</span></div>' +
        '<div style="position:absolute;left:0;right:0;top:0;padding:clamp(18px,2.2vw,32px);display:flex;justify-content:space-between;gap:12px;font-size:13px;opacity:' + f.openOp + ';transition:opacity .5s ease ' + f.delay + ';pointer-events:none"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:22px;color:#FFB38A">' + f.n + ' / 04</span><span style="border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:5px 11px;background:rgba(1,1,1,.3)">' + esc(f.domain) + '</span></div>' +
        '<div style="position:absolute;left:0;right:0;bottom:0;padding:clamp(20px,2.6vw,40px);display:flex;flex-direction:column;gap:clamp(10px,1.6vh,16px);max-width:720px;opacity:' + f.openOp + ';transform:translateY(' + f.openY + ');transition:opacity .5s ease ' + f.delay + ',transform .8s cubic-bezier(.16,1,.3,1) ' + f.delay + ';pointer-events:none">' +
          '<p style="margin:0;font-size:clamp(26px,3.4vw,54px);line-height:1.02;letter-spacing:-0.04em;font-weight:500;text-wrap:balance">' + esc(f.card) + '</p>' +
          '<div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(22px,2.2vw,30px);color:#FFB38A">' + esc(f.title) + '</span><span style="font-size:14px;color:#DDD3C9">' + esc(f.role) + '</span></div>' +
          '<div data-face="wide" style="display:flex;gap:clamp(16px,2.4vw,36px);padding-top:14px;border-top:1px solid rgba(255,255,255,.22)">' +
            f.metrics.map(function (m) { return '<div style="min-width:0"><div style="font-size:clamp(20px,2vw,30px);font-weight:500;letter-spacing:-0.03em">' + esc(m.v) + '</div><div style="font-size:12px;line-height:1.35;color:#C9BDB1;margin-top:4px;max-width:18ch">' + esc(m.l) + '</div></div>'; }).join("") +
          '</div>' +
          '<span style="align-self:flex-start;display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 22px;border-radius:999px;background:#FFFFFF;color:#010101;font-size:14px;font-weight:600">Read case study<span>→</span></span>' +
        '</div>' +
      '</article>';
    }).join("");

    var cardFlutes = Array.from({ length: 10 }, function () { return '<span style="flex:1;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);background:linear-gradient(90deg,rgba(255,255,255,.34),rgba(255,255,255,0) 42%,rgba(214,74,27,.07))"></span>'; }).join("");

    var supportingCards = supporting.map(function (s, i) {
      return '<article data-reveal="up" data-d="' + (i * 90) + '" data-act="go" data-route="case/' + (s.caseId || s.id) + '" data-cursor="View" style="cursor:pointer;display:flex;flex-direction:column;gap:16px">' +
        '<div data-tilt style="position:relative;aspect-ratio:3/4;border-radius:clamp(18px,2vw,26px);overflow:hidden;background:#F6F1EB;transition:transform .25s ease-out;will-change:transform">' +
          imgTag(s.imgId, s.imgHint, "", "") +
          '<div data-glass style="position:absolute;inset:0;display:flex;pointer-events:none;transition:opacity .8s cubic-bezier(.16,1,.3,1)">' + cardFlutes + '</div>' +
          '<div style="position:absolute;left:14px;right:14px;top:14px;display:flex;justify-content:space-between;align-items:center;gap:8px;pointer-events:none"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:18px;background:#FFFFFF;border-radius:999px;padding:4px 12px">' + s.n + '</span><span style="font-size:12px;background:rgba(255,255,255,.9);border-radius:999px;padding:6px 11px">' + esc(s.domain) + '</span></div>' +
          '<div style="position:absolute;left:12px;right:12px;bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#FFFFFF;border-radius:16px;padding:14px 14px 14px 18px;pointer-events:none;box-shadow:0 10px 30px rgba(1,1,1,.08)"><span style="font-size:clamp(18px,1.5vw,22px);font-weight:600;letter-spacing:-0.025em;line-height:1.1">' + esc(s.title) + '</span><span style="flex:none;width:40px;height:40px;border-radius:50%;background:#010101;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:16px">→</span></div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px;padding:0 4px"><p style="margin:0;font-size:16px;line-height:1.4;letter-spacing:-0.01em;text-wrap:pretty">' + esc(s.card) + '</p><span style="font-size:13px;color:#6B635B">' + esc(s.role) + '</span></div>' +
      '</article>';
    }).join("");

    var chips = SD.CHIPS.map(function (c, i) {
      var x = c[1], y = c[2], v = c[3];
      var dx = Math.round((x - 50) * 9), dy = Math.round((y - 50) * 7), dz = 300 + ((i * 137) % 500);
      var bg = v === "b" ? "#010101" : v === "a" ? "#D64A1B" : "#FFFFFF", fg = v === "o" ? "#010101" : "#FFFFFF";
      return '<div style="position:absolute;left:' + x + '%;top:' + y + '%;transform:translate(-50%,-50%);perspective:700px"><span data-chip data-dx="' + dx + '" data-dy="' + dy + '" data-dz="' + dz + '" style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;padding:9px 15px;border-radius:999px;font-size:clamp(12px,1.1vw,15px);border:1px solid #010101;background:' + bg + ';color:' + fg + ';box-shadow:0 8px 24px rgba(1,1,1,.08)">' + esc(c[0]) + '</span></div>';
    }).join("");

    var beliefWords = SD.BELIEF.map(function (w) {
      if (w[2]) return '<span style="flex-basis:100%;height:0"></span>';
      if (w[1]) return '<span data-bw style="display:inline-block;font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">' + esc(w[0]) + '</span>';
      return '<span data-bw style="display:inline-block">' + esc(w[0]) + '</span>';
    }).join(" ");

    var marqueeHTML = marquee.map(function (t) {
      return '<span style="display:flex;align-items:center;gap:clamp(18px,2.4vw,36px);padding-right:clamp(18px,2.4vw,36px);font-size:clamp(28px,4.6vw,72px);font-weight:500;letter-spacing:-0.04em;white-space:nowrap">' + esc(t) + '<span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;color:#D64A1B">✳</span></span>';
    }).join("");

    var ctaWordsHTML = wordsHTML(A.words(SD.CTA));

    return chrome(
      '<main data-screen-label="Home">' +
        '<section data-ref="heroSec" style="position:relative;height:230vh">' +
          '<div style="position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:#FFFFFF">' +
            glHero() +
            '<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(80px,12vh,116px) clamp(20px,5vw,72px) clamp(96px,14vh,128px);pointer-events:none">' +
              '<div data-reveal="up" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 18px;font-size:13px;color:#3B3530">' +
                '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px"><span style="letter-spacing:.08em;text-transform:uppercase">(01) Portfolio — 2026</span><span style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;border:1px solid rgba(1,1,1,.14);border-radius:999px;padding:6px 12px;color:#010101"><span style="width:7px;height:7px;border-radius:50%;background:#D64A1B;animation:pulse 2.2s infinite"></span>Open to Senior / Lead roles</span></div>' +
                '<span style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);border-radius:999px;padding:6px 12px"><span style="width:12px;height:12px;border-radius:50%;border:1.5px solid #010101"></span>Move to look through · scroll to clear the glass</span>' +
              '</div>' +
              '<div>' +
                '<h1 style="margin:0;font-weight:500;font-size:clamp(40px,7.6vw,124px);line-height:.94;letter-spacing:-0.05em;max-width:12.5ch;display:flex;flex-wrap:wrap;column-gap:.22em">' + heroWordsHTML + '</h1>' +
                '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;margin-top:clamp(24px,4vh,40px)">' +
                  '<div data-reveal="up" data-d="650" style="display:flex;flex-wrap:wrap;gap:10px;pointer-events:auto">' +
                    '<button data-act="scroll-work" data-magnetic data-cursor="Go" class="' + hv("background:repeating-linear-gradient(90deg,#D64A1B 0 7px,#E2683D 7px 14px)") + '" style="display:inline-flex;align-items:center;gap:12px;height:54px;padding:0 26px;border-radius:999px;border:0;background:#010101;color:#FFFFFF;font-size:15px;font-weight:500;cursor:pointer;transition:background .3s">See my work<span style="font-size:18px">↓</span></button>' +
                    '<a href="' + A.base() + 'Aditi-Tiwari-CV.pdf" download data-magnetic class="' + hv("background:#010101;color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:12px;height:54px;padding:0 26px;border-radius:999px;border:1px solid #010101;background:#FFFFFF;color:#010101;font-size:15px;font-weight:500;transition:background .3s,color .3s">Download CV</a>' +
                  '</div>' +
                  '<div data-reveal="up" data-d="760" style="display:flex;align-items:center;gap:12px;font-size:13px;color:#010101;background:rgba(255,255,255,.85);border-radius:999px;padding:8px 14px"><span style="position:relative;width:64px;height:2px;background:rgba(1,1,1,.14);overflow:hidden;border-radius:2px"><span data-ref="clarityBar" style="position:absolute;inset:0;background:#D64A1B;transform-origin:0 50%;transform:scaleX(0)"></span></span><span data-ref="clarity" style="min-width:9ch">Clarity 0%</span></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section style="position:relative;background:#FFFFFF;padding:clamp(72px,12vh,140px) clamp(20px,5vw,72px) 0">' +
          '<div style="display:flex;flex-wrap:wrap;gap:clamp(20px,5vw,88px)">' +
            '<div style="flex:1 1 200px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(02) In short</div>' +
            '<div style="flex:3 1 520px;max-width:980px">' +
              '<p data-reveal="up" style="margin:0;font-size:clamp(24px,3vw,46px);line-height:1.14;letter-spacing:-0.03em;text-wrap:pretty">I turn complex products — AI analytics, wealth platforms, field-service operations — into tools people understand <span style="font-family:\'Instrument Serif\',serif;font-style:italic;letter-spacing:-0.01em;color:#D64A1B">in minutes.</span> 6 years. Design systems, dashboards, and one AI product I designed and launched myself.</p>' +
              '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,2vw,28px);margin-top:clamp(36px,6vh,64px)">' +
                '<div data-reveal="up" style="border-top:1px solid #010101;padding-top:14px"><div data-count style="font-size:clamp(30px,4.4vw,68px);font-weight:500;letter-spacing:-0.045em;line-height:1">+45%</div><div style="margin-top:8px;font-size:13px;line-height:1.4;color:#6B635B">CTR on a website I redesigned</div></div>' +
                '<div data-reveal="up" data-d="80" style="border-top:1px solid #010101;padding-top:14px"><div data-count style="font-size:clamp(30px,4.4vw,68px);font-weight:500;letter-spacing:-0.045em;line-height:1">+45%</div><div style="margin-top:8px;font-size:13px;line-height:1.4;color:#6B635B">of users set up an investment goal in under 7 minutes</div></div>' +
                '<div data-reveal="up" data-d="160" style="border-top:1px solid #010101;padding-top:14px"><div data-count style="font-size:clamp(30px,4.4vw,68px);font-weight:500;letter-spacing:-0.045em;line-height:1">15+</div><div style="margin-top:8px;font-size:13px;line-height:1.4;color:#6B635B">dashboards on one design system</div></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div data-ref="heroImg" style="margin-top:clamp(56px,9vh,104px);transform-origin:50% 0;will-change:transform">' +
            '<div style="position:relative;aspect-ratio:16/9;min-height:220px;border-radius:clamp(14px,2vw,28px);overflow:hidden;background:#F6F1EB">' + imgTag("home-hero-aimate", "Aimate dashboard — hero screenshot") + '</div>' +
            '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-top:14px;font-size:13px;color:#6B635B"><span>Aimate — AI visibility dashboard</span><span>Designed and launched from zero, 2026</span></div>' +
          '</div>' +
        '</section>' +

        '<section style="padding:clamp(80px,13vh,150px) clamp(20px,5vw,72px) 0">' +
          '<div style="display:flex;flex-wrap:wrap;gap:clamp(20px,5vw,88px)">' +
            '<div style="flex:1 1 200px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(03) Quick match</div>' +
            '<div style="flex:3 1 520px;max-width:980px">' +
              '<h2 data-reveal="up" style="margin:0 0 28px;font-size:clamp(30px,4vw,60px);font-weight:500;letter-spacing:-0.045em;line-height:1">What are you <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">hiring for?</span></h2>' +
              '<div data-reveal="up" style="display:flex;flex-wrap:wrap;gap:8px">' + hireBtns + '</div>' +
              '<div data-ref="hireSel" data-act="go-hire-sel" data-cursor="Open" style="margin-top:18px;cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:18px 36px;padding:clamp(22px,3vw,40px);border-radius:24px;background:#F6F1EB;transition:background .35s" class="' + hv("background:#FBE4D7") + '">' +
                '<div data-ref="hireBig" style="flex:0 0 auto;font-size:clamp(44px,6vw,96px);font-weight:500;letter-spacing:-0.05em;line-height:.9;color:#D64A1B">' + esc(H.hireSel.big) + '</div>' +
                '<div style="flex:1 1 260px"><div data-ref="hireProject" style="font-size:13px;color:#6B635B;margin-bottom:6px">' + esc(H.hireSel.project) + '</div><p data-ref="hireLine" style="margin:0;font-size:clamp(17px,1.5vw,21px);line-height:1.4;letter-spacing:-0.01em;text-wrap:pretty">' + esc(H.hireSel.line) + '</p></div>' +
                '<span style="flex:none;width:52px;height:52px;border-radius:50%;background:#010101;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:20px">↗</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<div style="margin-top:clamp(72px,12vh,140px);background:#FFFFFF;border-top:1px solid #010101;border-bottom:1px solid #010101;overflow:hidden;padding:clamp(14px,2vh,22px) 0">' +
          '<div data-ref="marq" style="display:flex;width:max-content;will-change:transform">' + marqueeHTML + '</div>' +
        '</div>' +

        '<section data-ref="cube" id="flagships" style="position:relative;overflow:hidden;background:#010101;color:#FFFFFF;margin-top:clamp(72px,12vh,140px);padding:clamp(72px,12vh,130px) clamp(20px,5vw,72px)">' +
          '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 15% 0%,rgba(214,74,27,.30),rgba(1,1,1,0) 55%),radial-gradient(ellipse at 100% 100%,rgba(255,179,138,.14),rgba(1,1,1,0) 50%);pointer-events:none"></div>' +
          '<div style="position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 32px;margin-bottom:clamp(32px,6vh,56px)">' +
            '<div><div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C9BDB1;margin-bottom:18px">(04) Flagship work</div><h2 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(34px,5.6vw,88px);line-height:.96;letter-spacing:-0.05em">Four products, <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#FFB38A">four hard problems.</span></h2></div>' +
            '<p data-reveal="up" style="margin:0;max-width:300px;font-size:15px;line-height:1.5;color:#DDD3C9">Hover or tap a panel to open it. Results first.</p>' +
          '</div>' +
          '<div data-ref="fxWrap" style="position:relative;display:flex;flex-direction:' + (A.state.wide ? "row" : "column") + ';gap:10px;height:' + (A.state.wide ? "min(80vh,780px)" : "auto") + '">' + fxPanels + '</div>' +
        '</section>' +

        '<section data-ref="belief" style="position:relative;height:280vh">' +
          '<div style="position:sticky;top:0;height:100vh;height:100svh;background:radial-gradient(circle at 50% 50%,#FFEDE2 0%,#FFFFFF 62%);overflow:hidden;display:flex;align-items:center;justify-content:center;padding:0 clamp(20px,5vw,72px)">' +
            chips +
            '<div style="position:relative;max-width:1100px;text-align:center">' +
              '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:28px">(05) What I believe</div>' +
              '<p style="margin:0;display:flex;flex-wrap:wrap;justify-content:center;column-gap:.24em;font-weight:500;font-size:clamp(32px,5.6vw,86px);line-height:1.02;letter-spacing:-0.045em">' + beliefWords + '</p>' +
              '<div style="margin-top:36px;display:inline-flex;align-items:center;gap:10px;font-size:13px;color:#6B635B;border:1px solid rgba(1,1,1,.14);border-radius:999px;padding:8px 14px;background:#FFFFFF">Decisions on this screen <span data-ref="counter" style="min-width:2ch;font-weight:600;color:#010101">14</span></div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section style="padding:clamp(72px,12vh,140px) clamp(20px,5vw,72px)">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:clamp(32px,5vh,52px)">' +
            '<div><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:16px">(06) Supporting work</div><h2 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(36px,5.4vw,84px);letter-spacing:-0.05em;line-height:.95">More <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">projects</span></h2></div>' +
            '<button data-act="go" data-route="work" data-magnetic class="' + hv("background:#010101;color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:12px;height:50px;padding:0 22px;border-radius:999px;border:1px solid #010101;background:#FFFFFF;color:#010101;font-size:15px;font-weight:500;cursor:pointer;transition:background .3s,color .3s">All work<span>→</span></button>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:clamp(14px,1.8vw,24px)">' + supportingCards + '</div>' +
        '</section>' +

        '<section style="padding:clamp(60px,10vh,140px) clamp(20px,5vw,72px) clamp(80px,12vh,140px);border-top:1px solid rgba(1,1,1,.12)">' +
          '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:24px">(07) Next step</div>' +
          '<h2 style="margin:0;font-weight:500;font-size:clamp(46px,10vw,168px);line-height:.9;letter-spacing:-0.055em;display:flex;flex-wrap:wrap;column-gap:.2em">' + ctaWordsHTML + '</h2>' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:28px;margin-top:40px">' +
            '<p data-reveal="up" style="margin:0;max-width:460px;font-size:clamp(17px,1.5vw,20px);line-height:1.5;color:#2E2925">I do my best work where the product is complex and the stakes are real. Let\'s talk.</p>' +
            '<div data-reveal="up" style="display:flex;flex-wrap:wrap;gap:12px">' +
              '<a href="mailto:taditi555@gmail.com" data-magnetic class="' + hv("background:repeating-linear-gradient(90deg,#010101 0 7px,#1C1C1C 7px 14px);color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:12px;height:58px;padding:0 30px;border-radius:999px;background:#D64A1B;color:#FFFFFF;font-size:16px;font-weight:500;transition:background .3s">Email me<span>→</span></a>' +
              '<a href="https://www.linkedin.com/in/aditi-tiwari-39384918a" target="_blank" rel="noopener" data-magnetic class="' + hv("background:#010101;color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:12px;height:58px;padding:0 30px;border-radius:999px;border:1px solid #010101;color:#010101;font-size:16px;font-weight:500;transition:background .3s,color .3s">LinkedIn ↗</a>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</main>'
    );
  }

  // ---- Work index ----------------------------------------------------
  function workRowHTML(w, big) {
    var route = "case/" + (w.caseId || w.id);
    var numSize = big ? "20px" : "18px", titleSize = big ? "clamp(26px,3.6vw,52px)" : "clamp(20px,2.4vw,32px)";
    var pad = big ? "clamp(18px,3vh,30px) clamp(8px,1vw,16px)" : "clamp(14px,2.4vh,22px) clamp(8px,1vw,16px)";
    var border = big ? "border-top:1px solid #010101" : "border-top:1px solid rgba(1,1,1,.16)";
    var arrow = big ? "↗" : "→", arrowSize = big ? "22px" : "20px";
    return '<div data-act="go" data-route="' + route + '" data-hover-act="work-enter" data-cursor="' + (big ? "Read" : "View") + '" data-reveal="up" style="cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;padding:' + pad + ';' + border + ';border-radius:0;transition:background .35s,color .35s,padding .35s,border-radius .35s" class="' + hv("background:#010101;color:#FFFFFF;border-radius:16px") + '" data-hover-title="' + esc(w.title) + '" data-hover-domain="' + esc(w.domain) + '" data-hover-metric="' + esc(w.metric || w.card) + '">' +
      '<span style="flex:0 0 36px;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:' + numSize + '">' + w.n + '</span>' +
      '<span style="flex:1 1 220px;font-size:' + titleSize + ';font-weight:500;letter-spacing:-0.04em;line-height:1">' + esc(w.title) + '</span>' +
      '<span style="flex:1.4 1 260px;font-size:15px;line-height:1.4;opacity:.75">' + esc(w.card) + '</span>' +
      '<span style="flex:1 1 160px;font-size:13px;opacity:.65">' + esc(w.role) + ' · ' + esc(w.domain) + '</span>' +
      '<span style="flex:none;font-size:' + arrowSize + '">' + arrow + '</span>' +
    '</div>';
  }

  function workHTML() {
    var flagships = A.flagshipsScope(), supporting = A.supportingScope();
    return chrome(
      '<main data-screen-label="Work" style="padding:0 clamp(20px,5vw,72px) clamp(60px,10vh,120px)">' +
        '<section data-ref="heroSec" style="position:relative;margin:0 calc(clamp(20px,5vw,72px) * -1) clamp(36px,6vh,64px);min-height:clamp(540px,88vh,920px);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(100px,14vh,150px) clamp(20px,5vw,72px) clamp(28px,5vh,56px)">' +
          glHero() +
          '<div style="position:relative"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:20px">Index — 08 projects</div>' +
          '<h1 style="margin:0;font-weight:500;font-size:clamp(56px,13vw,210px);line-height:.86;letter-spacing:-0.06em;overflow:hidden"><span data-reveal="word" style="display:inline-block">Selected</span> <span data-reveal="word" data-d="90" style="display:inline-block;font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em">work</span></h1></div>' +
        '</section>' +
        '<p data-reveal="up" data-d="200" style="margin:28px 0 clamp(48px,8vh,88px);max-width:520px;font-size:clamp(17px,1.5vw,20px);line-height:1.5;color:#2E2925">Four case studies in depth, then four shorter projects. Every one is shipped or live.</p>' +
        '<div style="display:flex;justify-content:space-between;gap:16px;padding:0 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B"><span>Flagship case studies</span><span>04</span></div>' +
        flagships.map(function (w) { return workRowHTML(w, true); }).join("") +
        '<div style="display:flex;justify-content:space-between;gap:16px;padding:48px 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;border-top:1px solid #010101"><span>Supporting projects</span><span>04</span></div>' +
        supporting.map(function (w) { return workRowHTML(w, false); }).join("") +
        '<div data-ref="preview" style="position:fixed;left:0;top:0;z-index:90;pointer-events:none;width:280px;padding:22px;border-radius:20px;background:#D64A1B;color:#FFFFFF;opacity:0;transition:opacity .25s,scale .35s cubic-bezier(.2,.8,.2,1);scale:.85">' +
          '<div data-ref="previewDomain" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85"></div>' +
          '<div data-ref="previewTitle" style="margin-top:28px;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:44px;line-height:.95"></div>' +
          '<div data-ref="previewMetric" style="margin-top:14px;font-size:14px;line-height:1.4"></div>' +
        '</div>' +
      '</main>'
    );
  }

  // ---- Case study ------------------------------------------------------
  function caseStepHTML(s, c) {
    if (s.isFig) {
      var firstFig = s.firstFig ? '<div style="display:flex;align-items:baseline;gap:14px;margin:clamp(24px,5vh,48px) 0 clamp(20px,3vh,32px)"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(40px,3.6vw,56px);line-height:.8;color:#D64A1B">' + s.n + '</span><span style="font-size:clamp(26px,2.8vw,40px);font-weight:500;letter-spacing:-0.035em">The solution</span></div>' : '';
      var flutes = Array.from({ length: 14 }, function () { return '<span style="flex:1;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:linear-gradient(90deg,rgba(255,255,255,.45),rgba(255,255,255,.1) 45%,rgba(1,1,1,.05))"></span>'; }).join("");
      return '<section data-step="' + s.i + '" style="max-width:1240px;margin:0 auto;padding:clamp(28px,5vh,48px) clamp(20px,5vw,72px)">' + firstFig +
        '<figure style="margin:0"><div data-reveal="clip" data-tilt style="position:relative;aspect-ratio:16/9;border-radius:clamp(18px,2.2vw,30px);overflow:hidden;background:#F6F1EB;box-shadow:0 30px 70px -34px rgba(214,74,27,.4),0 0 0 1px rgba(1,1,1,.06);transition:transform .25s ease-out">' +
          imgTag(s.fig, s.title) +
          '<div data-reveal="glass" style="position:absolute;inset:0;display:flex;pointer-events:none">' + flutes + '</div>' +
          '<div data-glare style="position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s"></div>' +
        '</div>' +
        '<figcaption data-reveal="up" style="display:flex;flex-wrap:wrap;gap:6px 20px;align-items:baseline;margin-top:16px;max-width:900px"><span style="flex:none;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:26px;line-height:1;color:#D64A1B">Fig. ' + s.figN + '</span><span style="flex:1 1 300px;font-size:16px;line-height:1.55;color:#2E2925"><strong style="font-weight:600;color:#010101">' + esc(s.title) + '</strong> — ' + esc(s.body) + '</span></figcaption></figure>' +
      '</section>';
    }
    // isText
    var inner = '';
    if (s.narrowFig && !A.state.wide) inner += '<div style="position:relative;aspect-ratio:16/10;border-radius:18px;overflow:hidden;background:#F6F1EB">' + imgTag(s.fig, s.title) + '</div>';
    if (s.hasTitle) inner += '<h2 style="margin:0;font-size:clamp(24px,2.4vw,36px);font-weight:500;letter-spacing:-0.035em;line-height:1.1;text-wrap:balance">' + esc(s.title) + '</h2>';
    if (s.hasSerifTitle) inner += '<h2 style="margin:0;font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;font-size:clamp(34px,3.6vw,56px);line-height:1;letter-spacing:-0.015em;color:#D64A1B;text-wrap:balance">' + esc(s.serifTitle) + '</h2>';
    if (s.hasLead) inner += '<p style="margin:0;font-size:clamp(20px,1.9vw,28px);line-height:1.35;letter-spacing:-0.02em;text-wrap:pretty">' + esc(s.lead) + '</p>';
    if (s.hasSerifLead) inner += '<p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(28px,3vw,44px);line-height:1.1;letter-spacing:-0.01em;text-wrap:pretty">' + esc(s.serifLead) + '</p>';
    s.paras.forEach(function (pp) { inner += '<p style="margin:0;font-size:clamp(16px,1.25vw,19px);line-height:1.65;color:#2E2925;text-wrap:pretty">' + esc(pp.t) + '</p>'; });
    if (s.hasBody) inner += '<p style="margin:0;font-size:clamp(16px,1.25vw,19px);line-height:1.65;color:#2E2925;text-wrap:pretty">' + esc(s.body) + '</p>';
    if (s.hasItems) {
      inner += '<div style="display:flex;flex-direction:column">' + s.items.map(function (it) {
        return '<div style="display:flex;gap:16px;align-items:baseline;padding:16px 18px;margin-top:8px;border-radius:16px;background:#F6F1EB;transition:background .3s,transform .4s cubic-bezier(.2,.8,.2,1)" class="' + hv("background:#FBE4D7;transform:translateX(6px)") + '"><span style="flex:none;width:30px;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:19px;color:#D64A1B">' + it.n + '</span><span style="min-width:0">' +
          (it.hasA ? '<span style="display:block;font-size:16px;font-weight:600;letter-spacing:-0.01em;margin-bottom:3px">' + esc(it.a) + '</span>' : '') +
          '<span style="display:block;font-size:' + s.itemSize + ';line-height:1.5;color:#2E2925">' + esc(it.b) + '</span></span></div>';
      }).join("") + '</div>';
    }
    if (s.hasQuotes) {
      inner += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:10px">' + s.quotes.map(function (q) {
        return '<figure style="margin:0;background:#F6F1EB;border-radius:18px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:14px"><p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:20px;line-height:1.2">“' + esc(q.q) + '”</p><figcaption style="display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase"><span style="width:6px;height:6px;border-radius:50%;background:' + q.dot + '"></span>' + esc(q.who) + '</figcaption></figure>';
      }).join("") + '</div>';
    }
    if (s.hasBars) {
      inner += '<div>' + s.bars.map(function (b) {
        return '<div style="display:grid;grid-template-columns:minmax(0,1fr) 48px;align-items:center;gap:6px 12px;padding:9px 0;border-top:1px solid rgba(1,1,1,.12)"><span style="font-size:15px">' + esc(b.l) + '</span><span style="text-align:right;font-size:15px;font-weight:600">' + b.v + '%</span><span style="grid-column:1 / -1;height:6px;border-radius:6px;background:#F6F1EB;overflow:hidden"><span style="display:block;height:100%;width:' + b.w + ';border-radius:6px;background:' + b.col + '"></span></span></div>';
      }).join("") + '</div>';
    }
    if (s.hasPairs) {
      inner += '<div>' + s.pairs.map(function (t) {
        return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:6px 22px;padding:14px 0;border-top:1px solid rgba(1,1,1,.12)"><div><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6B635B;margin-bottom:4px">' + esc(c.tA) + '</div><div style="font-size:15px;line-height:1.45;text-decoration:' + c.tDeco + ';text-decoration-color:rgba(214,74,27,.6)">' + esc(t.gave) + '</div></div><div><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#D64A1B;margin-bottom:4px">' + esc(c.tB) + '</div><div style="font-size:15px;line-height:1.45;font-weight:500">' + esc(t["for"]) + '</div></div></div>';
      }).join("") + '</div>';
    }
    if (s.narrowSw && !A.state.wide) {
      inner += '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">' + s.swatches.map(function (w) {
        return '<div style="border-radius:14px;overflow:hidden;border:1px solid rgba(1,1,1,.1)"><div style="aspect-ratio:1/1;background:' + w.hex + '"></div><div style="padding:8px 10px;font-size:12px;background:#FFFFFF">' + w.hex + '</div></div>';
      }).join("") + '</div>';
    }
    if (s.narrowQuote && !A.state.wide) inner += '<p style="margin:0;padding:24px;border-radius:20px;background:#FBE4D7;font-family:\'Instrument Serif\',serif;font-size:clamp(26px,6vw,36px);line-height:1.08">“' + esc(s.quote) + '”</p>';
    if (s.hasNote) inner += '<p style="margin:0;font-size:14px;line-height:1.55;color:#6B635B">' + esc(s.note) + '</p>';
    if (s.metricsInline) {
      inner += '<div style="position:relative;overflow:hidden;margin-top:8px;border-radius:24px;background:#010101;color:#FFFFFF;padding:clamp(22px,3vw,36px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:20px"><div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 0% 100%,rgba(214,74,27,.45),rgba(1,1,1,0) 60%),repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 1px,rgba(255,255,255,0) 1px 16px)"></div>' +
        c.metrics.map(function (m) { return '<div style="position:relative;border-top:1px solid rgba(255,255,255,.25);padding-top:12px"><div style="font-size:clamp(34px,3.6vw,54px);font-weight:500;letter-spacing:-0.05em;line-height:.95;color:' + (m.ink === "#D64A1B" ? "#FFB38A" : "#FFFFFF") + '">' + esc(m.v) + '</div><div style="margin-top:8px;font-size:13px;line-height:1.4;color:#DDD3C9">' + esc(m.l) + '</div></div>'; }).join("") +
      '</div>';
    }
    if (s.quoteInline && s.quote) {
      inner += '<blockquote style="position:relative;overflow:hidden;margin:8px 0 0;border-radius:24px;background:#FBE4D7;padding:clamp(24px,3.4vw,44px)"><div style="position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 1px,rgba(255,255,255,0) 1px 14px);mask-image:linear-gradient(90deg,transparent 40%,#000);-webkit-mask-image:linear-gradient(90deg,transparent 40%,#000)"></div><div style="position:relative;font-family:\'Instrument Serif\',serif;font-size:90px;line-height:.5;height:.4em;color:#D64A1B">“</div><p style="position:relative;margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(26px,2.8vw,42px);line-height:1.1;text-wrap:balance">' + esc(s.quote) + '</p></blockquote>';
    }
    if (s.swInline) {
      inner += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-top:6px">' + s.swatches.map(function (w) {
        return '<div style="border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(1,1,1,.08);transition:transform .45s cubic-bezier(.2,.8,.2,1)" class="' + hv("transform:translateY(-6px)") + '"><div style="aspect-ratio:1/1;background:' + w.hex + '"></div><div style="padding:9px 12px;font-size:13px;font-weight:500;background:#FFFFFF">' + w.hex + '</div></div>';
      }).join("") + '</div>';
    }
    return '<section data-step="' + s.i + '" style="display:grid;grid-template-columns:' + c.caseCols + ';column-gap:clamp(24px,4vw,64px);row-gap:18px;max-width:1240px;margin:0 auto;padding:clamp(52px,9vh,96px) clamp(20px,5vw,72px);box-shadow:inset 0 -1px 0 rgba(1,1,1,.08)">' +
      '<div style="min-width:0"><div style="position:' + c.stickPos + ';top:110px;display:flex;flex-direction:' + c.labelDir + ';align-items:' + c.labelAlign + ';gap:12px"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(48px,4.6vw,72px);line-height:.8;color:#D64A1B">' + s.n + '</span><span style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#6B635B">' + esc(s.label) + '</span></div></div>' +
      '<div data-reveal="up" style="min-width:0;max-width:780px;display:flex;flex-direction:column;gap:18px">' + inner + '</div>' +
    '</section>';
  }

  function caseHTML(cf) {
    var c = A.caseScope(cf);
    var linkHTML = c.hasLink ? '<a href="' + esc(c.linkHref) + '" target="_blank" rel="noopener" data-magnetic class="' + hv("background:#D64A1B;color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;background:#010101;color:#FFFFFF;font-size:14px;font-weight:500;transition:background .3s">' + esc(c.linkLabel) + '<span>↗</span></a>' : '';
    var quickHTML = c.hasQuick ? (
      '<section style="padding:0 clamp(20px,5vw,72px) clamp(48px,8vh,88px)">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#6B635B"><span style="width:28px;height:1px;background:currentColor"></span>In 30 seconds</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px">' +
          c.quick.map(function (q) {
            return '<div data-reveal="up" data-d="' + q.d + '" style="border:1px solid rgba(1,1,1,.14);border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:12px;transition:background .35s,color .35s,border-color .35s" class="' + hv("background:#010101;color:#FFFFFF;border-color:#010101") + '">' +
              '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:28px;line-height:1;color:#D64A1B">' + q.n + '</span><span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.6">' + esc(q.tag) + '</span></div>' +
              '<div style="font-size:clamp(19px,1.6vw,23px);font-weight:600;letter-spacing:-0.02em;line-height:1.15">' + esc(q.t) + '</div>' +
              '<p style="margin:0;font-size:15px;line-height:1.5;opacity:.75">' + esc(q.b) + '</p>' +
            '</div>';
          }).join("") +
        '</div>' +
      '</section>'
    ) : '';
    var noteHTML = c.hasNote ? '<p style="max-width:1240px;margin:0 auto;padding:20px clamp(20px,5vw,72px) 0;font-size:13px;color:#6B635B">' + esc(c.note) + '</p>' : '';
    return chrome(
      '<main data-screen-label="Case study">' +
        '<section data-ref="heroSec" style="position:relative;overflow:hidden;padding:clamp(84px,12vh,120px) clamp(20px,5vw,72px) clamp(40px,7vh,72px)">' +
          glHero() +
          '<div style="position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px">' +
            '<button data-act="go" data-route="work" class="' + hv("background:#010101;color:#FFFFFF") + '" style="display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;border:1px solid rgba(1,1,1,.16);background:rgba(255,255,255,.92);cursor:pointer;font-size:14px;transition:background .3s,color .3s">← All work</button>' +
            '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px"><span style="font-size:13px;background:rgba(255,255,255,.92);border-radius:999px;padding:8px 14px">' + esc(c.role) + ' · ' + esc(c.domain) + '</span>' + linkHTML + '</div>' +
          '</div>' +
          '<div style="position:relative;display:grid;grid-template-columns:' + c.heroCols + ';gap:clamp(28px,4vw,64px);align-items:center;margin-top:clamp(36px,7vh,72px)">' +
            '<div style="min-width:0">' +
              '<div style="overflow:hidden;padding-bottom:.1em"><div data-reveal="word" style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(60px,9vw,150px);line-height:.86;letter-spacing:-0.035em;color:#D64A1B">' + esc(c.title) + '</div></div>' +
              '<h1 data-reveal="up" data-d="140" style="margin:clamp(14px,2.4vh,22px) 0 0;max-width:30ch;font-weight:500;font-size:clamp(20px,2.1vw,32px);line-height:1.18;letter-spacing:-0.03em;text-wrap:pretty">' + esc(c.resultLine) + '</h1>' +
              '<div data-reveal="up" data-d="260" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:0 24px;margin-top:clamp(22px,4vh,36px)">' +
                c.glance.map(function (g) { return '<div style="padding:10px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="letter-spacing:.09em;text-transform:uppercase;font-size:11px;color:#6B635B;margin-bottom:3px">' + esc(g.k) + '</div><div style="font-size:14px;line-height:1.4;font-weight:500">' + esc(g.v) + '</div></div>'; }).join("") +
              '</div>' +
            '</div>' +
            '<div data-reveal="up" data-d="200" style="min-width:0;perspective:1400px">' +
              '<div data-tilt style="position:relative;aspect-ratio:4/3;border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#F6F1EB;box-shadow:0 40px 80px -30px rgba(1,1,1,.35),0 0 0 1px rgba(1,1,1,.06);transition:transform .25s ease-out">' +
                imgTag(c.heroId, c.heroHint) +
                '<div data-glare style="position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:clamp(16px,3vw,48px);margin-top:clamp(36px,7vh,72px)">' +
            c.metrics.map(function (m) { return '<div data-reveal="up" data-d="' + m.d + '" style="border-top:2px solid #010101;padding-top:16px"><div data-count style="font-size:clamp(44px,5.6vw,88px);font-weight:500;letter-spacing:-0.055em;line-height:.9;color:' + m.ink + '">' + esc(m.v) + '</div><div style="margin-top:10px;font-size:14px;line-height:1.4;color:#6B635B;max-width:26ch">' + esc(m.l) + '</div></div>'; }).join("") +
          '</div>' +
        '</section>' +
        quickHTML +
        '<div style="border-top:1px solid #010101">' + c.steps.map(function (s) { return caseStepHTML(s, c); }).join("") + noteHTML + '</div>' +
        '<section style="padding:clamp(48px,8vh,96px) clamp(20px,5vw,72px) clamp(40px,6vh,80px)">' +
          '<div data-act="go" data-route="' + c.next.route + '" data-cursor="Next" data-tilt style="position:relative;cursor:pointer;overflow:hidden;border-radius:clamp(24px,3vw,38px);background:#010101;color:#FFFFFF;min-height:clamp(320px,52vh,520px);display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,4vw,56px);transition:transform .25s ease-out">' +
            '<div style="position:absolute;inset:0;opacity:.6">' + imgTag("card-" + c.next.route.split("/")[1], c.next.title + " — preview") + '</div>' +
            '<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,rgba(1,1,1,.95) 10%,rgba(1,1,1,.2) 70%),radial-gradient(ellipse at 100% 0%,rgba(214,74,27,.35),rgba(1,1,1,0) 55%)"></div>' +
            '<div data-glare style="position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s"></div>' +
            '<div style="position:relative;pointer-events:none;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px">' +
              '<div><div style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#C9BDB1;margin-bottom:14px">' + esc(c.next.label) + '</div><div style="font-size:clamp(44px,8vw,128px);font-weight:500;letter-spacing:-0.055em;line-height:.9">' + esc(c.next.title) + '</div></div>' +
              '<span style="flex:none;width:clamp(64px,7vw,96px);height:clamp(64px,7vw,96px);border-radius:50%;background:#FFFFFF;color:#010101;display:flex;align-items:center;justify-content:center;font-size:clamp(24px,2.6vw,34px)">→</span>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</main>'
    );
  }

  // ---- Supporting project ----------------------------------------------
  function projectHTML(pf) {
    var p = A.projScope(pf);
    var linkHTML = p.hasLink ? '<a href="' + esc(p.linkHref) + '" target="_blank" rel="noopener" data-magnetic class="' + hv("background:#D64A1B;color:#FFFFFF") + '" style="margin-top:18px;display:flex;align-items:center;justify-content:space-between;height:50px;padding:0 20px;border-radius:999px;background:#010101;color:#FFFFFF;font-size:14px;font-weight:500;transition:background .3s">' + esc(p.linkLabel) + '<span>↗</span></a>' : '';
    var contextHTML = p.hasContext ? '<p data-reveal="up" style="margin:0;text-wrap:pretty"><strong style="color:#010101;font-weight:600">Context — </strong>' + esc(p.context) + '</p>' : '';
    var recognitionHTML = p.hasRecognition ? '<p data-reveal="up" style="margin:0"><strong style="color:#010101;font-weight:600">Recognition — </strong>' + esc(p.recognition) + '</p>' : '';
    var noteHTML = p.hasNote ? '<p style="margin:16px 0 0;font-size:13px;color:#6B635B">' + esc(p.note) + '</p>' : '';
    return chrome(
      '<main data-screen-label="Project" style="padding:0 clamp(20px,5vw,72px) clamp(60px,10vh,120px)">' +
        '<section data-ref="heroSec" style="position:relative;margin:0 calc(clamp(20px,5vw,72px) * -1) clamp(36px,6vh,64px);min-height:clamp(540px,88vh,920px);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(100px,14vh,150px) clamp(20px,5vw,72px) clamp(28px,5vh,56px)">' +
          glHero() +
          '<div style="position:relative">' +
            '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;margin-bottom:clamp(28px,5vh,56px)">' +
              '<button data-act="go" data-route="work" class="' + hv("background:#010101;color:#FFFFFF") + '" style="background:none;border:1px solid rgba(1,1,1,.16);border-radius:999px;height:44px;padding:0 18px;cursor:pointer;font-size:14px;transition:background .3s,color .3s">← All work</button>' +
              '<span style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">Supporting project ' + p.n + ' · ' + esc(p.domain) + '</span>' +
            '</div>' +
            '<h1 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(48px,9vw,140px);line-height:.9;letter-spacing:-0.055em">' + esc(p.title) + '</h1>' +
            '<p data-reveal="up" data-d="80" style="margin:18px 0 0;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(24px,2.8vw,40px);line-height:1.1;color:#D64A1B;max-width:24ch">' + esc(p.sub) + '</p>' +
          '</div>' +
        '</section>' +
        '<div style="display:flex;flex-wrap:wrap;gap:clamp(32px,5vw,88px);margin-top:clamp(40px,7vh,72px);align-items:flex-start">' +
          '<div style="flex:1 1 260px;display:flex;flex-direction:column">' +
            p.meta.map(function (g) { return '<div style="padding:14px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="font-size:12px;color:#6B635B;margin-bottom:4px">' + esc(g.k) + '</div><div style="font-size:15px;font-weight:500;line-height:1.4">' + esc(g.v) + '</div></div>'; }).join("") +
            linkHTML +
          '</div>' +
          '<div style="flex:3 1 520px;max-width:760px;min-width:0;display:flex;flex-direction:column;gap:28px;font-size:clamp(16px,1.25vw,18px);line-height:1.62;color:#2E2925">' +
            contextHTML +
            '<p data-reveal="up" style="margin:0;text-wrap:pretty">' + esc(p.body) + '</p>' +
            '<div data-reveal="up" style="background:#010101;color:#FFFFFF;border-radius:22px;padding:clamp(22px,3vw,36px)"><div style="font-size:13px;opacity:.7;margin-bottom:10px">The decision that mattered</div><p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(24px,2.6vw,36px);line-height:1.12">' + esc(p.decision) + '</p></div>' +
            '<div data-reveal="up" style="display:flex;gap:16px;align-items:baseline;padding-top:18px;border-top:1px solid #010101;color:#010101;font-size:clamp(18px,1.6vw,22px);letter-spacing:-0.015em"><span style="flex:none;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">Result</span><span style="text-wrap:pretty">' + esc(p.result) + '</span></div>' +
            recognitionHTML +
          '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(16px,2vw,28px);margin-top:clamp(48px,8vh,88px)">' +
          p.images.map(function (s) { return '<figure style="margin:0"><div data-reveal="clip" style="position:relative;aspect-ratio:4/3;border-radius:18px;overflow:hidden;background:#F6F1EB">' + imgTag(s.id, s.t) + '</div><figcaption style="margin-top:10px;font-size:14px;color:#6B635B">' + esc(s.t) + '</figcaption></figure>'; }).join("") +
        '</div>' +
        noteHTML +
        '<button data-act="go" data-route="' + p.next.route + '" data-cursor="Next" class="' + hv("color:#D64A1B") + '" style="margin-top:clamp(72px,12vh,140px);width:100%;background:none;border:0;border-top:1px solid #010101;padding:28px 0 0;cursor:pointer;text-align:left;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;transition:color .3s">' +
          '<span><span style="display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:12px">Next project</span><span style="font-size:clamp(36px,7vw,100px);font-weight:500;letter-spacing:-0.055em;line-height:.9">' + esc(p.next.title) + '</span></span>' +
          '<span style="font-size:clamp(36px,6vw,80px);line-height:1">→</span>' +
        '</button>' +
      '</main>'
    );
  }

  // ---- How I work --------------------------------------------------
  function howHTML() {
    var questions = SD.QUESTIONS.map(function (q, i) {
      var open = A.state.openQ === i;
      return { n: pad(i), q: q[0], a: q[1], rows: open ? "1fr" : "0fr", rot: open ? "45deg" : "0deg", numColor: open ? "#D64A1B" : "#010101" };
    });
    var howLead = SD.HOW_LEAD.map(function (l, i) { return { n: pad(i), t: l[0], b: l[1], d: i * 70 }; });

    var qHTML = questions.map(function (q, i) {
      return '<div data-act="toggle-q" data-i="' + i + '" data-hover-act="q-hover" data-hover-key="' + i + '" style="cursor:pointer;border-top:1px solid #010101;padding:clamp(18px,3vh,30px) 0">' +
        '<div style="display:flex;gap:clamp(14px,3vw,40px);align-items:baseline">' +
          '<span style="flex:none;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:clamp(22px,2.4vw,34px);color:' + q.numColor + ';transition:color .3s">' + q.n + '</span>' +
          '<span style="flex:1;font-size:clamp(24px,3.4vw,50px);font-weight:500;letter-spacing:-0.04em;line-height:1.05">' + esc(q.q) + '</span>' +
          '<span style="flex:none;font-size:28px;line-height:1;transition:transform .45s cubic-bezier(.2,.8,.2,1);transform:rotate(' + q.rot + ')">+</span>' +
        '</div>' +
        '<div style="display:grid;grid-template-rows:' + q.rows + ';transition:grid-template-rows .55s cubic-bezier(.2,.8,.2,1)"><div style="overflow:hidden"><p style="margin:0;padding:16px 0 0 clamp(36px,5.4vw,74px);max-width:720px;font-size:clamp(16px,1.3vw,19px);line-height:1.55;color:#2E2925">' + esc(q.a) + '</p></div></div>' +
      '</div>';
    }).join("");

    var leadHTML = howLead.map(function (l) {
      return '<div data-reveal="up" data-d="' + l.d + '" style="border:1px solid rgba(1,1,1,.16);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:32px;min-height:220px;justify-content:space-between;transition:background .35s,color .35s,border-color .35s" class="' + hv("background:#010101;color:#FFFFFF;border-color:#010101") + '">' +
        '<span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:22px">' + l.n + '</span>' +
        '<div><div style="font-size:20px;font-weight:600;letter-spacing:-0.02em;margin-bottom:8px">' + esc(l.t) + '</div><div style="font-size:15px;line-height:1.5;opacity:.72">' + esc(l.b) + '</div></div>' +
      '</div>';
    }).join("");

    return chrome(
      '<main data-screen-label="How I work" style="padding:0 clamp(20px,5vw,72px) clamp(60px,10vh,120px)">' +
        '<section data-ref="heroSec" style="position:relative;margin:0 calc(clamp(20px,5vw,72px) * -1) clamp(36px,6vh,64px);min-height:clamp(540px,88vh,920px);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(100px,14vh,150px) clamp(20px,5vw,72px) clamp(28px,5vh,56px)">' +
          glHero() +
          '<div style="position:relative"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:20px">Process</div>' +
          '<h1 data-reveal="up" style="margin:0;max-width:13ch;font-weight:500;font-size:clamp(46px,8.6vw,136px);line-height:.92;letter-spacing:-0.055em">How I make <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">design decisions.</span></h1></div>' +
        '</section>' +
        '<section style="margin-top:clamp(56px,10vh,120px)">' +
          '<div style="display:flex;justify-content:space-between;gap:16px;padding-bottom:12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B"><span>Four questions I ask on every project</span><span>Tap to open</span></div>' +
          qHTML +
          '<p data-reveal="up" style="margin:0;padding-top:24px;border-top:1px solid #010101;font-size:15px;color:#6B635B;max-width:620px">The methods change with the problem — interviews, competitive analysis, usability testing, analytics — but those four questions don\'t.</p>' +
        '</section>' +
        '<section style="margin-top:clamp(80px,14vh,160px)">' +
          '<h2 data-reveal="up" style="margin:0 0 36px;font-weight:500;font-size:clamp(34px,5vw,72px);letter-spacing:-0.045em;line-height:1">How I lead</h2>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px">' + leadHTML + '</div>' +
        '</section>' +
        '<section style="margin-top:clamp(80px,14vh,160px);background:#F6F1EB;border-radius:clamp(20px,3vw,36px);padding:clamp(28px,5vw,72px)">' +
          '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:18px">How I work with AI</div>' +
          '<h2 data-reveal="up" style="margin:0 0 clamp(32px,5vh,56px);max-width:16ch;font-weight:500;font-size:clamp(32px,4.8vw,72px);letter-spacing:-0.045em;line-height:1">I design AI products, <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">and I design with AI.</span></h2>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:clamp(20px,3vw,40px)">' +
            '<div data-reveal="up" style="border-top:1px solid #010101;padding-top:18px"><div style="font-size:18px;font-weight:600;margin-bottom:10px">Designing AI products</div><p style="margin:0;font-size:16px;line-height:1.55;color:#2E2925">Aimate taught me the hard parts of AI UX — showing uncertainty honestly, comparing model outputs, and making AI results trustworthy and actionable.</p></div>' +
            '<div data-reveal="up" data-d="80" style="border-top:1px solid #010101;padding-top:18px"><div style="font-size:18px;font-weight:600;margin-bottom:10px">Designing with AI</div><p style="margin:0;font-size:16px;line-height:1.55;color:#2E2925">I use AI to speed up research synthesis, explore layout directions and produce product videos, then apply my own judgment to what ships. My everyday tools: Claude for research synthesis and writing, Claude Design and AI video generators for product demos, and Google Vids for voiceovers.</p></div>' +
            '<div data-reveal="up" data-d="160" style="border-top:1px solid #010101;padding-top:18px"><div style="font-size:18px;font-weight:600;margin-bottom:10px">Training</div><p style="margin:0;font-size:16px;line-height:1.55;color:#2E2925">Certified in AI-Enhanced Design and GenAI for UI/UX (2024).</p></div>' +
          '</div>' +
          '<div data-reveal="clip" style="position:relative;margin-top:clamp(32px,5vh,56px);aspect-ratio:16/9;border-radius:20px;overflow:hidden;background:#FFFFFF">' + imgTag("how-ai-recording", "Screen recording — working with AI on a real design problem (3–5 min)") + '</div>' +
        '</section>' +
        '<section style="margin-top:clamp(80px,14vh,160px);text-align:center">' +
          '<p data-reveal="up" style="margin:0 auto;max-width:18ch;font-family:\'Instrument Serif\',serif;font-size:clamp(38px,6.4vw,100px);line-height:.98;letter-spacing:-0.02em">“The best design decisions I\'ve made were about <span style="font-style:italic;color:#D64A1B">what to remove.</span>”</p>' +
        '</section>' +
      '</main>'
    );
  }

  // ---- About -------------------------------------------------------
  function aboutHTML() {
    var aboutLead = SD.ABOUT_LEAD.map(function (l) { return { n: pad(0), t: l[0], b: l[1] }; });
    var principles = SD.PRINCIPLES.map(function (l, i) { return { n: pad(i), t: l[0], b: l[1], d: i * 70 }; });
    var experience = SD.EXP.map(function (e) { return { y: e[0], role: e[1], co: e[2], what: e[3] }; });
    var skills = SD.SKILLS.map(function (s) { return { a: s[0], items: s[1].split(", ") }; });
    var beyond = SD.BEYOND.map(function (b, i) { return { t: b[0], b: b[1], img: b[2] || null, hint: b[3] || "", d: (i % 3) * 80 }; });

    var leadHTML = SD.ABOUT_LEAD.map(function (l, i) {
      return '<div data-reveal="up" style="display:flex;gap:20px;padding:20px 0;border-top:1px solid rgba(1,1,1,.14)"><span style="flex:none;width:30px;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:20px;color:#D64A1B">' + pad(i) + '</span><div><div style="font-size:clamp(19px,1.7vw,24px);font-weight:500;letter-spacing:-0.02em;margin-bottom:6px">' + esc(l[0]) + '</div><div style="font-size:16px;line-height:1.55;color:#2E2925">' + esc(l[1]) + '</div></div></div>';
    }).join("");

    var principlesHTML = principles.map(function (l) {
      return '<div data-reveal="up" data-d="' + l.d + '" style="position:relative;overflow:hidden;border-radius:20px;background:#F6F1EB;padding:24px;min-height:260px;display:flex;flex-direction:column;justify-content:space-between;gap:24px;transition:background .4s,color .4s,transform .5s cubic-bezier(.2,.8,.2,1)" class="' + hv("background:#D64A1B;color:#FFFFFF;transform:translateY(-6px) rotate(-1deg)") + '">' +
        '<span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:44px;line-height:1">' + l.n + '</span>' +
        '<div><div style="font-size:22px;font-weight:600;letter-spacing:-0.025em;line-height:1.1;margin-bottom:10px">' + esc(l.t) + '</div><div style="font-size:15px;line-height:1.5;opacity:.8">' + esc(l.b) + '</div></div>' +
      '</div>';
    }).join("");

    var expHTML = experience.map(function (e) {
      return '<div data-reveal="up" style="display:flex;flex-wrap:wrap;gap:8px 28px;padding:22px 12px;border-top:1px solid #010101;transition:background .35s,padding .35s" class="' + hv("background:#F6F1EB") + '">' +
        '<span style="flex:1 1 150px;font-size:14px;color:#6B635B">' + esc(e.y) + '</span>' +
        '<div style="flex:2 1 260px"><div style="font-size:clamp(19px,1.8vw,26px);font-weight:500;letter-spacing:-0.025em">' + esc(e.role) + '</div><div style="font-family:\'Instrument Serif\',serif;font-style:italic;font-size:19px;color:#D64A1B;margin-top:2px">' + esc(e.co) + '</div></div>' +
        '<p style="flex:3 1 320px;margin:0;font-size:15px;line-height:1.55;color:#2E2925">' + esc(e.what) + '</p>' +
      '</div>';
    }).join("");

    var skillTagHv = hv("background:#010101;color:#FFFFFF;border-color:#010101");
    var skillsHTML = skills.map(function (s) {
      return '<div data-reveal="up" style="display:flex;flex-wrap:wrap;gap:12px 28px;padding:18px 0;border-top:1px solid rgba(1,1,1,.14)"><span style="flex:1 1 200px;font-size:16px;font-weight:600">' + esc(s.a) + '</span><div style="flex:3 1 400px;display:flex;flex-wrap:wrap;gap:6px">' +
        s.items.map(function (t) { return '<span style="border:1px solid rgba(1,1,1,.18);border-radius:999px;padding:6px 12px;font-size:14px;transition:background .25s,color .25s,border-color .25s" class="' + skillTagHv + '">' + esc(t) + '</span>'; }).join("") +
      '</div></div>';
    }).join("");

    var beyondHTML = beyond.map(function (b) {
      var imgBlock = b.img ? '<div style="position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:#1C1714">' + imgTag(b.img, b.hint) + '</div>' : '';
      return '<div data-reveal="up" data-d="' + b.d + '" style="display:flex;flex-direction:column;gap:14px">' + imgBlock +
        '<div style="border-top:1px solid rgba(255,255,255,.28);padding-top:14px"><div style="font-size:19px;font-weight:600;margin-bottom:8px">' + esc(b.t) + '</div><p style="margin:0;font-size:15px;line-height:1.55;color:#DDD3C9">' + esc(b.b) + '</p></div>' +
      '</div>';
    }).join("");

    return chrome(
      '<main data-screen-label="About" style="padding:0 clamp(20px,5vw,72px) clamp(60px,10vh,120px)">' +
        '<section data-ref="heroSec" style="position:relative;margin:0 calc(clamp(20px,5vw,72px) * -1) clamp(36px,6vh,64px);min-height:clamp(540px,88vh,920px);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(100px,14vh,150px) clamp(20px,5vw,72px) clamp(28px,5vh,56px)">' +
          glHero() +
          '<div style="position:relative;display:flex;flex-wrap:wrap;gap:clamp(28px,5vw,72px);align-items:flex-end">' +
            '<div style="flex:2 1 440px"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:20px">About</div>' +
              '<h1 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(38px,6.2vw,96px);line-height:.96;letter-spacing:-0.05em;text-wrap:balance">I\'m Aditi. I make complex products feel simple — <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#D64A1B">and I measure whether they do.</span></h1>' +
            '</div>' +
            '<div data-reveal="clip" style="flex:1 1 240px;max-width:380px;position:relative;aspect-ratio:4/5;border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#F6F1EB">' + imgTag("about-portrait", "Portrait of Aditi") + '</div>' +
          '</div>' +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px);display:flex;flex-wrap:wrap;gap:clamp(24px,5vw,88px)">' +
          '<div style="flex:1 1 200px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(01) My story</div>' +
          '<div style="flex:3 1 520px;max-width:820px;display:flex;flex-direction:column;gap:24px">' +
            '<p data-reveal="up" style="margin:0;font-size:clamp(22px,2.4vw,34px);line-height:1.25;letter-spacing:-0.025em;text-wrap:pretty">I trained as a designer at the Uttar Pradesh Institute of Design, and started my career in 2020 as a graphic designer — first at Samagra Foundation, then at Yantromintra. That early work taught me something most product designers learn late: <span style="font-family:\'Instrument Serif\',serif;font-style:italic;color:#D64A1B">design has to earn attention, and it has to move a number.</span></p>' +
            '<p data-reveal="up" style="margin:0;font-size:clamp(16px,1.3vw,19px);line-height:1.62;color:#2E2925;text-wrap:pretty">Over the next five years I moved into product design and took on steadily bigger problems. I joined Centricity WealthTech in its first months, and as it grew into India’s largest assisted wealthtech platform I spent over three years turning wealth-management workflows — many of them living in Excel — into products relationship managers and investors could actually use. Today at ZenTrades.AI, I lead design across a field-service SaaS platform: its design system, 15+ product dashboards, and its marketing websites.</p>' +
            '<p data-reveal="up" style="margin:0;font-size:clamp(16px,1.3vw,19px);line-height:1.62;color:#2E2925;text-wrap:pretty">Along the way I did something that changed how I think about design: I designed and launched my own AI product, Aimate. Being the founder, the designer and the person selling it made me ruthless about one question — does this help someone decide faster?</p>' +
          '</div>' +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px);display:flex;flex-wrap:wrap;gap:clamp(24px,5vw,88px)">' +
          '<div style="flex:1 1 200px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(02) How I lead</div>' +
          '<div style="flex:3 1 520px;max-width:820px">' + leadHTML + '</div>' +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px)">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:32px"><h2 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(32px,4.6vw,68px);letter-spacing:-0.045em;line-height:1">Principles I design by</h2><span style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(03)</span></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px">' + principlesHTML + '</div>' +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px)">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:24px"><h2 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(32px,4.6vw,68px);letter-spacing:-0.045em;line-height:1">Experience</h2><span style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(04) 2020 — now</span></div>' +
          expHTML +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(28px,4vw,56px)">' +
          '<div data-reveal="up"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:18px">(05) Education &amp; certifications</div>' +
            '<div style="padding:14px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="font-weight:600">Bachelor of Design (B.Des)</div><div style="font-size:14px;color:#6B635B">Uttar Pradesh Institute of Design, Noida — 2020</div></div>' +
            '<div style="padding:14px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="font-weight:600">AI-Enhanced Design and GenAI for UI/UX</div><div style="font-size:14px;color:#6B635B">2024</div></div>' +
            '<div style="padding:14px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="font-weight:600">Advanced UX Design and Research</div><div style="font-size:14px;color:#6B635B">Udemy — 2024</div></div>' +
            '<div style="padding:14px 0;border-top:1px solid rgba(1,1,1,.14)"><div style="font-weight:600">Design Thinking and Agile Methodologies</div><div style="font-size:14px;color:#6B635B">2022</div></div>' +
          '</div>' +
          '<div data-reveal="up" data-d="80"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:18px">(06) Languages</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
              '<span style="border:1px solid #010101;border-radius:999px;padding:10px 16px;font-size:15px">English <span style="color:#6B635B">· professional</span></span>' +
              '<span style="border:1px solid #010101;border-radius:999px;padding:10px 16px;font-size:15px">Hindi <span style="color:#6B635B">· native</span></span>' +
              '<span style="border:1px dashed #010101;border-radius:999px;padding:10px 16px;font-size:15px">French <span style="color:#6B635B">· learning</span></span>' +
            '</div>' +
            '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin:40px 0 14px">Outside work</div>' +
            '<p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(24px,2.4vw,32px);line-height:1.15">When I\'m not designing, I\'m based in the Himalayan town of Mandi — <span style="font-style:italic;color:#D64A1B">a good place to think clearly.</span></p>' +
          '</div>' +
        '</section>' +

        '<section style="margin-top:clamp(72px,12vh,140px)">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:24px"><h2 data-reveal="up" style="margin:0;font-weight:500;font-size:clamp(32px,4.6vw,68px);letter-spacing:-0.045em;line-height:1">What I bring to a team.</h2><span style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B">(07) Skills</span></div>' +
          skillsHTML +
        '</section>' +

        '<section style="margin-top:clamp(80px,14vh,160px);background:#010101;color:#FFFFFF;border-radius:clamp(20px,3vw,36px);padding:clamp(28px,5vw,72px)">' +
          '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:18px">(08) Beyond UI/UX</div>' +
          '<h2 data-reveal="up" style="margin:0;max-width:14ch;font-weight:500;font-size:clamp(34px,5vw,76px);letter-spacing:-0.045em;line-height:1">A designer who thinks <span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#FFB38A">beyond the screen.</span></h2>' +
          '<p data-reveal="up" style="margin:24px 0 clamp(36px,6vh,64px);max-width:560px;font-size:clamp(16px,1.3vw,19px);line-height:1.55;color:#EFE7DF">Products succeed when the brand, the story and the experience all say the same thing. So I design all three.</p>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:clamp(20px,2.4vw,32px)">' + beyondHTML + '</div>' +
        '</section>' +
      '</main>'
    );
  }

  // ---- Contact -------------------------------------------------------
  function contactRowHTML(num, label, value, href, extra) {
    extra = extra || {};
    var tag = extra.tag || "a";
    var attrs = extra.attrs || ('href="' + href + '"');
    return '<' + tag + ' ' + attrs + ' data-reveal="up" class="' + hv("background-size:100% 100%;color:#FFFFFF") + '" style="position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;width:100%;text-align:left;padding:16px 18px;border:1px solid #010101;border-radius:20px;background:linear-gradient(#010101,#010101) no-repeat 0 0 / 0% 100%;color:#010101;cursor:pointer;font:inherit;transition:background-size .6s cubic-bezier(.7,0,.2,1),color .4s">' +
      '<span style="flex:none;width:46px;height:46px;border-radius:50%;background:#F6F1EB;color:#D64A1B;display:flex;align-items:center;justify-content:center;font-family:\'Instrument Serif\',serif;font-style:italic;font-size:19px">' + num + '</span>' +
      '<span style="flex:1;min-width:0"><span style="display:block;font-size:12px;opacity:.65;margin-bottom:3px">' + label + '</span><span style="display:block;font-size:clamp(17px,1.8vw,24px);font-weight:500;letter-spacing:-0.025em;overflow-wrap:anywhere">' + esc(value) + '</span></span>' +
      '<span style="flex:none;font-size:13px;border:1px solid currentColor;border-radius:999px;padding:6px 12px">' + (extra.action || "↗") + '</span>' +
    '</' + tag + '>';
  }

  function contactHTML() {
    var talkChars = Array.prototype.slice.call("Let's").map(function (ch) { return '<span data-vw style="display:inline-block;transition:font-weight .3s ease-out">' + esc(ch) + '</span>'; }).join("");
    var roles = ["Senior Product Designer", "Lead Designer", "UX Designer"];
    var roleBtns = roles.map(function (label, i) {
      var active = A.state.role === i;
      return '<button type="button" data-act="pick-role" data-i="' + i + '" style="height:42px;padding:0 16px;border-radius:999px;border:1px solid ' + (active ? "#D64A1B" : "rgba(255,255,255,.35)") + ';background:' + (active ? "#D64A1B" : "transparent") + ';color:#FFFFFF;font-size:15px;cursor:pointer;transition:background .3s,border-color .3s,transform .3s" class="' + hv("transform:translateY(-2px)") + '">' + label + '</button>';
    }).join("");
    var formHTML = !A.state.sent ? (
      '<form data-act="submit-contact">' +
        '<div style="font-size:clamp(21px,2.2vw,31px);line-height:1.75;letter-spacing:-0.02em;font-weight:500">Hi Aditi, I\'m <input name="name" placeholder="your name" required autocomplete="name" class="' + fc("border-bottom:2px solid #D64A1B") + '" style="display:inline-block;width:7.5em;max-width:100%;margin:0 .15em;padding:0 .15em;border:0;border-bottom:2px dashed rgba(255,255,255,.45);border-radius:0;background:transparent;color:#FFB38A;font:inherit;outline:none;transition:border-color .3s"> from <input name="company" placeholder="company" autocomplete="organization" class="' + fc("border-bottom:2px solid #D64A1B") + '" style="display:inline-block;width:6.5em;max-width:100%;margin:0 .15em;padding:0 .15em;border:0;border-bottom:2px dashed rgba(255,255,255,.45);border-radius:0;background:transparent;color:#FFB38A;font:inherit;outline:none;transition:border-color .3s">. We\'re hiring a</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 14px">' + roleBtns + '</div>' +
        '<div style="font-size:clamp(21px,2.2vw,31px);line-height:1.75;letter-spacing:-0.02em;font-weight:500">and I\'d love to talk about <input name="message" placeholder="the problem" required class="' + fc("border-bottom:2px solid #D64A1B") + '" style="display:inline-block;width:11em;max-width:100%;margin:0 .15em;padding:0 .15em;border:0;border-bottom:2px dashed rgba(255,255,255,.45);border-radius:0;background:transparent;color:#FFB38A;font:inherit;outline:none;transition:border-color .3s">. Reach me at <input name="email" placeholder="email" required type="email" autocomplete="email" class="' + fc("border-bottom:2px solid #D64A1B") + '" style="display:inline-block;width:10em;max-width:100%;margin:0 .15em;padding:0 .15em;border:0;border-bottom:2px dashed rgba(255,255,255,.45);border-radius:0;background:transparent;color:#FFB38A;font:inherit;outline:none;transition:border-color .3s">.</div>' +
        '<button type="submit" data-magnetic class="' + hv("background:#D64A1B;color:#FFFFFF") + '" style="margin-top:28px;display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 28px;border-radius:999px;border:0;background:#FFFFFF;color:#010101;font-size:15px;font-weight:600;cursor:pointer;transition:background .3s,color .3s">Send message<span>→</span></button>' +
      '</form>'
    ) : (
      '<div style="min-height:300px;display:flex;flex-direction:column;justify-content:center;gap:18px"><span style="width:56px;height:56px;border-radius:50%;background:#D64A1B;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:24px">✓</span><p style="margin:0;font-family:\'Instrument Serif\',serif;font-size:clamp(28px,3vw,42px);line-height:1.1">Thanks — I\'ll get back to you within two working days.</p></div>'
    );

    return chrome(
      '<main data-screen-label="Contact" style="padding:0 clamp(20px,5vw,72px) clamp(60px,10vh,120px)">' +
        '<section data-ref="heroSec" style="position:relative;margin:0 calc(clamp(20px,5vw,72px) * -1) clamp(36px,6vh,64px);min-height:clamp(540px,88vh,920px);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(100px,14vh,150px) clamp(20px,5vw,72px) clamp(28px,5vh,56px)">' +
          glHero() +
          '<div style="position:relative"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B635B;margin-bottom:20px">Contact</div>' +
          '<h1 style="margin:0;font-weight:500;font-size:clamp(72px,17vw,280px);line-height:.84;letter-spacing:-0.065em;display:flex;flex-wrap:wrap;column-gap:.18em">' +
            '<span style="display:inline-block;overflow:hidden;padding-bottom:.06em"><span data-reveal="word" style="display:inline-block;white-space:nowrap">' + talkChars + '</span></span>' +
            '<span style="display:inline-block;overflow:hidden;padding-bottom:.06em"><span data-reveal="word" data-d="90" style="display:inline-block;font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;letter-spacing:-0.03em;color:#D64A1B">talk.</span></span>' +
          '</h1>' +
          '<div data-reveal="up" data-d="250" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(20px,4vh,36px)">' +
            '<span style="display:inline-flex;align-items:center;gap:8px;background:#010101;color:#FFFFFF;border-radius:999px;padding:9px 15px;font-size:14px"><span style="width:7px;height:7px;border-radius:50%;background:#D64A1B;animation:pulse 2.2s infinite"></span>Open to Senior / Lead roles</span>' +
            '<span style="background:#FFFFFF;border:1px solid rgba(1,1,1,.16);border-radius:999px;padding:9px 15px;font-size:14px">Switzerland · Germany · Spain · US</span>' +
            '<span style="background:#FFFFFF;border:1px solid rgba(1,1,1,.16);border-radius:999px;padding:9px 15px;font-size:14px">Relocation-ready · 30-day notice</span>' +
            '<span data-ref="contactClock" style="background:#FFFFFF;border:1px solid rgba(1,1,1,.16);border-radius:999px;padding:9px 15px;font-size:14px">Mandi · </span>' +
          '</div></div>' +
        '</section>' +
        '<div style="display:flex;flex-wrap:wrap;gap:clamp(32px,5vw,80px);margin-top:clamp(24px,5vh,56px);align-items:flex-start">' +
          '<div style="flex:1 1 340px;max-width:560px">' +
            '<p data-reveal="up" style="margin:0 0 32px;font-size:clamp(18px,1.6vw,22px);line-height:1.5;color:#2E2925;text-wrap:pretty">I\'m open to Senior Product Designer, Lead and UX roles in Switzerland, Germany, Spain, the US and beyond — on-site, hybrid or remote, and I\'m happy to relocate. If you\'re building something where clarity matters, I\'d love to hear about it.</p>' +
            '<div style="display:flex;flex-direction:column;gap:10px">' +
              contactRowHTML("01", "Email", "taditi555@gmail.com", "", { tag: "button", attrs: 'type="button" data-act="copy-email" data-ref="copyBtn"', action: '<span data-ref="copyLabel">Copy</span>' }) +
              contactRowHTML("02", "LinkedIn", "in/aditi-tiwari-39384918a", "https://www.linkedin.com/in/aditi-tiwari-39384918a", { attrs: 'href="https://www.linkedin.com/in/aditi-tiwari-39384918a" target="_blank" rel="noopener"' }) +
              contactRowHTML("03", "Behance", "behance.net/adititiwar2841", "https://www.behance.net/adititiwar2841", { attrs: 'href="https://www.behance.net/adititiwar2841" target="_blank" rel="noopener"' }) +
              contactRowHTML("04", "Résumé", "Download PDF", "Aditi-Tiwari-CV.pdf", { attrs: 'href="' + A.base() + 'Aditi-Tiwari-CV.pdf" download', action: "↓" }) +
            '</div>' +
          '</div>' +
          '<div data-reveal="up" style="flex:1.2 1 380px;max-width:700px;position:relative;overflow:hidden;border-radius:clamp(22px,2.6vw,34px);background:#010101;color:#FFFFFF;padding:clamp(24px,3.6vw,52px)">' +
            '<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 100% 0%,rgba(214,74,27,.4),rgba(1,1,1,0) 55%)"></div>' +
            '<div style="position:relative"><div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C9BDB1;margin-bottom:22px">Write to me — fill in the blanks</div><div data-ref="contactFormWrap">' + formHTML + '</div></div>' +
          '</div>' +
        '</div>' +
      '</main>'
    );
  }

  window.__SCREENS = { chrome: chrome, homeHTML: homeHTML, workHTML: workHTML, caseHTML: caseHTML, projectHTML: projectHTML, howHTML: howHTML, aboutHTML: aboutHTML, contactHTML: contactHTML, wordsHTML: wordsHTML, glHero: glHero };
})();
