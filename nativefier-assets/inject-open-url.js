/**
 * Nativefier preload inject: bottom-left FAB opens a sliding panel for
 * opening shared URLs and copying / generating your own share link.
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

	function toast(msg) {
		var doc = window.document;
		var t = doc.getElementById('noises-openurl-toast');
		if (t) t.remove();
		t = doc.createElement('div');
		t.id = 'noises-openurl-toast';
		t.textContent = msg;
		doc.body.appendChild(t);
		window.setTimeout(function () {
			if (t.parentNode) t.parentNode.removeChild(t);
		}, 2200);
	}

	function copyMyLink() {
		var url = window.location.href.replace(/#$/, '');
		function done(ok) {
			toast(ok ? 'Link copied to clipboard.' : 'Could not copy — select the address bar (Ctrl+L) and copy.');
		}
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(function () { done(true); }).catch(function () {
				fallbackCopy(url, done);
			});
		} else {
			fallbackCopy(url, done);
		}
	}

	function fallbackCopy(text, done) {
		try {
			var ta = window.document.createElement('textarea');
			ta.value = text;
			ta.style.position = 'fixed';
			ta.style.left = '-9999px';
			window.document.body.appendChild(ta);
			ta.select();
			var ok = window.document.execCommand('copy');
			window.document.body.removeChild(ta);
			done(!!ok);
		} catch (e) {
			done(false);
		}
	}

	function triggerSiteSharePin() {
		var doc = window.document;
		var sel =
			'img.ctrlImg[alt="Share/Save Settings"], img[onclick*="urlGen"], img[src*="share.png"]';
		var el = doc.querySelector(sel);
		if (!el) {
			el = doc.querySelector('.ctrSection img[onclick*="urlGen"]');
		}
		if (el) {
			el.click();
			toast('Site share opened — use its URL, or tap Copy my link after.');
			return;
		}
		toast('Pin control not found — scroll to the top player controls.');
	}

	function setOpen(dock, fab, panel, open) {
		dock.setAttribute('data-open', open ? '1' : '0');
		fab.setAttribute('aria-expanded', open ? 'true' : 'false');
		panel.setAttribute('aria-hidden', open ? 'false' : 'true');
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
		var dock = doc.createElement('div');
		dock.id = 'noises-openurl-dock';
		dock.setAttribute('data-open', '0');

		var fab = doc.createElement('button');
		fab.type = 'button';
		fab.id = 'noises-openurl-fab';
		fab.setAttribute('aria-label', 'Open links and sharing');
		fab.setAttribute('aria-expanded', 'false');
		fab.setAttribute('aria-controls', 'noises-openurl-panel');
		fab.innerHTML =
			'<span class="noises-openurl-fab-icon" aria-hidden="true">' +
			'<svg width="22" height="22" viewBox="0 0 24 24" focusable="false">' +
			'<path fill="currentColor" d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z"/>' +
			'</svg></span>';

		var panel = doc.createElement('div');
		panel.id = 'noises-openurl-panel';
		panel.setAttribute('role', 'dialog');
		panel.setAttribute('aria-label', 'Share and open links');
		panel.setAttribute('aria-hidden', 'true');

		var inner = doc.createElement('div');
		inner.className = 'noises-openurl-panel-inner';

		var hOpen = doc.createElement('p');
		hOpen.className = 'noises-openurl-hint';
		hOpen.textContent = 'Open a mix someone sent you';

		var rowOpen = doc.createElement('div');
		rowOpen.className = 'noises-openurl-row';

		var inp = doc.createElement('input');
		inp.type = 'url';
		inp.id = 'noises-openurl-input';
		inp.placeholder = 'Paste noises.online link…';
		inp.setAttribute('autocomplete', 'off');

		var btnGo = doc.createElement('button');
		btnGo.type = 'button';
		btnGo.id = 'noises-openurl-go';
		btnGo.textContent = 'Open';

		rowOpen.appendChild(inp);
		rowOpen.appendChild(btnGo);

		var div1 = doc.createElement('div');
		div1.className = 'noises-openurl-divider';

		var hShr = doc.createElement('p');
		hShr.className = 'noises-openurl-hint';
		hShr.textContent = 'Share your current setup';

		var rowShr = doc.createElement('div');
		rowShr.className = 'noises-openurl-row noises-openurl-row-actions';

		var btnCopy = doc.createElement('button');
		btnCopy.type = 'button';
		btnCopy.id = 'noises-openurl-copy';
		btnCopy.textContent = 'Copy my link';

		var btnPin = doc.createElement('button');
		btnPin.type = 'button';
		btnPin.id = 'noises-openurl-pin';
		btnPin.textContent = 'Pin dialog';

		rowShr.appendChild(btnCopy);
		rowShr.appendChild(btnPin);

		var sub = doc.createElement('p');
		sub.className = 'noises-openurl-subtle';
		sub.textContent =
			'Tip: if the copied link has no mix in it, tap Pin dialog first, then copy again.';

		var btnHide = doc.createElement('button');
		btnHide.type = 'button';
		btnHide.id = 'noises-openurl-collapse';
		btnHide.className = 'noises-openurl-collapse';
		btnHide.textContent = 'Hide';

		inner.appendChild(hOpen);
		inner.appendChild(rowOpen);
		inner.appendChild(div1);
		inner.appendChild(hShr);
		inner.appendChild(rowShr);
		inner.appendChild(sub);
		inner.appendChild(btnHide);

		panel.appendChild(inner);
		dock.appendChild(fab);
		dock.appendChild(panel);

		function toggleDock() {
			var open = dock.getAttribute('data-open') !== '1';
			setOpen(dock, fab, panel, open);
			if (open) {
				window.setTimeout(function () {
					try {
						inp.focus();
					} catch (e) { /* ignore */ }
				}, 320);
			}
		}

		fab.addEventListener('click', function (ev) {
			ev.stopPropagation();
			toggleDock();
		});

		btnHide.addEventListener('click', function () {
			setOpen(dock, fab, panel, false);
		});

		btnGo.addEventListener('click', function () {
			tryOpen(inp.value);
		});
		inp.addEventListener('keydown', function (ev) {
			if (ev.key === 'Enter') tryOpen(inp.value);
		});

		btnCopy.addEventListener('click', function () {
			copyMyLink();
		});

		btnPin.addEventListener('click', function () {
			triggerSiteSharePin();
			setOpen(dock, fab, panel, false);
		});

		doc.addEventListener('keydown', function (ev) {
			if (ev.key === 'Escape' && dock.getAttribute('data-open') === '1') {
				setOpen(dock, fab, panel, false);
			}
		});

		doc.body.appendChild(dock);
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
