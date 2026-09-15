/**
 * include.js
 * Loads partials/header.html and partials/footer.html into every page,
 * so the header and footer only need to be edited in one place.
 * Requires the page to be served over http(s) (fetch does not work with
 * file:// — use a local server such as VS Code "Live Server", `python -m
 * http.server`, or GitHub Pages once published).
 */
(function () {
  function highlightActiveLink() {
    var current = document.body.getAttribute('data-page');
    if (!current) return;
    document.querySelectorAll('.nav-menu a[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === current) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function wireNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function loadPartial(selector, url) {
    var target = document.querySelector(selector);
    if (!target) return Promise.resolve();
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Ne mogu učitati ' + url);
        return res.text();
      })
      .then(function (html) {
        target.innerHTML = html;
      })
      .catch(function (err) {
        console.error(err);
        target.innerHTML = '<p style="padding:16px;color:#B3432B;">Greška pri učitavanju sadržaja.</p>';
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      loadPartial('#site-header', 'partials/header.html'),
      loadPartial('#site-footer', 'partials/footer.html')
    ]).then(function () {
      wireNavToggle();
      highlightActiveLink();
      document.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  });
})();
