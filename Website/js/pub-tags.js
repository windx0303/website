// Topic labels and filtering for the Publications page.
// Each paper is an <li class="publication-item" data-tags="system dataset people">.
(function () {
	var TAGS = [
		{ key: 'system', name: 'System and Workflow' },
		{ key: 'dataset', name: 'Dataset' },
		{ key: 'model', name: 'Model' },
		{ key: 'evaluate', name: 'Evaluate AI' },
		{ key: 'people', name: 'Understand People' }
	];
	var selected = [];

	var papers = Array.prototype.slice.call(document.querySelectorAll('li.publication-item'));
	var bar = document.getElementById('tag-filter');
	if (!bar || !papers.length) return;

	function tagsOf(li) {
		return (li.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
	}

	// Show each paper's labels under its text.
	papers.forEach(function (li) {
		var tags = tagsOf(li);
		if (!tags.length) return;
		var box = document.createElement('div');
		box.className = 'paper-tags';
		TAGS.forEach(function (t) {
			if (tags.indexOf(t.key) < 0) return;
			var s = document.createElement('span');
			s.className = 'paper-tag paper-tag-' + t.key;
			s.textContent = t.name;
			s.title = 'Show only ' + t.name + ' papers';
			s.addEventListener('click', function () { selected = [t.key]; apply(); bar.scrollIntoView({ behavior: 'smooth' }); });
			box.appendChild(s);
		});
		var host = li.querySelector('.col-md-9') || li;
		host.appendChild(box);
	});

	// Filter bar.
	bar.innerHTML = '<span class="tag-filter-label">Topics:</span>';
	function button(key, name) {
		var b = document.createElement('button');
		b.type = 'button';
		b.className = 'tag-btn-' + key;
		b.textContent = name;
		b.setAttribute('data-key', key);
		b.addEventListener('click', function () {
			if (key === 'all') { selected = []; }
			else {
				var i = selected.indexOf(key);
				if (i >= 0) selected.splice(i, 1); else selected.push(key);
			}
			apply();
		});
		bar.appendChild(b);
	}
	button('all', 'All');
	TAGS.forEach(function (t) { button(t.key, t.name); });
	var count = document.createElement('span');
	count.className = 'tag-count';
	bar.appendChild(count);

	function apply() {
		var shown = 0;
		papers.forEach(function (li) {
			var tags = tagsOf(li);
			var ok = !selected.length || selected.some(function (k) { return tags.indexOf(k) >= 0; });
			li.classList.toggle('tag-hidden', !ok);
			if (ok) shown++;
		});
		// Hide theme boxes and sections that have nothing left to show.
		document.querySelectorAll('.rep-group, #wrap .row').forEach(function (box) {
			var items = box.querySelectorAll('li.publication-item');
			if (!items.length) return;
			var any = Array.prototype.some.call(items, function (li) { return !li.classList.contains('tag-hidden'); });
			box.classList.toggle('tag-hidden', !any);
		});
		Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
			var k = b.getAttribute('data-key');
			b.classList.toggle('active', k === 'all' ? !selected.length : selected.indexOf(k) >= 0);
		});
		count.textContent = 'Showing ' + shown + ' of ' + papers.length + ' papers';
	}
	apply();
})();
