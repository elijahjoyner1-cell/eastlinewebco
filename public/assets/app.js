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

  var EM = CONFIG.emails || {};
  function addrFor(kind) { return kind === "quote" ? (EM.quotes || EM.support || "") : (EM.support || EM.quotes || ""); }
  document.querySelectorAll("[data-email]").forEach(function (el) {
    var a = addrFor(el.getAttribute("data-email") === "quotes" ? "quote" : "support");
    el.textContent = a;
    if (el.tagName === "A") el.setAttribute("href", "mailto:" + a);
  });
  document.querySelectorAll("[data-social]").forEach(function (el) {
    var u = (CONFIG.social || {})[el.getAttribute("data-social")];
    if (u === "") { var li = el.closest("li"); if (li) li.hidden = true; } else if (u) el.setAttribute("href", u);
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- estimate (all money is handled in whole cents to avoid rounding errors) ---- */
  function money(c) { var d = c / 100; return "$" + (c % 100 === 0 ? d.toLocaleString("en-US") : d.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }
  function qtyOf(input) { var n = Number(input && input.value); return (input && /^\d+$/.test(String(input.value).trim()) && n >= 1) ? Math.min(n, CONFIG.maxQty || 100) : 0; }

  function estimate(form) {
    var SV = CONFIG.services || {}, items = [], problem = "";
    form.querySelectorAll('input[name="service"]:checked').forEach(function (c) {
      var id = c.value, sv = SV[id]; if (!sv) return;
      var qty = 1, unit = Math.round((sv.price || 0) * 100), label = sv.label;
      if (sv.perPage) {
        qty = qtyOf(form.elements["qty_" + id]);
        if (!qty) problem = problem || "Enter a page count from 1 to " + (CONFIG.maxQty || 100) + " for " + sv.label + ".";
      }
      if (id === "pages") {
        var t = form.elements.pages_type ? form.elements.pages_type.value : "new";
        unit = Math.round((sv.prices[t] || 0) * 100);
        label = sv.label + " (" + (sv.typeLabels[t] || t) + ")";
      }
      items.push({ id: id, label: label, qty: qty, unit: unit, total: unit * qty, perPage: !!sv.perPage, rush: !!sv.rush });
    });
    var subtotal = 0, rushBase = 0;
    items.forEach(function (i) { subtotal += i.total; if (i.rush) rushBase += i.total; });
    var rushOn = form.elements.timeline && form.elements.timeline.value === "rush";
    var rushCents = rushOn ? Math.round(rushBase * (CONFIG.rushRate || 0)) : 0;
    var total = subtotal + rushCents;
    var deposit = Math.round(total * (CONFIG.depositRate || 0.5));
    var plan = null;
    var careBox = form.querySelector('input[name="service"][value="care"]');
    if (careBox && careBox.checked) {
      var pv = form.querySelector('input[name="care_plan"]:checked');
      var P = CONFIG.care && CONFIG.care.plans && pv ? CONFIG.care.plans[pv.value] : null;
      if (P) plan = { key: pv.value, label: P.label, price: Math.round(P.price * 100), time: P.time, response: P.response };
      else problem = problem || "Choose one maintenance plan.";
    }
    var oneItems = items.filter(function (i) { return i.id !== "care"; });
    return { items: oneItems, subtotal: subtotal, rushOn: rushOn, rush: rushCents, total: total, deposit: deposit, balance: total - deposit, plan: plan, monthly: plan ? plan.price : 0, problem: problem, hasAny: oneItems.length > 0 || !!plan };
  }

  function lineText(i) { return i.perPage ? i.label + ": " + i.qty + " page" + (i.qty === 1 ? "" : "s") + " x " + money(i.unit) : i.label; }

  function syncOptions(form) {
    form.querySelectorAll(".svc-opt").forEach(function (box) {
      var on = box.querySelector('input[name="service"]').checked;
      var q = box.querySelector(".qty");
      if (q) { q.hidden = !on; q.querySelectorAll("input,select").forEach(function (x) { x.disabled = !on; }); }
    });
    var careOn = form.querySelector('input[name="service"][value="care"]');
    var pick = document.getElementById("care-plans");
    if (pick && careOn) { pick.hidden = !careOn.checked; pick.querySelectorAll("input").forEach(function (x) { x.disabled = !careOn.checked; }); }
  }

  function updateEstimate(form) {
    syncOptions(form);
    var e = estimate(form), $ = function (id) { return document.getElementById(id); };
    if (!$("est-once")) return;
    var ul = $("est-lines"); ul.textContent = "";
    if (!e.hasAny) { var li0 = document.createElement("li"); li0.className = "muted"; li0.textContent = "Pick a service to start."; ul.appendChild(li0); }
    e.items.forEach(function (i) {
      var li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("span");
      a.textContent = i.perPage ? i.label + " (" + i.qty + " x " + money(i.unit) + ")" : i.label;
      b.textContent = money(i.total); li.appendChild(a); li.appendChild(b); ul.appendChild(li);
    });
    var has = e.items.length > 0;
    $("est-sub").textContent = has ? money(e.subtotal) : "None";
    $("row-rush").hidden = !(e.rushOn && e.rush > 0);
    $("est-rush").textContent = money(e.rush);
    $("est-once").textContent = has ? money(e.total) : "None";
    $("est-dep").textContent = has ? money(e.deposit) : "None";
    $("est-bal").textContent = has ? money(e.balance) : "None";
    $("est-monthly").textContent = e.plan ? money(e.monthly) + " / month (" + e.plan.label + ")" : "None";
  }

  /* ---- forms ---- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form");

    if (kind === "quote") {
      var applyHash = function () {
        var h = (location.hash || "").replace("#", "");
        var hp = h.indexOf("care-") === 0 ? h.slice(5) : "";
        if (hp) h = "care";
        if (CONFIG.services[h] || h === "care") { var c = form.querySelector('input[name="service"][value="' + h + '"]'); if (c) c.checked = true; }
        if (hp) { var r = form.querySelector('input[name="care_plan"][value="' + hp + '"]'); if (r) r.checked = true; }
        updateEstimate(form);
      };
      window.addEventListener("hashchange", applyHash);
      form.addEventListener("input", function () { updateEstimate(form); });
      form.addEventListener("change", function () { updateEstimate(form); });
      applyHash();
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var err = form.querySelector(".err"); if (err) err.textContent = "";
      if (kind === "quote" && !form.querySelector('input[name="service"]:checked')) {
        if (err) err.textContent = "Pick at least one service so we can price it.";
        return;
      }
      if (kind === "quote") { var chk = estimate(form); if (chk.problem) { if (err) err.textContent = chk.problem; return; } }
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = data[k] ? data[k] + ", " + v : v; });
      var spam = !!(data._gotcha || data.botcheck); delete data._gotcha; delete data.botcheck;
      var lines = [kind === "quote" ? "Quote request for EastLineWebCo" : "Message for EastLineWebCo", ""];
      lines.push("Name: " + data.name, "Email: " + data.email);
      if (data.phone) lines.push("Phone: " + data.phone);
      if (data.business) lines.push("Business: " + data.business);
      if (kind === "quote") {
        var e = estimate(form);
        lines.push("", "Services requested:");
        e.items.forEach(function (i) { lines.push("- " + lineText(i) + " = " + money(i.total)); });
        if (e.plan) lines.push("- Website maintenance, " + e.plan.label + " plan: " + money(e.plan.price) + " per month (billed separately; " + e.plan.time + "; response target " + e.plan.response + ")");
        lines.push("", "One-time project subtotal: " + (e.items.length ? money(e.subtotal) : "none"));
        if (e.rushOn && e.rush > 0) lines.push("Rush charge (20%, subject to availability and approval): " + money(e.rush));
        lines.push("Total one-time project cost: " + (e.items.length ? money(e.total) : "none"));
        lines.push("50% deposit: " + (e.items.length ? money(e.deposit) : "none"), "Remaining balance: " + (e.items.length ? money(e.balance) : "none"));
        lines.push("Monthly maintenance: " + (e.plan ? money(e.monthly) + " per month (" + e.plan.label + ")" : "none"));
        lines.push("Timeline: " + data.timeline, "Budget: " + data.budget);
      }
      if (data.details || data.message) lines.push("", (data.details || data.message));
      var text = lines.join("\n");

      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true;
      var payload = { message: text }; for (var k in data) payload[k] = data[k];
      payload.form = kind; if (kind === "quote") { var q2 = estimate(form); payload.estimate_one_time_total = q2.items.length ? money(q2.total) : "none"; payload.estimate_deposit = q2.items.length ? money(q2.deposit) : "none"; payload.estimate_monthly = q2.plan ? money(q2.monthly) + " (" + q2.plan.label + ")" : "none"; } for (var x in (CONFIG.formExtra || {})) payload[x] = CONFIG.formExtra[x];
      function showResult(sent) {
        btn.disabled = false;
        var box = document.createElement("div"); box.className = "result"; box.setAttribute("role", "status");
        var subj = encodeURIComponent(kind === "quote" ? "Quote request" : "Website enquiry");
        if (sent) {
          box.innerHTML = "<h3>Request sent</h3><p class='muted'>Thanks, " + esc(data.name) + ". We will reply to " + esc(data.email) + " with next steps.</p>";
        } else {
          box.innerHTML = "<h3>Your request is ready to send</h3><p class='muted'>This form is not connected to an inbox yet, so nothing has been sent. Copy the request below and email it to <span class='sel'>" + esc(addrFor(kind)) + "</span>, or use the email button.</p><pre></pre><div class='btns'><button type='button' class='btn primary sm' data-copy>Copy request</button><a class='btn ghost sm' href='mailto:" + addrFor(kind) + "?subject=" + subj + "&body=" + encodeURIComponent(text) + "'>Open in email app</a></div>";
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
          .catch(function () { btn.disabled = false; if (err) err.textContent = "The request did not go through. Check your connection and try again, or email " + addrFor(kind) + "."; });
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
    var sel = ".acc-item,.step,.col,.plan,.stage,.svc,.wk,.pt-row,details,.cta,.cta-x,.why-card,.ptile,.tl-step,.mark-art,.work,.rcard,.page-head > *,.work-info,.work-view,.trio > div,.price-row,.field,.foot > *";
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


/* ---- premium homepage behaviours: header state, rail arrows, timeline progress, mobile CTA, menu scroll lock ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hdr = document.querySelector(".site-header");
  var tl = document.querySelector(".timeline");
  var steps = tl ? Array.prototype.slice.call(tl.querySelectorAll(".tl-step")) : [];
  var hero = document.querySelector(".hero-x");
  var mcta = document.getElementById("m-cta");
  var fin = document.querySelector(".cta-x");
  var vertical = window.matchMedia("(max-width:860px)");
  if (mcta) document.body.classList.add("has-mcta");

  function frame() {
    var y = window.pageYOffset || 0, vh = window.innerHeight;
    if (hdr) hdr.classList.toggle("scrolled", y > 12);
    if (tl) {
      var r = tl.getBoundingClientRect(), p;
      if (reduce) p = 1;
      else if (vertical.matches) p = (vh * 0.62 - r.top) / Math.max(r.height, 1);
      else p = (vh * 0.9 - r.top) / (vh * 0.45);
      p = Math.max(0, Math.min(1, p));
      tl.style.setProperty("--p", p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle("on", p >= i / steps.length - 0.001 && p > 0); });
    }
    if (mcta && hero) {
      var past = hero.getBoundingClientRect().bottom < 0;
      var atEnd = fin && fin.getBoundingClientRect().top < vh * 0.75;
      mcta.classList.toggle("show", past && !atEnd);
    }
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; frame(); }); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  var rail = document.querySelector(".rail");
  var btns = document.querySelectorAll("[data-rail]");
  function railState() {
    if (!rail) return;
    btns.forEach(function (b) {
      var d = Number(b.getAttribute("data-rail"));
      b.disabled = d < 0 ? rail.scrollLeft <= 4 : rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
    });
  }
  if (rail && btns.length) {
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var card = rail.querySelector(".rcard"), step = card ? card.offsetWidth + 28 : 400;
        rail.scrollBy({ left: Number(b.getAttribute("data-rail")) * step, behavior: reduce ? "auto" : "smooth" });
      });
    });
    rail.addEventListener("scroll", railState, { passive: true });
    railState();
  }

  var nav = document.getElementById("nav");
  if (nav && "MutationObserver" in window) {
    new MutationObserver(function () { document.body.classList.toggle("menu-open", nav.classList.contains("open")); })
      .observe(nav, { attributes: true, attributeFilter: ["class"] });
  }
})();

/* ---- scroll choreography: inertial scroll, word-mask headlines, curtain media reveals, parallax, velocity marquee ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var doc = document.documentElement, vh = function () { return window.innerHeight; };
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches && window.innerWidth >= 961;

  /* inertial scrolling (mouse and trackpad only; touch keeps native momentum) */
  if (fine) {
    var target = window.pageYOffset, cur = target, raf = 0;
    doc.classList.add("smooth");
    var maxY = function () { return doc.scrollHeight - window.innerHeight; };
    var scrollable = function (el) {
      while (el && el !== document.body && el.nodeType === 1) {
        if (el.hasAttribute("data-no-smooth") || /^(TEXTAREA|SELECT|INPUT)$/.test(el.tagName)) return true;
        var cs = getComputedStyle(el);
        if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return true;
        el = el.parentNode;
      }
      return false;
    };
    var step = function () {
      var d = target - cur;
      cur = Math.abs(d) < 0.5 ? target : cur + d * 0.11;
      window.scrollTo({ top: cur, behavior: "instant" });
      raf = cur === target ? 0 : requestAnimationFrame(step);
    };
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY) || scrollable(e.target)) return;
      e.preventDefault();
      var dy = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!raf) cur = window.pageYOffset;
      target = Math.max(0, Math.min(maxY(), (raf ? target : cur) + dy));
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: false });
    window.addEventListener("scroll", function () {   /* keyboard, anchors, scrollbar drags: stay in sync */
      if (Math.abs(window.pageYOffset - cur) > 3) { cur = target = window.pageYOffset; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }, { passive: true });
  }

  if (!("IntersectionObserver" in window)) return;
  var below = function (el) { return el.getBoundingClientRect().top > vh() * 0.92; };

  /* headline words rise out of a mask */
  var splitIo = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("split-in"); splitIo.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll(".sec-head h2,.why-intro h2,.cta-x h2,.page-head h1,.page-head h2").forEach(function (h) {
    if (h.children.length || !below(h) || h.dataset.split) return;
    var txt = h.textContent.trim().replace(/\s+/g, " ");
    h.setAttribute("aria-label", txt); h.dataset.split = "1";
    h.innerHTML = txt.split(" ").map(function (w, i) { return '<span class="mw" aria-hidden="true"><span class="mi" style="--i:' + i + '">' + w + "</span></span>"; }).join(" ");
    splitIo.observe(h);
  });

  /* supporting copy and curtain reveals */
  var inIo = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target.__reveal || e.target;   /* clipped media is watched through its wrapper */
      t.classList.add("in"); inIo.unobserve(e.target);
      if (t.classList.contains("clip-pre")) setTimeout(function () { t.classList.add("done"); }, 2000);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".sec-head > p,.why-intro > p,.cta-x > p").forEach(function (p, i) {
    if (!below(p)) return;
    p.classList.add("mrv"); p.style.setProperty("--d", (p.classList.contains("lead") ? 260 : 140) + "ms"); inIo.observe(p);
  });
  document.querySelectorAll(".rcard .chrome,.work-view .chrome").forEach(function (c) {
    if (!below(c)) return;
    c.classList.add("clip-pre"); c.parentNode.__reveal = c; inIo.observe(c.parentNode);
  });

  /* layered parallax in the hero + fade-out of the headline block */
  var hero = document.querySelector(".hero-x");
  var layers = hero ? [[hero.querySelector(".mock"), -0.05], [hero.querySelector(".hphone"), -0.12], [hero.querySelector(".adcard"), -0.085]] : [];
  var track = document.querySelector(".marquee .track"), lastY = window.pageYOffset, vel = 0, dir = 1, loop = 0;
  function motion() {
    var y = window.pageYOffset;
    if (hero) {
      var hh = hero.offsetHeight || 1;
      if (y < hh * 1.2) {
        hero.style.setProperty("--hp", Math.max(0, Math.min(1, y / (hh * 0.8))).toFixed(3));
        layers.forEach(function (l) { if (l[0]) l[0].style.setProperty("--pp", (y * l[1]).toFixed(1) + "px"); });
      }
    }
    vel += (y - lastY - vel) * 0.25; lastY = y;
  }
  function spin() {
    var a = track && track.getAnimations && track.getAnimations()[0];
    if (a) {
      if (Math.abs(vel) > 0.6) dir = vel > 0 ? 1 : -1;
      a.playbackRate = dir * (1 + Math.min(Math.abs(vel) * 0.35, 9));
    }
    vel *= 0.92;
    loop = Math.abs(vel) > 0.04 ? requestAnimationFrame(spin) : (a && (a.playbackRate = dir), 0);
  }
  var tick = false;
  window.addEventListener("scroll", function () {
    if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; motion(); if (track && !loop) loop = requestAnimationFrame(spin); }); }
  }, { passive: true });
  motion();
})();
