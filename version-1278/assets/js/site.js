(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var active = 0;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(active + 1);
    }, 6200);
  }

  function setupFiltering() {
    var searchInput = document.querySelector("[data-page-search]");
    var categorySelect = document.querySelector("[data-category-select]");
    var typeSelect = document.querySelector("[data-type-select]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-search-item]"));
    if (!items.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }
    var chipValue = "";
    function apply() {
      var query = normalize(searchInput ? searchInput.value : "");
      var category = normalize(categorySelect ? categorySelect.value : "");
      var type = normalize(typeSelect ? typeSelect.value : "");
      var chip = normalize(chipValue);
      items.forEach(function (item) {
        var text = normalize([
          item.getAttribute("data-title"),
          item.getAttribute("data-region"),
          item.getAttribute("data-type"),
          item.getAttribute("data-year"),
          item.getAttribute("data-genre")
        ].join(" "));
        var itemCategory = normalize(item.getAttribute("data-category"));
        var itemType = normalize(item.getAttribute("data-type"));
        var visible = true;
        if (query && text.indexOf(query) === -1) {
          visible = false;
        }
        if (category && itemCategory !== category) {
          visible = false;
        }
        if (type && itemType.indexOf(type) === -1) {
          visible = false;
        }
        if (chip && text.indexOf(chip) === -1) {
          visible = false;
        }
        item.classList.toggle("is-hidden", !visible);
      });
    }
    if (searchInput) {
      searchInput.addEventListener("input", apply);
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", apply);
    }
    if (typeSelect) {
      typeSelect.addEventListener("change", apply);
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chipValue = chip.getAttribute("data-filter-chip") || "";
        chips.forEach(function (other) {
          other.classList.toggle("is-active", other === chip);
        });
        apply();
      });
    });
    apply();
  }

  function initMoviePlayer(source) {
    var video = document.querySelector("[data-player]");
    var button = document.querySelector("[data-play-button]");
    if (!video || !source) {
      return;
    }
    var hlsInstance = null;
    function attach() {
      if (video.getAttribute("data-ready") === "1") {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      video.setAttribute("data-ready", "1");
    }
    function start() {
      attach();
      if (button) {
        button.classList.add("is-hidden");
      }
      var playback = video.play();
      if (playback && playback.catch) {
        playback.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }
    if (button) {
      button.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;

  ready(function () {
    setupMenu();
    setupHero();
    setupFiltering();
  });
})();
