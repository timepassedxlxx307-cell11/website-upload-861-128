(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", function () {
            menuButton.classList.toggle("is-open");
            navLinks.classList.toggle("is-open");
        });
    }

    var carousels = document.querySelectorAll("[data-hero-carousel]");

    carousels.forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function show(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show((current + 1) % slides.length);
            }, 5600);
        }
    });

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-button]"));

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var value = button.getAttribute("data-filter") || "all";
            var area = button.closest("section") || document;
            var items = Array.prototype.slice.call(area.querySelectorAll("[data-filter-item]"));

            filterButtons.forEach(function (item) {
                if (item.closest("section") === area) {
                    item.classList.toggle("active", item === button);
                }
            });

            items.forEach(function (item) {
                var haystack = [
                    item.getAttribute("data-title") || "",
                    item.getAttribute("data-type") || "",
                    item.getAttribute("data-genre") || "",
                    item.getAttribute("data-year") || "",
                    item.getAttribute("data-region") || ""
                ].join(" ");

                item.hidden = value !== "all" && haystack.indexOf(value) === -1;
            });
        });
    });

    function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, "");
    }

    function resultTemplate(movie) {
        return [
            "<li>",
            "<a href=\"" + movie.url + "\">",
            "<img src=\"" + movie.cover + "\" alt=\"" + movie.title.replace(/\"/g, "&quot;") + "\">",
            "<span><strong>" + movie.title + "</strong><em>" + movie.year + " · " + movie.region + " · " + movie.type + "</em></span>",
            "</a>",
            "</li>"
        ].join("");
    }

    function bindSearch(input) {
        var root = input.closest(".header-search") || input.closest(".hero-search-card") || document;
        var panel = root.querySelector("[data-search-panel]") || document.querySelector("[data-search-panel]");
        var list = root.querySelector("[data-search-results]") || document.querySelector("[data-search-results]");

        function render() {
            var keyword = normalize(input.value);

            if (!panel || !list) {
                return;
            }

            if (!keyword) {
                panel.hidden = true;
                list.innerHTML = "";
                return;
            }

            var movies = window.SEARCH_MOVIES || [];
            var matches = movies.filter(function (movie) {
                return normalize(movie.title + movie.year + movie.region + movie.type + movie.genre + movie.summary).indexOf(keyword) !== -1;
            }).slice(0, 10);

            panel.hidden = false;
            list.innerHTML = matches.length ? matches.map(resultTemplate).join("") : "<li class=\"empty-result\">没有找到匹配影片</li>";
        }

        input.addEventListener("input", render);
        input.addEventListener("focus", render);
        document.addEventListener("click", function (event) {
            if (panel && !root.contains(event.target)) {
                panel.hidden = true;
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-search-input]")).forEach(bindSearch);
}());
