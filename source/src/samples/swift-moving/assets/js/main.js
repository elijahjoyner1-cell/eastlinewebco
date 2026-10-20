/* Swift White Glove Moving: site behavior. No libraries needed. */
(function () {
  "use strict";
  var CFG = window.SWIFT_CONFIG || {};
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isStatic = root.hasAttribute("data-static");
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---- small fills from config ---- */
  $$("[data-email]").forEach(function (el) {
    el.textContent = CFG.email || "";
    if (el.tagName === "A") el.setAttribute("href", "mailto:" + (CFG.email || ""));
  });
  var phone = (CFG.phone || "").trim();
  $$("[data-phone-row]").forEach(function (el) { el.hidden = !phone; });
  var digits = phone.replace(/[^\d+]/g, "");
  $$("[data-phone]").forEach(function (el) { el.textContent = phone; if (el.tagName === "A") el.setAttribute("href", "tel:" + digits); });
  $$("[data-tel]").forEach(function (el) { el.setAttribute("href", "tel:" + digits); });
  $$("[data-sms]").forEach(function (el) { el.setAttribute("href", "sms:" + digits); });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- mobile menu ---- */
  var toggle = $(".menu-toggle"), wrap = $(".nav-wrap");
  function setMenu(open) {
    if (!toggle || !wrap) return;
    wrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (toggle && wrap) {
    toggle.addEventListener("click", function () { setMenu(!wrap.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    $$(".nav-links a", wrap).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  /* ---- header state and scroll progress ---- */
  var header = $(".site-header"), bar = $(".progress"), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (bar) {
      var h = root.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- reveal on scroll ---- */
  var animate = !reduce && !isStatic && "IntersectionObserver" in window;
  function showAll() { $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); }); $$(".process-grid").forEach(function (el) { el.classList.add("in"); }); }
  if (animate) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.hasAttribute("data-count-wrap")) runCounts(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    $$("[data-reveal], .process-grid").forEach(function (el) {
      if (el.hasAttribute("data-reveal-auto")) return;
      var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(sibs, 6) * 80 + "ms");
      io.observe(el);
    });
  } else { showAll(); }

  /* ---- count-up numbers ---- */
  function runCounts(scope) {
    $$("[data-count]", scope).forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")), start = null, dur = 1400;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if (!animate) $$("[data-count]").forEach(function (el) { el.textContent = el.getAttribute("data-count"); });

  /* ---- pointer spotlight (hero glow and cards) ---- */
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce && !isStatic) {
    var hero = $(".hero");
    if (hero) hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
      hero.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    $$(".spot").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---- FAQ accordion ---- */
  $$(".faq-item").forEach(function (item, i) {
    var q = $(".faq-q", item), a = $(".faq-a", item);
    if (!q || !a) return;
    var id = "faq-a-" + i;
    a.id = id; q.setAttribute("aria-controls", id); q.setAttribute("aria-expanded", "false");
    a.setAttribute("inert", "");
    q.addEventListener("click", function () {
      var open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      q.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) a.removeAttribute("inert"); else a.setAttribute("inert", "");
    });
  });

  /* ---- testimonials and service areas from config ---- */
  var tBox = $("[data-testimonials]"), tEmpty = $("[data-testimonials-empty]");
  if (tBox) {
    var list = Array.isArray(CFG.testimonials) ? CFG.testimonials.filter(function (t) { return t && t.quote; }) : [];
    if (list.length) {
      tBox.innerHTML = list.map(function (t, i) {
        return '<figure class="testimonial-card spot" data-reveal style="--d:' + (i % 3) * 80 + 'ms"><div class="quote-mark" aria-hidden="true">&ldquo;</div><p>' + esc(t.quote) + "</p><cite>" + esc(t.name || "Swift client") + (t.detail ? "<span>" + esc(t.detail) + "</span>" : "") + "</cite></figure>";
      }).join("");
      tBox.hidden = false; if (tEmpty) tEmpty.hidden = true;
      $$("[data-reveal]", tBox).forEach(function (el) { el.classList.add("in"); });
    } else { tBox.hidden = true; if (tEmpty) tEmpty.hidden = false; }
  }
  var aBox = $("[data-areas]");
  if (aBox) {
    var areas = Array.isArray(CFG.areas) ? CFG.areas.filter(Boolean) : [];
    if (areas.length) { aBox.innerHTML = areas.map(function (a) { return "<span>" + esc(a) + "</span>"; }).join(""); aBox.hidden = false; }
    else aBox.hidden = true;
  }

  /* ---- forms ---- */
  $$("form.quote-form").forEach(function (form) {
    var kind = form.getAttribute("data-kind") || "quote";
    var status = $(".form-status", form);
    var btn = $('button[type="submit"]', form);
    var label = btn ? btn.textContent : "";
    function say(msg, bad) { if (status) { status.textContent = msg; status.className = "form-status" + (bad ? " err" : ""); } }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      say("");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      if (data._gotcha) { window.location.href = "thank-you.html"; return; } // spam trap: pretend success
      delete data._gotcha;

      var title = kind === "availability" ? "Service area check" : "Quote request";
      var lines = [title + " for Swift White Glove Moving", ""];
      [["Name", "full_name"], ["Email", "email"], ["Phone", "phone"], ["Service", "service"], ["Pickup", "pickup_location"], ["Delivery", "delivery_location"], ["Timeline", "timeline"]].forEach(function (p) {
        if (data[p[1]]) lines.push(p[0] + ": " + data[p[1]]);
      });
      if (data.message) lines.push("", data.message);
      var text = lines.join("\n");

      var endpoint = (CFG.formEndpoint || "").trim();
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      if (!endpoint) { fallback(form, title, text); return; }

      var payload = { message: text, form: kind };
      Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
      var extra = CFG.formExtra || {}; Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); window.location.href = "thank-you.html"; })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          say("Your request did not go through. Please try again, or email " + (CFG.email || "us") + " directly.", true);
        });
    });
  });

  // Shown when no form address has been configured yet: nothing is sent, so say so plainly.
  function fallback(form, title, text) {
    var box = document.createElement("div");
    box.className = "result"; box.setAttribute("role", "status");
    var mail = "mailto:" + (CFG.email || "") + "?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(text);
    box.innerHTML = "<h3>Your request is ready to send</h3><p>Online sending is not switched on yet, so nothing has been sent. Open it in your email app, or copy it and email it to <strong>" + esc(CFG.email || "us") + "</strong>.</p><pre></pre><div class='btns'><a class='btn btn-primary' href='" + mail + "'>Open in email app</a><button type='button' class='btn btn-secondary' data-copy>Copy request</button></div>";
    $("pre", box).textContent = text;
    $("[data-copy]", box).addEventListener("click", function (e) {
      var b = e.currentTarget, pre = $("pre", box);
      function select() { var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected. Press copy"; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { b.textContent = "Copied"; }, select); else select();
    });
    form.replaceWith(box);
    box.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }
})();
