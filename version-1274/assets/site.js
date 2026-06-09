(function () {
    var header = document.querySelector('[data-header]');
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 16) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(dotIndex);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    document.querySelectorAll('[data-card-filter]').forEach(function (input) {
        var targetSelector = input.getAttribute('data-target');
        var target = document.querySelector(targetSelector);
        var empty = document.querySelector(input.getAttribute('data-empty') || '');

        if (!target) {
            return;
        }

        var cards = Array.prototype.slice.call(target.querySelectorAll('[data-filter-text]'));

        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-filter-text') || '').toLowerCase();
                var matched = keyword === '' || text.indexOf(keyword) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible === 0 ? 'block' : 'none';
            }
        });
    });
})();
