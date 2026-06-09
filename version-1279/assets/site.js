document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navLinks = document.querySelector("[data-nav-links]");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  var searchInputs = document.querySelectorAll("[data-site-search]");
  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      var value = input.value.trim().toLowerCase();
      document.querySelectorAll("[data-card]").forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.classList.toggle("is-hidden-card", value && !text.includes(value));
      });
    });
  });

  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("cover-empty");
    });
  });

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.closest("[data-filter-group]");
      if (!group) {
        return;
      }
      group.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.remove("is-active");
      });
      button.classList.add("is-active");
      var value = button.getAttribute("data-filter");
      document.querySelectorAll("[data-card-type]").forEach(function (card) {
        var type = card.getAttribute("data-card-type");
        card.classList.toggle("is-hidden-card", value !== "all" && type !== value);
      });
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var index = 0;
  var timer = null;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function startHero() {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  if (slides.length) {
    showSlide(0);
    startHero();
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
        startHero();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        startHero();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startHero();
      });
    }
  }
});
