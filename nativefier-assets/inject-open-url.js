/**
 * Loaded by Nativefier preload (app/lib/preload.js). Adds a bar to open a pasted
 * https://noises.online/... URL (e.g. a friend’s shared mix) in this window.
 */
(function () {
	function isAllowedHost(h) {
		if (!h) return false;
		var n = String(h).toLowerCase();
		return n === 'noises.online' || n === 'www.noises.online';
	}

	function tryOpen(raw) {
		var s = String(raw || '').trim();
		if (!s) return;
		var u;
		try {
			u = new URL(s);
		} catch (e) {
			try {
				u = new URL('https://' + s);
			} catch (e2) {
				window.alert('Invalid URL.');
				return;
			}
		}
		if (u.protocol !== 'https:' && u.protocol !== 'http:') {
			window.alert('Only http(s) links are allowed.');
			return;
		}
		if (!isAllowedHost(u.hostname)) {
			window.alert('Only links to noises.online are allowed.');
			return;
		}
		if (u.protocol === 'http:') {
			u.protocol = 'https:';
		}
		window.location.assign(u.toString());
	}

	function install() {
		if (typeof window === 'undefined' || !window.document || !window.document.body) return false;
		if (window.__noisesOpenUrlInstalled) return true;
		if (!window.location) return false;
		var h = window.location.hostname;
		if (!h) return false;
		if (!isAllowedHost(h)) return false;
		try {
			if (window.sessionStorage && window.sessionStorage.getItem('noisesOpenUrlBarHidden') === '1') return true;
		} catch (e) { /* ignore */ }
		window.__noisesOpenUrlInstalled = true;

		var doc = window.document;
		var bar = doc.createElement('div');
		bar.id = 'noises-openurl-bar';
		bar.setAttribute('role', 'region');
		bar.setAttribute('aria-label', 'Open shared noises.online link');

		var inp = doc.createElement('input');
		inp.type = 'url';
		inp.id = 'noises-openurl-input';
		inp.placeholder = 'Paste a noises.online link (shared mix)...';
		inp.setAttribute('autocomplete', 'off');

		var btn = doc.createElement('button');
		btn.type = 'button';
		btn.id = 'noises-openurl-go';
		btn.textContent = 'Open';

		var hide = doc.createElement('button');
		hide.type = 'button';
		hide.id = 'noises-openurl-hide';
		hide.textContent = 'Hide';
		hide.title = 'Hide this bar for this session';

		btn.addEventListener('click', function () { tryOpen(inp.value); });
		inp.addEventListener('keydown', function (ev) {
			if (ev.key === 'Enter') tryOpen(inp.value);
		});
		hide.addEventListener('click', function () {
			try {
				if (window.sessionStorage) window.sessionStorage.setItem('noisesOpenUrlBarHidden', '1');
			} catch (e) { /* ignore */ }
			bar.remove();
			window.__noisesOpenUrlInstalled = false;
		});

		bar.appendChild(inp);
		bar.appendChild(btn);
		bar.appendChild(hide);
		doc.body.appendChild(bar);
		return true;
	}

	var attempts = 0;
	var maxAttempts = 200;

	function poll() {
		attempts += 1;
		if (attempts > maxAttempts) return;
		try {
			if (install()) return;
		} catch (err) { /* keep trying */ }
		setTimeout(poll, 80);
	}

	setTimeout(poll, 0);
})();
