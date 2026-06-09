import { H as Hls } from './hls-dru42stk.js';
import { MOVIE_INDEX } from './search-data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function initMobileMenu() {
    const button = $('[data-menu-toggle]');
    const menu = $('[data-mobile-menu]');

    if (!button || !menu) {
        return;
    }

    button.addEventListener('click', () => {
        menu.classList.toggle('is-open');
    });
}

function initHeroSlider() {
    const slides = $$('[data-hero-slide]');
    const dots = $$('[data-hero-dot]');
    const prev = $('[data-hero-prev]');
    const next = $('[data-hero-next]');

    if (slides.length === 0) {
        return;
    }

    let active = 0;
    let timer = null;

    const show = (index) => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === active);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === active);
        });
    };

    const start = () => {
        stop();
        timer = window.setInterval(() => show(active + 1), 5600);
    };

    const stop = () => {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            show(Number(dot.dataset.heroDot || 0));
            start();
        });
    });

    if (prev) {
        prev.addEventListener('click', () => {
            show(active - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            show(active + 1);
            start();
        });
    }

    show(0);
    start();
}

function initCatalogFiltering() {
    $$('.catalog-filter').forEach((input) => {
        const targetSelector = input.dataset.target;
        const grid = targetSelector ? $(targetSelector) : null;

        if (!grid) {
            return;
        }

        const cards = $$('.movie-card', grid);

        input.addEventListener('input', () => {
            const keyword = input.value.trim().toLowerCase();

            cards.forEach((card) => {
                const haystack = `${card.dataset.title || ''} ${card.dataset.keywords || ''}`.toLowerCase();
                card.hidden = keyword.length > 0 && !haystack.includes(keyword);
            });
        });
    });
}

function initCatalogSorting() {
    $$('.sort-select').forEach((select) => {
        const targetSelector = select.dataset.target;
        const grid = targetSelector ? $(targetSelector) : null;

        if (!grid) {
            return;
        }

        const initialCards = $$('.movie-card', grid);
        initialCards.forEach((card, index) => {
            card.dataset.defaultIndex = String(index);
        });

        select.addEventListener('change', () => {
            const mode = select.value;
            const cards = $$('.movie-card', grid);

            cards.sort((a, b) => {
                if (mode === 'score') {
                    return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
                }
                if (mode === 'views') {
                    return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
                }
                if (mode === 'year') {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (mode === 'title') {
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                }
                return Number(a.dataset.defaultIndex || 0) - Number(b.dataset.defaultIndex || 0);
            });

            cards.forEach((card) => grid.appendChild(card));
        });
    });
}

function renderSearchCard(movie) {
    const tags = (movie.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');

    return `
<article class="movie-card" data-title="${escapeHtml(movie.title)}" data-year="${escapeHtml(movie.year)}" data-views="${movie.views}" data-score="${escapeHtml(movie.score)}">
    <a class="movie-poster" href="${escapeHtml(movie.url)}" aria-label="观看 ${escapeHtml(movie.title)}">
        <img src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy" onerror="this.style.display='none';">
        <span class="score-badge">${escapeHtml(movie.score)}</span>
        <span class="play-badge">▶</span>
    </a>
    <div class="movie-info">
        <div class="movie-meta-line"><span>${escapeHtml(movie.year)}</span><span>${escapeHtml(movie.region)}</span><span>${escapeHtml(movie.type)}</span></div>
        <h3><a href="${escapeHtml(movie.url)}">${escapeHtml(movie.title)}</a></h3>
        <p>${escapeHtml(movie.oneLine)}</p>
        <div class="tag-list">${tags}</div>
    </div>
</article>`;
}

function initSearchPage() {
    const results = $('[data-search-results]');
    const status = $('[data-search-status]');

    if (!results || !status) {
        return;
    }

    const query = new URLSearchParams(window.location.search).get('q') || '';
    const keyword = query.trim().toLowerCase();
    const bigInput = $('.big-search input[name="q"]');

    if (bigInput) {
        bigInput.value = query;
    }

    if (!keyword) {
        const picks = MOVIE_INDEX.slice(0, 24);
        status.textContent = '请输入关键词开始搜索。下方先展示部分热门影片。';
        results.innerHTML = picks.map(renderSearchCard).join('');
        return;
    }

    const matches = MOVIE_INDEX.filter((movie) => {
        const haystack = [
            movie.title,
            movie.oneLine,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            movie.category,
            ...(movie.tags || []),
        ].join(' ').toLowerCase();

        return haystack.includes(keyword);
    }).slice(0, 120);

    status.textContent = `搜索 “${query}” 找到 ${matches.length} 个结果${matches.length === 120 ? '，已展示前 120 个。' : '。'}`;
    results.innerHTML = matches.length > 0 ? matches.map(renderSearchCard).join('') : '<p class="search-status">没有匹配结果，请尝试更换关键词。</p>';
}

function initPlayers() {
    $$('[data-play-video]').forEach((button) => {
        button.addEventListener('click', () => {
            const shell = button.closest('.player-shell');
            const video = shell ? $('.main-video', shell) : null;

            if (!shell || !video) {
                return;
            }

            const src = video.dataset.src;

            if (!src) {
                return;
            }

            if (!video.dataset.loaded) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (Hls && Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                    video.hlsInstance = hls;
                } else {
                    video.src = src;
                }

                video.dataset.loaded = 'true';
            }

            shell.classList.add('is-playing');
            video.play().catch(() => {
                shell.classList.remove('is-playing');
            });
        });
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroSlider();
    initCatalogFiltering();
    initCatalogSorting();
    initSearchPage();
    initPlayers();
});
