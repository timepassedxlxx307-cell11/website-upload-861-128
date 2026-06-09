(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setHero(index, slides, dots) {
    slides.forEach(function (slide, position) {
      slide.classList.toggle('is-active', position === index);
    });
    dots.forEach(function (dot, position) {
      dot.classList.toggle('is-active', position === index);
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var prev = qs('.hero-prev', hero);
    var next = qs('.hero-next', hero);
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;
    function go(nextIndex) {
      active = (nextIndex + slides.length) % slides.length;
      setHero(active, slides, dots);
    }
    function play() {
      timer = window.setInterval(function () {
        go(active + 1);
      }, 5000);
    }
    function pause() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    if (prev) {
      prev.addEventListener('click', function () {
        go(active - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        go(active + 1);
      });
    }
    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        go(position);
      });
    });
    hero.addEventListener('mouseenter', pause);
    hero.addEventListener('mouseleave', play);
    go(0);
    play();
  }

  function setupMobileNav() {
    var button = qs('[data-mobile-toggle]');
    var nav = qs('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupSearchForms() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input', form);
        var query = input ? input.value.trim() : '';
        if (query) {
          window.location.href = 'search.html?q=' + encodeURIComponent(query);
        }
      });
    });
  }

  function setupLocalFilters() {
    var form = qs('[data-local-filter]');
    if (!form) {
      return;
    }
    var cards = qsa('[data-movie-card]');
    var keyword = qs('[data-filter-keyword]', form);
    var year = qs('[data-filter-year]', form);
    var type = qs('[data-filter-type]', form);
    var reset = qs('[data-filter-reset]', form);
    function apply() {
      var keywordValue = keyword ? keyword.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;
        if (keywordValue && text.indexOf(keywordValue) === -1) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (typeValue && cardType !== typeValue) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
      });
    }
    [keyword, year, type].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
    if (reset) {
      reset.addEventListener('click', function () {
        if (keyword) {
          keyword.value = '';
        }
        if (year) {
          year.value = '';
        }
        if (type) {
          type.value = '';
        }
        apply();
      });
    }
  }

  function cardTemplate(movie) {
    var title = escapeHtml(movie.title);
    var desc = escapeHtml(movie.desc);
    var genre = escapeHtml(movie.genre);
    return '<article class="movie-card" data-movie-card data-search="' + escapeHtml([movie.title, movie.desc, movie.genre, movie.region, movie.type, movie.year].join(' ')) + '" data-year="' + escapeHtml(movie.year) + '" data-type="' + escapeHtml(movie.type) + '">' +
      '<a class="card-link" href="' + escapeHtml(movie.url) + '">' +
      '<div class="poster poster-small"><img src="' + escapeHtml(movie.cover) + '" alt="' + title + '" loading="lazy"><span class="play-badge">▶</span></div>' +
      '<div class="card-body"><h3>' + title + '</h3><p>' + desc + '</p><div class="card-meta"><span><span class="star">★</span> ' + escapeHtml(movie.rating) + ' · ' + escapeHtml(movie.year) + '</span><span class="tag">' + genre + '</span></div></div>' +
      '</a></article>';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupSearchPage() {
    var box = qs('[data-search-results]');
    if (!box || !window.siteMovieIndex) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = qs('[data-search-page-input]');
    if (input) {
      input.value = query;
    }
    function render(value) {
      var keyword = value.trim().toLowerCase();
      if (!keyword) {
        box.innerHTML = '<div class="empty-state">输入影片名称、类型、年份或地区即可检索片库。</div>';
        return;
      }
      var results = window.siteMovieIndex.filter(function (movie) {
        return [movie.title, movie.desc, movie.genre, movie.region, movie.type, movie.year].join(' ').toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 120);
      if (!results.length) {
        box.innerHTML = '<div class="empty-state">没有找到匹配影片。</div>';
        return;
      }
      box.innerHTML = results.map(cardTemplate).join('');
    }
    render(query);
    var form = qs('[data-search-page-form]');
    if (form && input) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var value = input.value.trim();
        var nextUrl = 'search.html' + (value ? '?q=' + encodeURIComponent(value) : '');
        window.history.replaceState(null, '', nextUrl);
        render(value);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHero();
    setupMobileNav();
    setupSearchForms();
    setupLocalFilters();
    setupSearchPage();
  });
})();
