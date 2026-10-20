var CONFIG = window.ELW_CONFIG || {};

(function () {
  var root = document.documentElement;
  var T = window.elwTheme || { get: function () { return null; }, set: function () {} };
  var saved = T.get();
  if (saved) root.setAttribute("data-theme", saved);

  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    if (!cur) cur = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    var next = cur === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    T.set(next);
  });

  var menuBtn = document.getElementById("menu-btn"), nav = document.getElementById("nav");
  if (menuBtn && nav) menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  function closeMenu() { if (nav && nav.classList.contains("open")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } }
  if (nav) {
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); if (menuBtn) menuBtn.focus(); } });
    document.addEventListener("click", function (e) { if (!e.target.closest(".bar")) closeMenu(); });
  }

  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = CONFIG.email; });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- estimate ---- */
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function range(lo, hi) { return lo === hi ? money(lo) : money(lo) + " to " + money(hi); }
  function pagesOf(form) { var n = parseInt(form.elements.pages && form.elements.pages.value, 10); return n > 0 ? Math.min(n, 100) : 0; }

  function estimate(form) {
    var pages = pagesOf(form);
    var rush = form.elements.timeline && form.elements.timeline.value === "rush" ? CONFIG.rushMultiplier : 1;
    var once = 0, m = [0, 0], picked = [];
    form.querySelectorAll('input[name="service"]:checked').forEach(function (c) {
      var sv = CONFIG.services[c.value]; if (!sv) return;
      picked.push(sv.label);
      once += (sv.flat + sv.page * pages) * rush;
      m[0] += sv.monthly[0]; m[1] += sv.monthly[1];
    });
    return { once: once, monthly: m, picked: picked, pages: pages };
  }

  function updateEstimate(form) {
    var e = estimate(form);
    var a = document.getElementById("est-once"), b = document.getElementById("est-monthly");
    if (!a || !b) return;
    a.textContent = e.once ? money(e.once) : "None";
    b.textContent = e.monthly[1] ? range(e.monthly[0], e.monthly[1]) + " / month" : "None";
  }

  /* ---- forms ---- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form");

    if (kind === "quote") {
      var h = (location.hash || "").replace("#", "");
      if (CONFIG.services[h]) { var c = form.querySelector('input[name="service"][value="' + h + '"]'); if (c) c.checked = true; }
      form.addEventListener("input", function () { updateEstimate(form); });
      form.addEventListener("change", function () { updateEstimate(form); });
      updateEstimate(form);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var err = form.querySelector(".err"); if (err) err.textContent = "";
      if (kind === "quote" && !form.querySelector('input[name="service"]:checked')) {
        if (err) err.textContent = "Pick at least one service so we can price it.";
        return;
      }
      if (kind === "quote" && !pagesOf(form)) { if (err) err.textContent = "Enter how many pages you need, from 1 to 100."; return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = data[k] ? data[k] + ", " + v : v; });
      var spam = !!(data._gotcha || data.botcheck); delete data._gotcha; delete data.botcheck;
      var lines = [kind === "quote" ? "Quote request for EastLineWebCo" : "Message for EastLineWebCo", ""];
      lines.push("Name: " + data.name, "Email: " + data.email);
      if (data.phone) lines.push("Phone: " + data.phone);
      if (data.business) lines.push("Business: " + data.business);
      if (kind === "quote") {
        var e = estimate(form);
        lines.push("Services: " + e.picked.join(", "));
        lines.push("Pages: " + data.pages, "Timeline: " + data.timeline, "Budget: " + data.budget);
        lines.push("Estimate: " + (e.once ? money(e.once) + " one-time" : "no one-time cost") + "; " + (e.monthly[1] ? range(e.monthly[0], e.monthly[1]) + "/month" : "no monthly cost"));
      }
      if (data.details || data.message) lines.push("", (data.details || data.message));
      var text = lines.join("\n");

      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true;
      var payload = { message: text }; for (var k in data) payload[k] = data[k];
      payload.form = kind; for (var x in (CONFIG.formExtra || {})) payload[x] = CONFIG.formExtra[x];
      function showResult(sent) {
        btn.disabled = false;
        var box = document.createElement("div"); box.className = "result"; box.setAttribute("role", "status");
        var subj = encodeURIComponent(kind === "quote" ? "Quote request" : "Website enquiry");
        if (sent) {
          box.innerHTML = "<h3>Request sent</h3><p class='muted'>Thanks, " + esc(data.name) + ". We will reply to " + esc(data.email) + " with next steps.</p>";
        } else {
          box.innerHTML = "<h3>Your request is ready to send</h3><p class='muted'>This form is not connected to an inbox yet, so nothing has been sent. Copy the request below and email it to <span class='sel'>" + esc(CONFIG.email) + "</span>, or use the email button.</p><pre></pre><div class='btns'><button type='button' class='btn primary sm' data-copy>Copy request</button><a class='btn ghost sm' href='mailto:" + CONFIG.email + "?subject=" + subj + "&body=" + encodeURIComponent(text) + "'>Open in email app</a></div>";
          box.querySelector("pre").textContent = text;
          box.querySelector("[data-copy]").addEventListener("click", function (cb) {
            var t = cb.currentTarget, pre = box.querySelector("pre");
            function sel() { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); t.textContent = "Selected. Press copy"; }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { t.textContent = "Copied"; }, sel); else sel();
          });
        }
        form.replaceWith(box); box.scrollIntoView({ block: "center" });
      }
      if (spam) { showResult(true); return; }
      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error(); showResult(true); })
          .catch(function () { btn.disabled = false; if (err) err.textContent = "The request did not go through. Check your connection and try again, or email " + CONFIG.email + "."; });
      } else showResult(false);
    });
  });

  /* ---- sample previews (scaled live iframes) ---- */
  var pvs = Array.prototype.slice.call(document.querySelectorAll(".pv[data-src]"));
  function dims(pv) {
    var ch = pv.closest(".chrome"), phone = ch && ch.classList.contains("phone");
    return phone ? [390, 844] : [parseInt(pv.getAttribute("data-w"), 10) || 1280, parseInt(pv.getAttribute("data-h"), 10) || 800];
  }
  function layout(pv) {
    var f = pv.querySelector("iframe"); if (!f) return;
    var d = dims(pv); pv.style.aspectRatio = d[0] + " / " + d[1];
    var sc = pv.clientWidth / d[0];
    f.style.width = d[0] + "px"; f.style.height = d[1] + "px"; f.style.transform = "scale(" + sc + ")";
  }
  function mount(pv) {
    if (pv.querySelector("iframe")) return;
    var f = document.createElement("iframe");
    f.src = pv.getAttribute("data-src"); f.setAttribute("sandbox", pv.getAttribute("data-ext") ? "allow-scripts allow-same-origin allow-forms" : "allow-same-origin"); f.setAttribute("tabindex", "-1");
    f.setAttribute("referrerpolicy", "no-referrer");
    if (pv.getAttribute("data-bg")) f.setAttribute("aria-hidden", "true"); else f.title = "Live preview of " + (pv.getAttribute("data-label") || "sample website");
    f.addEventListener("load", function () { pv.classList.add("ready"); });
    pv.appendChild(f); layout(pv);
  }
  if (pvs.length) {
    var ro = "ResizeObserver" in window ? new ResizeObserver(function (en) { en.forEach(function (e) { layout(e.target); }); }) : null;
    pvs.forEach(function (pv) { if (ro) ro.observe(pv); });
    if (!ro) addEventListener("resize", function () { pvs.forEach(layout); });
    var wide = window.matchMedia("(min-width: 701px)").matches, saveData = navigator.connection && navigator.connection.saveData;
    var vis = "IntersectionObserver" in window ? new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { mount(e.target); vis.unobserve(e.target); } }); }, { rootMargin: "300px" }) : null;
    pvs.forEach(function (pv) {
      if (pv.getAttribute("data-bg")) return;
      if (vis) vis.observe(pv); else mount(pv);
    });
    var bgs = pvs.filter(function (pv) { return pv.getAttribute("data-bg"); });
    if (bgs.length && wide && !saveData) {
      var go = function () { bgs.forEach(mount); };
      if (document.readyState === "complete") setTimeout(go, 300); else addEventListener("load", function () { setTimeout(go, 300); });
    }
    document.querySelectorAll(".seg").forEach(function (seg) {
      var view = seg.parentNode, ch = view.querySelector(".chrome"), pv = view.querySelector(".pv");
      seg.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var phone = b.getAttribute("data-mode") === "phone";
          ch.classList.toggle("phone", phone);
          seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          layout(pv); requestAnimationFrame(function () { layout(pv); });
        });
      });
    });
  }

  /* ---- accordion ---- */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var btn = item.querySelector(".acc-btn"), panel = item.querySelector(".acc-inner");
    function set(open) { item.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", ""); }
    btn.addEventListener("click", function () { set(!item.classList.contains("open")); });
    set(item.classList.contains("open"));
  });

  /* ---- scroll progress ---- */
  var bar = document.getElementById("progress"), ticking = false;
  function prog() { ticking = false; var h = document.documentElement.scrollHeight - innerHeight; if (bar) bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")"; }
  if (bar) { addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true }); prog(); }

  /* ---- scroll reveal (only elements that start below the fold are hidden) ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var sel = ".sec-head,.acc-item,.step,.col,.plan,.stage,.svc,.wk,.pt-row,details,.cta,.mark-art,.work,.rcard,.page-head > *,.work-info,.work-view,.trio > div,.price-row,.field,.foot > *";
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("reveal-in"); en.target.classList.remove("reveal-pre"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(sel).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.95) return;
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(idx, 5) * 90 + "ms");
      if (el.classList.contains("work-info")) el.classList.add("from-left"); else if (el.classList.contains("work-view")) el.classList.add("from-right");
      el.classList.add("reveal-pre"); io.observe(el);
    });
  }

  /* ---- scroll parallax (sun and hero background drift as you scroll) ---- */
  var heroEl = document.querySelector(".hero");
  if (heroEl && !reduce) {
    var sunEl = heroEl.querySelector(".sun"), bgEl = heroEl.querySelector(".hero-bg"), pt = false;
    function par() {
      pt = false;
      var y = Math.min(scrollY, heroEl.offsetHeight);
      if (sunEl) sunEl.style.setProperty("--py", (y * -0.28).toFixed(1) + "px");
      if (bgEl) bgEl.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
    }
    addEventListener("scroll", function () { if (!pt) { pt = true; requestAnimationFrame(par); } }, { passive: true });
    par();
  }

  function esc(s) { return String(s || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
})();
