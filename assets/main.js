/* Actimvated Network — shared behaviours */
(function () {
  "use strict";

  // Sticky header shadow
  var hdr = document.getElementById("hdr");
  var onScroll = function () { if (hdr) hdr.className = window.scrollY > 8 ? "scrolled" : ""; };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById("burger");
  var panel = document.getElementById("mnav");
  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Lazy video facade — the YouTube player loads ONLY on tap (data-friendly)
  document.querySelectorAll(".vid").forEach(function (fig) {
    var start = function () {
      if (fig.querySelector("iframe")) return;
      var id = fig.getAttribute("data-v");
      var title = fig.getAttribute("aria-label") || "Video";
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      fig.innerHTML = "";
      fig.appendChild(iframe);
    };
    fig.addEventListener("click", start);
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); }
    });
  });

  // Copy buttons — [data-copy] holds the text (or current page link when "url")
  function flash(btn) {
    var old = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(function () { btn.textContent = old; }, 1800);
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-copy") === "url"
        ? location.href.split("#")[0]
        : btn.getAttribute("data-copy");
      var done = function () { flash(btn); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(done, done);
      } else {
        var t = document.createElement("textarea");
        t.value = val; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });

  // WhatsApp share link
  var waShare = document.getElementById("waShare");
  if (waShare) {
    var msg = "Look at this: free digital skills training + a real business path in Nigeria (FHG × NeoLife) — everything explained honestly. " + location.href.split("#")[0];
    waShare.href = "https://wa.me/?text=" + encodeURIComponent(msg);
  }

  // Year
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
