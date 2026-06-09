(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = Number(dot.getAttribute("data-hero-dot"));
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".site-search-input"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
    var currentFilter = "";

    function getInputValue() {
        var focused = document.activeElement;
        if (focused && focused.classList && focused.classList.contains("site-search-input")) {
            return focused.value.trim().toLowerCase();
        }

        for (var i = 0; i < searchInputs.length; i += 1) {
            if (searchInputs[i].value.trim()) {
                return searchInputs[i].value.trim().toLowerCase();
            }
        }

        return "";
    }

    function applySearch() {
        var keyword = getInputValue();
        cards.forEach(function (card) {
            var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchesFilter = !currentFilter || haystack.indexOf(currentFilter) !== -1;
            card.classList.toggle("is-hidden", !(matchesKeyword && matchesFilter));
        });
    }

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            var value = input.value;
            searchInputs.forEach(function (otherInput) {
                if (otherInput !== input) {
                    otherInput.value = value;
                }
            });
            applySearch();
        });
    });

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentFilter = (button.getAttribute("data-filter-value") || "").toLowerCase();
            filterButtons.forEach(function (item) {
                item.classList.toggle("is-active", item === button);
            });
            applySearch();
        });
    });
})();
