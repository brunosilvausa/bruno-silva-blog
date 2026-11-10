/* @ds-bundle: {"format":4,"namespace":"BrunoSilvaUSA","components":[]} */
/* Bruno Silva USA ships CSS components (classes in bundle.css) plus this small motion helper.
   BrunoSilvaUSA.reveal(root): elements with [data-reveal] fade up when they scroll into view;
   [data-draw] SVG paths draw themselves; [data-progress] bars follow the reading position; .bs-spotlight cards inside [data-spotlight] light up under the pointer; .bs-orbit glows turn only while on screen; .bs-code fields light up under the pointer; .bs-compare gets its phone switch; .bs-chat demos play while on screen; .bs-beams traces are drawn and pulse; showcase demos and [data-count] numbers animate on screen. Motion pack: [data-scramble] titles decode, [data-mask] text rises word by word, [data-particles] hosts get a reactive dash field, [data-tilt] cards lean and glare (and enter in 3D), .bs-ticker rows loop with the scroll. Runs once on load; call it again after adding content.
   Without this script, or with reduced motion requested, everything is simply visible. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(el) { el.classList.add("is-visible"); }
  function reveal(root) {
    var scope = root || document;
    var items = scope.querySelectorAll("[data-reveal]:not([data-reveal=load]), [data-draw]:not([data-draw=load])");
    if (reduce || !("IntersectionObserver" in window)) { items.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) {
      var group = el.parentElement && el.parentElement.closest("[data-reveal-stagger]");
      if (group) {
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
        el.style.transitionDelay = (siblings.indexOf(el) * 80) + "ms";
      }
      io.observe(el);
    });
  }
  doc.classList.add("bs-js");
  if (reduce) doc.classList.add("bs-reduced");
  /* Reading progress: [data-progress] (a bar) grows with the scroll through its article, set by data-progress="<selector>" or the page. */
  function progress() {
    var bars = document.querySelectorAll("[data-progress]");
    if (!bars.length) return;
    function update() {
      bars.forEach(function (bar) {
        var sel = bar.getAttribute("data-progress");
        var target = sel ? document.querySelector(sel) : null;
        var el = target || document.documentElement;
        var top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
        var span = Math.max(1, (target ? target.offsetHeight : el.scrollHeight) - window.innerHeight);
        var f = Math.min(1, Math.max(0, (window.scrollY - top) / span));
        bar.style.setProperty("--progress", f.toFixed(4));
        bar.setAttribute("aria-valuenow", String(Math.round(f * 100)));
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
  /* Spotlight: one pointer listener for the page. Each .bs-spotlight inside a [data-spotlight] group gets
     --sx/--sy (pointer position from its own corner, in px) and --spot = 1 while the pointer is over the group.
     Fine pointers only; skipped when reduced motion is requested. */
  var spotOn = false;
  function spotlight() {
    if (spotOn || reduce || !window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    spotOn = true;
    var x = 0, y = 0, queued = false, lit = [];
    function paint() {
      queued = false;
      var next = [];
      document.querySelectorAll("[data-spotlight]").forEach(function (g) {
        var r = g.getBoundingClientRect(), pad = 48;
        if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) return;
        g.querySelectorAll(".bs-spotlight").forEach(function (c) {
          var b = c.getBoundingClientRect();
          c.style.setProperty("--sx", (x - b.left).toFixed(1) + "px");
          c.style.setProperty("--sy", (y - b.top).toFixed(1) + "px");
          c.style.setProperty("--spot", "1");
          next.push(c);
        });
      });
      lit.forEach(function (c) { if (next.indexOf(c) < 0) c.style.setProperty("--spot", "0"); });
      lit = next;
    }
    function move(e) { x = e.clientX; y = e.clientY; if (!queued) { queued = true; requestAnimationFrame(paint); } }
    document.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", function () { if (lit.length && !queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () { lit.forEach(function (c) { c.style.setProperty("--spot", "0"); }); lit = []; });
  }
  /* Live: .bs-orbit and any [data-live] block get .is-live while on screen, so their CSS loops run only then. Reduced motion keeps them still. */
  function orbit(root) {
    var els = (root || document).querySelectorAll(".bs-orbit, [data-live]");
    if (!els.length || reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("is-live", e.isIntersecting); });
    });
    els.forEach(function (el) { io.observe(el); });
  }
  /* Code reveal: fills each .bs-code with a field of hex characters (a faint copy, plus a lit copy masked to the
     pointer). The pointer area is the surrounding hero (or the parent). The lit copy reshuffles at most every 90ms. */
  var HEX = "0123456789ABCDEF</>{}#$";
  function chars(n) { var s = ""; for (var i = 0; i < n; i++) s += HEX.charAt(Math.floor(Math.random() * HEX.length)); return s; }
  function code(root) {
    var tiles = (root || document).querySelectorAll(".bs-code");
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    tiles.forEach(function (t) {
      if (t.querySelector(".bs-code__field")) return;
      var n = Math.ceil((t.clientWidth / 10) * (t.clientHeight / 18) * 1.2) || 1200;
      var base = document.createElement("p"); base.className = "bs-code__field"; base.textContent = chars(n);
      t.appendChild(base);
      if (!fine || reduce) return;
      var lit = document.createElement("p"); lit.className = "bs-code__field bs-code__field--lit"; lit.textContent = chars(n);
      t.appendChild(lit);
      var host = t.closest(".bs-lhero") || t.parentElement, last = 0;
      host.addEventListener("pointermove", function (e) {
        var b = t.getBoundingClientRect();
        t.style.setProperty("--mx", (e.clientX - b.left).toFixed(0) + "px");
        t.style.setProperty("--my", (e.clientY - b.top).toFixed(0) + "px");
        t.style.setProperty("--spot", "1");
        var now = Date.now(); if (now - last > 90) { last = now; lit.textContent = chars(n); }
      });
      host.addEventListener("pointerleave", function () { t.style.setProperty("--spot", "0"); });
    });
  }
  /* Comparison: on phones, a two-button switch shows "before" or "after" (data-show on .bs-compare). */
  function compare(root) {
    (root || document).querySelectorAll(".bs-compare").forEach(function (c) {
      var btns = c.querySelectorAll(".bs-compare__switch button");
      if (!btns.length || c.hasAttribute("data-show")) return;
      c.setAttribute("data-show", "after");
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          c.setAttribute("data-show", b.getAttribute("data-side"));
          btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        });
      });
    });
  }
  /* Chat demo: plays the examples in the .bs-chat's JSON script ([{q, a}, …]) in a loop, only while on screen,
     pausing on hover or focus. The first exchange is already in the markup for reduced motion and no-script. */
  function chat(root) {
    (root || document).querySelectorAll(".bs-chat").forEach(function (box) {
      if (box._bsChat || reduce) return;
      var data; try { data = JSON.parse(box.querySelector("script[type='application/json']").textContent); } catch (e) { return; }
      if (!data || !data.length) return;
      box._bsChat = true;
      var log = box.querySelector(".bs-chat__log"), comp = box.querySelector(".bs-chat__composer"), input = box.querySelector(".bs-chat__input");
      var placeholder = input.textContent, run = 0, i = 1 % data.length, visible = false, held = false, timer = null;
      function wait(ms, fn) { var id = run; timer = setTimeout(function () { if (id === run) fn(); }, ms); }
      function msg(kind, who) {
        var p = document.createElement("p"); p.className = "bs-chat__msg bs-chat__msg--" + kind;
        var w = document.createElement("span"); w.className = "bs-chat__who"; w.textContent = who; p.appendChild(w);
        var t = document.createElement("span"); p.appendChild(t); log.appendChild(p);
        while (log.children.length > 4) log.removeChild(log.firstElementChild);
        return t;
      }
      function step() {
        if (!visible || held) return;
        var ex = data[i], k = 0;
        input.classList.add("is-typing"); input.textContent = "";
        (function type() {
          if (k <= ex.q.length) { input.textContent = ex.q.slice(0, k++); comp.classList.toggle("is-ready", k > 1); return wait(38, type); }
          wait(450, function () {
            input.classList.remove("is-typing"); input.textContent = placeholder; comp.classList.remove("is-ready");
            msg("user", "Você").textContent = ex.q;
            var t = msg("ai", "IA"); t.innerHTML = '<span class="bs-chat__thinking" aria-hidden="true">Pensando…</span>';
            var words = ex.a.split(/(\s+)/), n = 0;
            wait(1400, function words1() {
              if (n === 0) t.textContent = "";
              if (n < words.length) { t.textContent += words[n++]; return wait(45, words1); }
              i = (i + 1) % data.length; wait(4200, step);
            });
          });
        })();
      }
      function stop() { run++; clearTimeout(timer); input.classList.remove("is-typing"); input.textContent = placeholder; comp.classList.remove("is-ready"); }
      function go() { stop(); if (visible && !held) wait(1200, step); }
      box.addEventListener("pointerenter", function () { held = true; stop(); });
      box.addEventListener("pointerleave", function () { held = false; go(); });
      box.addEventListener("focusin", function () { held = true; stop(); });
      box.addEventListener("focusout", function () { held = false; go(); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; go(); }); }, { threshold: 0.4 }).observe(box);
      } else { visible = true; go(); }
    });
  }
  function isLive(el) { var h = el.closest("[data-live]"); return !h || h.classList.contains("is-live"); }
  /* AI beams: draws circuit traces (orthogonal, chamfered corners) from each .bs-beams__node to the core,
     each with a volt pulse; redrawn when the layout changes. */
  function beams(root) {
    (root || document).querySelectorAll(".bs-beams").forEach(function (box) {
      if (box._bsBeams) return; box._bsBeams = true;
      var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "bs-beams__svg"); svg.setAttribute("aria-hidden", "true"); box.insertBefore(svg, box.firstChild);
      var core = box.querySelector(".bs-beams__core"), nodes = box.querySelectorAll(".bs-beams__node");
      function draw() {
        var B = box.getBoundingClientRect(), C = core.getBoundingClientRect(), html = "";
        var cx = C.left + C.width / 2 - B.left, cy = C.top + C.height / 2 - B.top, r = C.width / 2;
        svg.setAttribute("viewBox", "0 0 " + B.width + " " + B.height);
        nodes.forEach(function (n, i) {
          var N = n.getBoundingClientRect(), nx = N.left + N.width / 2 - B.left, ny = N.top + N.height / 2 - B.top, d;
          if (N.top > C.bottom) {
            /* Node below the core (phone layout): run from its inner side to a central spine, then up into the core. */
            var sx3 = nx < cx ? 1 : -1, x0 = nx + sx3 * N.width / 2, c3 = Math.min(12, Math.abs(cx - x0) / 2);
            d = "M" + x0 + " " + ny + " H" + (cx - sx3 * c3) + " L" + cx + " " + (ny - c3) + " V" + (cy + r);
          } else if (Math.abs(nx - cx) > Math.abs(ny - cy) * 1.2) {
            var sx = nx < cx ? 1 : -1, x1 = nx + sx * N.width / 2, x2 = cx - sx * r, xm = (x1 + x2) / 2, dy = cy - ny, sy = dy > 0 ? 1 : -1;
            var c = Math.min(14, Math.abs(dy) / 2, Math.abs(x2 - x1) / 4);
            d = Math.abs(dy) < 2 ? "M" + x1 + " " + ny + " H" + x2
              : "M" + x1 + " " + ny + " H" + (xm - sx * c) + " L" + xm + " " + (ny + sy * c) + " V" + (cy - sy * c) + " L" + (xm + sx * c) + " " + cy + " H" + x2;
          } else {
            var sy2 = ny > cy ? -1 : 1, y1 = ny + sy2 * N.height / 2, y2 = cy - sy2 * r, ym = (y1 + y2) / 2, dx = cx - nx, sx2 = dx > 0 ? 1 : -1;
            var c2 = Math.min(14, Math.abs(dx) / 2, Math.abs(y2 - y1) / 4);
            d = Math.abs(dx) < 2 ? "M" + nx + " " + y1 + " V" + y2
              : "M" + nx + " " + y1 + " V" + (ym - sy2 * c2) + " L" + (nx + sx2 * c2) + " " + ym + " H" + (cx - sx2 * c2) + " L" + cx + " " + (ym + sy2 * c2) + " V" + y2;
          }
          html += '<path class="bs-beams__trace" d="' + d + '"/><path class="bs-beams__pulse" pathLength="120" d="' + d + '" style="animation-delay:' + (-(i * 0.47)).toFixed(2) + 's"/>';
        });
        svg.innerHTML = html;
      }
      draw();
      if ("ResizeObserver" in window) new ResizeObserver(draw).observe(box); else window.addEventListener("resize", draw);
    });
  }
  /* Showcase: [data-type='["…","…"]'] types its phrases in a loop; .bs-demo-tr[data-pairs='[["Olá","Hello"],…]'] swaps pairs.
     Both advance only while their [data-live] block is on screen; with reduced motion they keep the text in the markup. */
  function showcase(root) {
    if (reduce) return;
    (root || document).querySelectorAll("[data-type]").forEach(function (el) {
      if (el._bsType) return; el._bsType = true;
      var list; try { list = JSON.parse(el.getAttribute("data-type")); } catch (e) { return; }
      var i = 0, k = 0, hold = 0;
      setInterval(function () {
        if (!isLive(el)) return;
        if (hold > 0) { hold--; return; }
        var text = list[i % list.length];
        if (k <= text.length) { el.textContent = text.slice(0, k++); if (k > text.length) hold = 40; }
        else { k = 0; i++; }
      }, 45);
    });
    (root || document).querySelectorAll(".bs-demo-tr[data-pairs]").forEach(function (el) {
      if (el._bsTr) return; el._bsTr = true;
      var pairs; try { pairs = JSON.parse(el.getAttribute("data-pairs")); } catch (e) { return; }
      var from = el.querySelector(".bs-demo-tr__from"), to = el.querySelector(".bs-demo-tr__to"), i = 0;
      setInterval(function () {
        if (!isLive(el)) return;
        i = (i + 1) % pairs.length; from.textContent = pairs[i][0]; to.textContent = pairs[i][1];
        to.classList.remove("is-swap"); void to.offsetWidth; to.classList.add("is-swap");
      }, 2600);
    });
  }
  /* Number ticker: [data-count="N"] counts from 0 to N (its markup already shows N) the first time it scrolls into view. */
  function count(root) {
    var els = (root || document).querySelectorAll("[data-count]");
    if (!els.length || reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target, to = parseFloat(el.getAttribute("data-count")), dec = (String(to).split(".")[1] || "").length, t0 = null;
        function f(t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3));
          el.textContent = v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(f); }
        el.textContent = "0"; requestAnimationFrame(f);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }
  /* ---- Motion pack: scramble, mask reveal, particles, tilt, ticker. All skip work with reduced motion and pause off screen. ---- */
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  function onScreen(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
  function textNodes(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), out = [], n;
    while ((n = w.nextNode())) if (n.nodeValue.trim()) out.push(n);
    return out;
  }
  /* Scramble: [data-scramble] decodes its text from random glyphs, left to right (about 1.3s). data-scramble="load" runs at
     once; any other value runs the first time it scrolls into view. The text nodes are only re-written in place, the box keeps
     its height, and screen readers get the real text through aria-label while it runs. */
  var GLYPHS = "01</>{}_#$%&*+=";
  function scramble(root) {
    (root || document).querySelectorAll("[data-scramble]").forEach(function (el) {
      if (el._bsScr || reduce) return; el._bsScr = true;
      function run() {
        var nodes = textNodes(el).map(function (n) { return { node: n, text: n.nodeValue }; });
        var total = 0; nodes.forEach(function (x) { total += x.text.length; });
        if (!total) return;
        var own = el.hasAttribute("aria-label");
        if (!own) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
        el.style.minHeight = el.offsetHeight + "px";
        el.classList.add("is-scrambling");
        var shown = 0, step = Math.max(1, Math.ceil(total / 40));
        function paint() {
          var i = 0;
          nodes.forEach(function (x) {
            var s = "";
            for (var k = 0; k < x.text.length; k++, i++) {
              var ch = x.text.charAt(k);
              s += i < shown || /\s/.test(ch) ? ch : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
            }
            x.node.nodeValue = s;
          });
        }
        paint();
        var t = setInterval(function () {
          shown += step;
          if (shown < total) return paint();
          clearInterval(t);
          nodes.forEach(function (x) { x.node.nodeValue = x.text; });
          el.style.minHeight = ""; el.classList.remove("is-scrambling");
          if (!own) el.removeAttribute("aria-label");
        }, 34);
      }
      /* Measure with the real font: wait for web fonts before locking the height. */
      function start() {
        var f = document.fonts, cs = getComputedStyle(el);
        if (!f || !f.load) return run();
        f.load(cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily, el.textContent).then(run, run);
      }
      if (el.getAttribute("data-scramble") === "load" || !("IntersectionObserver" in window)) return start();
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { threshold: 0.6 });
      io.observe(el);
    });
  }
  /* Mask reveal: [data-mask="words"|"lines"] wraps each word in a clipping window; the words rise into place when the block
     scrolls into view, one after another (words) or a line at a time (lines). Blocks already on screen are left alone. */
  function mask(root) {
    (root || document).querySelectorAll("[data-mask]").forEach(function (el) {
      if (el._bsMask || reduce || !("IntersectionObserver" in window)) return; el._bsMask = true;
      if (onScreen(el)) return;
      var byLine = el.getAttribute("data-mask") === "lines", words = [];
      textNodes(el).forEach(function (t) {
        var frag = document.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) return frag.appendChild(document.createTextNode(p));
          var w = document.createElement("span"), i = document.createElement("span");
          w.className = "bs-mask__w"; i.className = "bs-mask__i"; i.textContent = p;
          w.appendChild(i); frag.appendChild(w); words.push(w);
        });
        t.parentNode.replaceChild(frag, t);
      });
      var line = -1, top = null;
      words.forEach(function (w, k) {
        var y = w.getBoundingClientRect().top;
        if (top === null || y > top + 4) { line++; top = y; }
        w.firstChild.style.transitionDelay = Math.min(byLine ? line * 110 : k * 55, 1400) + "ms";
      });
      el.classList.add("bs-mask");
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
      }, { rootMargin: "0px 0px -12% 0px" });
      io.observe(el);
    });
  }
  /* Particles: [data-particles] gets a canvas of short volt and silver dashes behind its content. They drift, scatter away
     from the pointer (or a finger), jolt with the scroll speed and spring back. Runs only while on screen; drawn still with
     reduced motion. */
  function particles(root) {
    (root || document).querySelectorAll("[data-particles]").forEach(function (host) {
      if (host._bsPt) return; host._bsPt = true;
      var cv = document.createElement("canvas"), c = cv.getContext && cv.getContext("2d");
      if (!c) return;
      cv.className = "bs-particles"; cv.setAttribute("aria-hidden", "true"); host.insertBefore(cv, host.firstChild);
      var css = getComputedStyle(document.documentElement);
      var cols = [css.getPropertyValue("--volt").trim() || "#e1fa03", css.getPropertyValue("--silver").trim() || "#b0b0b0", css.getPropertyValue("--trace-strong").trim() || "#58697b"];
      var W = 0, H = 0, ps = [], px = -9999, py = -9999, pon = false, live = false, raf = 0, lastY = window.scrollY, t0 = 0;
      function build() {
        var gap = W < 640 ? 44 : 60, jit = gap * 0.5; ps = [];
        for (var y = gap / 2; y < H + gap; y += gap) for (var x = gap / 2; x < W + gap; x += gap) {
          var ox = x + (Math.random() - 0.5) * jit * 2, oy = y + (Math.random() - 0.5) * jit * 2, r = Math.random();
          ps.push({ ox: ox, oy: oy, x: ox, y: oy, vx: 0, vy: 0, w: 1.4 + Math.random() * 1.2, h: 5 + Math.random() * 8,
            rot: Math.random() * Math.PI, ph: Math.random() * 6.28, col: r < 0.45 ? 0 : r < 0.75 ? 1 : 2, a: r < 0.45 ? 0.75 : 0.45 });
        }
      }
      function draw() {
        c.clearRect(0, 0, W, H);
        for (var g = 0; g < 3; g++) {
          c.fillStyle = cols[g]; c.globalAlpha = g === 0 ? 0.8 : 0.45; c.beginPath();
          for (var i = 0; i < ps.length; i++) {
            var p = ps[i]; if (p.col !== g) continue;
            var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy), ang = sp > 0.4 ? Math.atan2(p.vy, p.vx) + Math.PI / 2 : p.rot;
            var hw = p.w / 2, hh = (p.h + Math.min(sp * 0.8, 10)) / 2, cs = Math.cos(ang), sn = Math.sin(ang);
            c.moveTo(p.x + (-hw * cs - -hh * sn), p.y + (-hw * sn + -hh * cs));
            c.lineTo(p.x + (hw * cs - -hh * sn), p.y + (hw * sn + -hh * cs));
            c.lineTo(p.x + (hw * cs - hh * sn), p.y + (hw * sn + hh * cs));
            c.lineTo(p.x + (-hw * cs - hh * sn), p.y + (-hw * sn + hh * cs));
            c.closePath();
          }
          c.fill();
        }
        c.globalAlpha = 1;
      }
      function size() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = host.clientWidth; H = host.clientHeight;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        c.setTransform(dpr, 0, 0, dpr, 0, 0); build(); draw();
      }
      function frame(now) {
        raf = 0;
        if (!live || document.hidden) return;
        var t = (now - t0) / 1000, b = cv.getBoundingClientRect(), mx = px - b.left, my = py - b.top, R = W < 640 ? 90 : 130, R2 = R * R;
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          if (pon) {
            var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
            if (d2 < R2 && d2 > 0.01) { var d = Math.sqrt(d2), f = Math.pow((R - d) / R, 2) * 6; p.vx += dx / d * f; p.vy += dy / d * f; }
          }
          var hx = p.ox + Math.sin(t * 0.6 + p.ph) * 3, hy = p.oy + Math.cos(t * 0.5 + p.ph) * 3;
          p.vx = (p.vx + (hx - p.x) * 0.06) * 0.82; p.vy = (p.vy + (hy - p.y) * 0.06) * 0.82;
          p.x += p.vx; p.y += p.vy;
        }
        draw();
        raf = requestAnimationFrame(frame);
      }
      function wake() { if (live && !raf && !document.hidden) raf = requestAnimationFrame(frame); }
      size();
      if ("ResizeObserver" in window) new ResizeObserver(function () { if (host.clientWidth !== W || host.clientHeight !== H) size(); }).observe(host);
      if (reduce) return;
      t0 = performance.now();
      window.addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; pon = true; }, { passive: true });
      document.documentElement.addEventListener("pointerleave", function () { pon = false; });
      window.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") pon = false; }, { passive: true });
      window.addEventListener("scroll", function () {
        var dy = window.scrollY - lastY; lastY = window.scrollY;
        if (!live) return;
        var k = Math.max(-14, Math.min(14, dy * 0.18));
        for (var i = 0; i < ps.length; i++) ps[i].vy -= k * (0.5 + (i % 7) / 7);
      }, { passive: true });
      document.addEventListener("visibilitychange", wake);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { live = es[0].isIntersecting; wake(); }).observe(host);
      else { live = true; wake(); }
    });
  }
  /* Tilt: [data-tilt] (max degrees, default 6) leans toward the pointer with a volt glare, on fine pointers. When it also has
     [data-reveal] it enters in 3D the first time it scrolls into view (phones included); cards already on screen at load stay put. */
  function tilt(root) {
    (root || document).querySelectorAll("[data-tilt]").forEach(function (el) {
      if (el._bsTilt || reduce) return; el._bsTilt = true;
      if (el.hasAttribute("data-reveal") && onScreen(el)) el.classList.add("is-visible");
      if (!fine) return;
      var max = parseFloat(el.getAttribute("data-tilt")) || 6, x = 0, y = 0, q = false;
      function paint() {
        q = false;
        var b = el.getBoundingClientRect(), fx = Math.min(1, Math.max(0, (x - b.left) / b.width)), fy = Math.min(1, Math.max(0, (y - b.top) / b.height));
        el.style.setProperty("--ry", ((fx - 0.5) * 2 * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - fy) * 2 * max).toFixed(2) + "deg");
        el.style.setProperty("--gx", (fx * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (fy * 100).toFixed(1) + "%");
      }
      el.addEventListener("pointerenter", function () { el.style.transitionDelay = "0ms"; el.classList.add("is-tilting"); });
      el.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; if (!q) { q = true; requestAnimationFrame(paint); } });
      el.addEventListener("pointerleave", function () { el.classList.remove("is-tilting"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }
  /* Ticker: .bs-ticker loops its .bs-ticker__group sideways forever (copies are added, hidden from screen readers and Tab).
     Scrolling the page pushes it faster, scrolling back reverses it; it eases to a stop under the pointer or keyboard focus.
     data-speed (px/s, default 40), data-direction="right". Reduced motion: a still row that scrolls by hand. */
  function ticker(root) {
    (root || document).querySelectorAll(".bs-ticker").forEach(function (box) {
      if (box._bsTk) return; box._bsTk = true;
      var track = box.querySelector(".bs-ticker__track"), group = track && track.querySelector(".bs-ticker__group");
      if (!group) return;
      if (reduce) { box.classList.add("is-static"); return; }
      var speed = parseFloat(box.getAttribute("data-speed")) || 40, dir = box.getAttribute("data-direction") === "right" ? 1 : -1;
      var loop = 0, off = 0, rate = 0, push = 0, held = false, live = false, raf = 0, last = 0, lastY = window.scrollY;
      function fill() {
        track.querySelectorAll(".bs-ticker__group[aria-hidden]").forEach(function (n) { n.remove(); });
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        loop = group.getBoundingClientRect().width + gap;
        for (var i = 0, need = Math.ceil(box.clientWidth / Math.max(1, loop)) + 1; i < need; i++) {
          var cl = group.cloneNode(true); cl.setAttribute("aria-hidden", "true");
          cl.querySelectorAll("a, button").forEach(function (a) { a.setAttribute("tabindex", "-1"); });
          track.appendChild(cl);
        }
      }
      function tick(now) {
        raf = live && !document.hidden ? requestAnimationFrame(tick) : 0;
        var dt = last ? Math.min((now - last) / 1000, 0.05) : 0; last = now;
        rate += ((held ? 0 : 1) - rate) * (1 - Math.exp(-dt / 0.19));
        if (held && rate < 0.02) rate = 0;
        push *= Math.exp(-dt / 0.4);
        off += (dir * rate - push * (held ? 0 : 1)) * speed * dt;
        if (loop > 0) { off = off % loop; if (off > 0) off -= loop; }
        track.style.transform = "translate3d(" + off.toFixed(2) + "px,0,0)";
      }
      function wake() { if (live && !raf && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } }
      fill();
      if ("ResizeObserver" in window) new ResizeObserver(fill).observe(box);
      box.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") held = true; });
      box.addEventListener("pointerleave", function () { held = false; });
      box.addEventListener("focusin", function (e) {
        held = true;
        var b = box.getBoundingClientRect(), r = e.target.getBoundingClientRect(), pad = 24, d = 0;
        if (r.left < b.left + pad) d = b.left + pad - r.left; else if (r.right > b.right - pad) d = b.right - pad - r.right;
        if (d) { off += d; track.style.transform = "translate3d(" + off.toFixed(2) + "px,0,0)"; }
      });
      box.addEventListener("focusout", function () { held = false; });
      window.addEventListener("scroll", function () {
        var dy = window.scrollY - lastY; lastY = window.scrollY;
        if (live) push = Math.max(-6, Math.min(6, push + dy * 0.02));
      }, { passive: true });
      document.addEventListener("visibilitychange", wake);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { live = es[0].isIntersecting; wake(); }, { rootMargin: "96px" }).observe(box);
      else { live = true; wake(); }
    });
  }
  window.BrunoSilvaUSA = { reveal: reveal, progress: progress, spotlight: spotlight, orbit: orbit, code: code, compare: compare, chat: chat, beams: beams, showcase: showcase, count: count, scramble: scramble, mask: mask, particles: particles, tilt: tilt, ticker: ticker };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { reveal(); progress(); spotlight(); orbit(); code(); compare(); chat(); beams(); showcase(); count(); scramble(); mask(); particles(); tilt(); ticker(); });
  else { reveal(); progress(); spotlight(); orbit(); code(); compare(); chat(); beams(); showcase(); count(); scramble(); mask(); particles(); tilt(); ticker(); }
})();
