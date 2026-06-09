(function () {
  const body = document.body;
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (toggle && topbar) {
    toggle.addEventListener('click', () => topbar.classList.toggle('open'));
  }

  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();

  const searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot && Array.isArray(window.MOVIE_CATALOG)) {
    const input = searchRoot.querySelector('[data-search-input]');
    const results = searchRoot.querySelector('[data-search-results]');
    const total = searchRoot.querySelector('[data-search-total]');
    const sort = searchRoot.querySelector('[data-search-sort]');

    function scoreMovie(m) {
      const base = Number(m.score || 0);
      const year = Number(m.year || 2000);
      return base + year / 1000;
    }

    function render(list) {
      if (!results) return;
      if (!list.length) {
        results.innerHTML = '<div class="search-empty">没有找到匹配的影片，试试更短的关键词或切换分类。</div>';
        if (total) total.textContent = '0';
        return;
      }
      if (sort && sort.value === 'year-desc') {
        list.sort((a, b) => Number(b.year) - Number(a.year));
      } else if (sort && sort.value === 'year-asc') {
        list.sort((a, b) => Number(a.year) - Number(b.year));
      } else {
        list.sort((a, b) => scoreMovie(b) - scoreMovie(a));
      }
      if (total) total.textContent = String(list.length);
      results.innerHTML = list.slice(0, 120).map((m, idx) => `
        <a class="movie-card card-hover" href="${m.slug}">
          <div class="movie-poster"><img src="${m.poster}" alt="${m.title}"></div>
          <div class="movie-body">
            <h3 class="movie-title">${m.title}</h3>
            <div class="movie-meta"><span>${m.year}</span><span>•</span><span>${m.region}</span><span>•</span><span>${m.type}</span></div>
            <div class="movie-desc">${m.one_line}</div>
            <div class="movie-tags">${(m.tags || []).slice(0,3).map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </a>
      `).join('');
    }

    function searchNow() {
      const val = (input && input.value ? input.value : q).toLowerCase();
      let list = window.MOVIE_CATALOG.filter(m => {
        const hay = [m.title, m.region, m.type, m.genre, m.one_line, (m.tags || []).join(' ')].join(' ').toLowerCase();
        return !val || hay.includes(val);
      });
      render(list);
    }

    if (input) {
      input.value = q;
      input.addEventListener('input', searchNow);
    }
    if (sort) sort.addEventListener('change', searchNow);
    searchNow();
  }

  // Simple on-page category sort/filter for lists with cards having data-year
  const filterBar = document.querySelector('[data-filter-bar]');
  const filterGrid = document.querySelector('[data-filter-grid]');
  if (filterBar && filterGrid) {
    const cards = Array.from(filterGrid.querySelectorAll('[data-card]'));
    function applyFilter() {
      const keyword = (filterBar.querySelector('[data-filter-keyword]')?.value || '').trim().toLowerCase();
      const year = filterBar.querySelector('[data-filter-year]')?.value || '';
      const sort = filterBar.querySelector('[data-filter-sort]')?.value || 'score';
      let list = cards.filter(card => {
        const hay = (card.dataset.search || '').toLowerCase();
        const y = card.dataset.year || '';
        return (!keyword || hay.includes(keyword)) && (!year || y === year);
      });
      if (sort === 'year-desc') list.sort((a,b)=>Number(b.dataset.year)-Number(a.dataset.year));
      else if (sort === 'year-asc') list.sort((a,b)=>Number(a.dataset.year)-Number(b.dataset.year));
      else list.sort((a,b)=>Number(b.dataset.score||0)-Number(a.dataset.score||0));
      filterGrid.innerHTML = '';
      list.forEach(card => filterGrid.appendChild(card));
    }
    filterBar.querySelectorAll('input,select').forEach(el => el.addEventListener('input', applyFilter));
    filterBar.querySelectorAll('input,select').forEach(el => el.addEventListener('change', applyFilter));
  }
})();
