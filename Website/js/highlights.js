// Arrows and dots for the "Highlights Over the Years" carousel.
// Pages are counted in whole cards, so each arrow click or dot shows the next full set of cards.
(function () {
	var box = document.querySelector('.highlights-carousel');
	if (!box) return;
	var row = box.querySelector('.highlights-row');
	var cards = Array.prototype.slice.call(row.querySelectorAll('.highlight-card'));
	var prev = box.querySelector('.highlights-prev');
	var next = box.querySelector('.highlights-next');
	var dots = box.querySelector('.highlights-dots');
	if (!cards.length) return;

	function step() {
		// distance from one card's left edge to the next (card width + gap)
		return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
	}
	function perPage() { return Math.max(1, Math.floor((row.clientWidth + 16) / Math.max(1, step()))); }
	function pageCount() { return Math.max(1, Math.ceil(cards.length / perPage())); }
	function atEnd() { return row.scrollLeft + row.clientWidth >= row.scrollWidth - 2; }
	function currentPage() {
		if (atEnd()) return pageCount() - 1;
		return Math.round(row.scrollLeft / (step() * perPage()));
	}
	function goTo(page) {
		page = Math.max(0, Math.min(pageCount() - 1, page));
		var card = cards[Math.min(cards.length - 1, page * perPage())];
		row.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft });
		// refresh controls even if scroll events are delayed (e.g., background tabs)
		setTimeout(update, 50);
		setTimeout(update, 600);
	}

	function buildDots() {
		dots.innerHTML = '';
		var n = pageCount();
		for (var i = 0; i < n; i++) {
			var b = document.createElement('button');
			b.type = 'button';
			b.setAttribute('aria-label', 'Show highlights page ' + (i + 1));
			(function (page) { b.addEventListener('click', function () { goTo(page); }); })(i);
			dots.appendChild(b);
		}
		dots.style.display = n > 1 ? '' : 'none';
		update();
	}

	function update() {
		var p = currentPage();
		Array.prototype.forEach.call(dots.children, function (b, i) { b.classList.toggle('active', i === p); });
		// arrows loop around, so they hide only when everything fits on one page
		var single = pageCount() <= 1;
		prev.disabled = single;
		next.disabled = single;
	}

	// Loop: next on the last page goes to the first; previous on the first goes to the last.
	prev.addEventListener('click', function () {
		var p = currentPage();
		goTo(p === 0 ? pageCount() - 1 : p - 1);
	});
	next.addEventListener('click', function () {
		var p = currentPage();
		goTo(p >= pageCount() - 1 ? 0 : p + 1);
	});
	row.addEventListener('scroll', update);
	window.addEventListener('resize', buildDots);
	buildDots();
})();
