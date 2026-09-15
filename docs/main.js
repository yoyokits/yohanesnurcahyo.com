/* yohanesnurcahyo.com — progressive enhancement only.
   The page is fully readable and navigable with JavaScript disabled. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year -------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- header shadow on scroll --------------------------------------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile navigation --------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---- scroll spy ----------------------------------------------------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]:not(.nav-cta)')
  );
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- reveal on scroll ----------------------------------------------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.transitionDelay = Math.min(i * 70, 280) + "ms";
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- publications carousel ------------------------------------------ */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-carousel-track]");
    var dotsBox = root.querySelector("[data-carousel-dots]");
    var items = Array.prototype.slice.call(track.children);
    if (items.length < 2) return;

    var INTERVAL = 2000;
    var stops = [];
    var index = 0;
    var timer = null;
    var paused = false;
    var inView = false;

    root.classList.add("is-enhanced");

    // Scroll positions the track can actually reach; the last cards share one stop.
    function computeStops() {
      var max = track.scrollWidth - track.clientWidth;
      var base = items[0].offsetLeft;
      stops = [];
      items.forEach(function (item) {
        var left = Math.min(item.offsetLeft - base, max);
        if (!stops.length || left - stops[stops.length - 1] > 2) stops.push(left);
      });

      dotsBox.innerHTML = "";
      stops.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show publication " + (i + 1));
        dot.addEventListener("click", function () { go(i); restart(); });
        dotsBox.appendChild(dot);
      });
      index = Math.min(index, stops.length - 1);
      mark();
    }

    function mark() {
      Array.prototype.forEach.call(dotsBox.children, function (d, i) {
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      var current = index === stops.length - 1 && stops.length < items.length
        ? items.length - 1
        : index;
      items.forEach(function (item, i) { item.classList.toggle("is-current", i === current); });
    }

    function go(i) {
      index = (i + stops.length) % stops.length;
      track.scrollTo({ left: stops[index], behavior: reduceMotion ? "auto" : "smooth" });
      mark();
    }

    function tick() {
      if (!paused && inView && !document.hidden) go(index + 1);
    }

    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(tick, INTERVAL);
    }

    root.querySelector("[data-carousel-prev]").addEventListener("click", function () { go(index - 1); restart(); });
    root.querySelector("[data-carousel-next]").addEventListener("click", function () { go(index + 1); restart(); });

    root.addEventListener("pointerenter", function () { paused = true; });
    root.addEventListener("pointerleave", function () { paused = false; restart(); });
    root.addEventListener("focusin", function () { paused = true; });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) { paused = false; restart(); }
    });

    // Keep the index in sync when the user swipes or scrolls the track manually.
    var scrollEnd;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollEnd);
      scrollEnd = setTimeout(function () {
        var nearest = 0;
        stops.forEach(function (s, i) {
          if (Math.abs(s - track.scrollLeft) < Math.abs(stops[nearest] - track.scrollLeft)) nearest = i;
        });
        if (nearest !== index) { index = nearest; mark(); }
      }, 120);
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.3 }).observe(root);
    } else {
      inView = true;
    }

    window.addEventListener("resize", computeStops);
    computeStops();
    restart();
  });

  /* ---- pointer-tracked card highlight --------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }
})();
