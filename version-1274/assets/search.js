(function () {
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var line = document.querySelector('[data-search-line]');

    if (!input || !results || typeof MOVIE_DATA === 'undefined') {
        return;
    }

    function card(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '' +
            '<article class="movie-card">' +
                '<a class="movie-cover" href="' + movie.url + '" aria-label="' + escapeHtml(movie.title) + '">' +
                    '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                    '<span class="movie-play">▶</span>' +
                    '<span class="movie-year">' + escapeHtml(movie.year) + '</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                    '<div class="movie-card-meta">' +
                        '<a href="' + movie.categoryUrl + '">' + escapeHtml(movie.category) + '</a>' +
                        '<span>' + escapeHtml(movie.region) + '</span>' +
                    '</div>' +
                    '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
                    '<p>' + escapeHtml(movie.oneLine) + '</p>' +
                    '<div class="movie-tags">' + tags + '</div>' +
                '</div>' +
            '</article>';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function render() {
        var keyword = input.value.trim().toLowerCase();
        var items;

        if (keyword === '') {
            items = MOVIE_DATA.slice(0, 48);
            line.textContent = '输入片名、年份、地区或类型，可快速浏览相关内容';
        } else {
            items = MOVIE_DATA.filter(function (movie) {
                return movie.text.indexOf(keyword) !== -1;
            }).slice(0, 120);
            line.textContent = items.length ? '已匹配到相关影片' : '没有找到相关影片';
        }

        results.innerHTML = items.map(card).join('');
    }

    input.addEventListener('input', render);
    render();
})();
