(function () {
    const body = document.body;
    const toggle = document.querySelector('[data-menu-toggle]');

    if (toggle) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            image.style.opacity = '0';
        }, { once: true });
    });

    const hero = document.querySelector('[data-carousel]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const dots = Array.from(hero.querySelectorAll('.hero-dot'));
        let current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const yearSelect = document.querySelector('[data-filter-year]');
    const typeSelect = document.querySelector('[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('.movie-card[data-search]'));
    const empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
        const query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        const year = yearSelect ? yearSelect.value : '';
        const type = typeSelect ? typeSelect.value : '';
        let visible = 0;

        cards.forEach(function (card) {
            const haystack = (card.getAttribute('data-search') || '').toLowerCase();
            const cardYear = card.getAttribute('data-year') || '';
            const cardType = card.getAttribute('data-type') || '';
            const matched = (!query || haystack.indexOf(query) !== -1) && (!year || cardYear === year) && (!type || cardType === type);
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    [filterInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    if (filterInput) {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get('q');
        if (keyword) {
            filterInput.value = keyword;
        }
        applyFilters();
    }

    const heroSearch = document.querySelector('[data-hero-search]');

    if (heroSearch) {
        heroSearch.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = heroSearch.querySelector('input');
            const value = input ? input.value.trim() : '';
            const target = heroSearch.getAttribute('action') || 'search.html';
            window.location.href = value ? target + '?q=' + encodeURIComponent(value) : target;
        });
    }
})();
