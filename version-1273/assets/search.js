(function () {
  var input = document.querySelector('[data-site-search]');
  var results = document.querySelector('[data-search-results]');
  var status = document.querySelector('[data-search-status]');
  var items = window.SEARCH_INDEX || [];

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[character];
    });
  }

  function renderCard(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<a class="movie-card" href="' + escapeHtml(item.url) + '">' +
      '<div class="card-cover">' +
        '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<span class="card-badge">' + escapeHtml(item.type) + '</span>' +
        '<span class="card-year">' + escapeHtml(item.year) + '</span>' +
        '<span class="play-hover">▶</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.oneLine) + '</p>' +
        '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.genre) + '</span></div>' +
        '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
    '</a>';
  }

  function search() {
    var keyword = (input.value || '').trim().toLowerCase();

    if (!keyword) {
      results.innerHTML = '';
      status.textContent = '输入关键词开始搜索';
      return;
    }

    var matched = items.filter(function (item) {
      var content = [
        item.title,
        item.oneLine,
        item.region,
        item.type,
        item.year,
        item.genre,
        (item.tags || []).join(' ')
      ].join(' ').toLowerCase();
      return content.indexOf(keyword) !== -1;
    }).slice(0, 96);

    status.textContent = matched.length ? '已匹配到相关内容' : '暂无匹配内容';
    results.innerHTML = matched.map(renderCard).join('');
  }

  if (input && results && status) {
    input.addEventListener('input', search);
    search();
  }
})();
