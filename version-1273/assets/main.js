(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  function syncHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panelNode) {
    var input = panelNode.querySelector('[data-filter-input]');
    var yearSelect = panelNode.querySelector('[data-filter-year]');
    var typeSelect = panelNode.querySelector('[data-filter-type]');
    var section = panelNode.parentElement;
    var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
    var empty = section.querySelector('[data-empty-state]');
    var years = [];
    var types = [];

    cards.forEach(function (card) {
      var year = card.getAttribute('data-year') || '';
      var type = card.getAttribute('data-type') || '';
      if (year && years.indexOf(year) === -1) {
        years.push(year);
      }
      if (type && types.indexOf(type) === -1) {
        types.push(type);
      }
    });

    years.sort(function (a, b) {
      return Number(b) - Number(a);
    });
    types.sort();

    years.forEach(function (year) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    types.forEach(function (type) {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeSelect.appendChild(option);
    });

    function applyFilter() {
      var keyword = (input.value || '').trim().toLowerCase();
      var selectedYear = yearSelect.value;
      var selectedType = typeSelect.value;
      var visible = 0;

      cards.forEach(function (card) {
        var content = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var matchesKeyword = !keyword || content.indexOf(keyword) !== -1;
        var matchesYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var matchesType = !selectedType || card.getAttribute('data-type') === selectedType;
        var showCard = matchesKeyword && matchesYear && matchesType;
        card.style.display = showCard ? '' : 'none';
        if (showCard) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    input.addEventListener('input', applyFilter);
    yearSelect.addEventListener('change', applyFilter);
    typeSelect.addEventListener('change', applyFilter);
  });
})();
