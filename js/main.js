/**
 * main.js
 * Form validation + submit handling for the newsletter (in the footer,
 * present on every page) and the contact form (kontakt.html).
 *
 * IMPORTANT — reading before wiring this to a real database:
 * This is a static site (HTML/CSS/JS only, e.g. hosted on GitHub Pages),
 * so there is no server here to write to a real database. Both forms below
 * first try to POST to a backend endpoint (NEWSLETTER_ENDPOINT / CONTACT_ENDPOINT).
 * Until you have a real backend, they fall back to saving into the
 * browser's localStorage, purely so you can demo/test the flow end to end.
 * To go live, stand up any small backend (Node/PHP/Cloud Function etc.),
 * point the constants below at it, and it will start receiving real
 * submissions instead of using the localStorage fallback. See README.md.
 */
(function () {
  var NEWSLETTER_ENDPOINT = '/api/newsletter'; // replace with your real endpoint
  var CONTACT_ENDPOINT = '/api/contact';       // replace with your real endpoint
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[0-9+()\s-]{6,20}$/;

  function saveLocally(storeKey, entry) {
    try {
      var all = JSON.parse(localStorage.getItem(storeKey) || '[]');
      all.push(entry);
      localStorage.setItem(storeKey, JSON.stringify(all));
      return true;
    } catch (e) {
      console.error('localStorage error', e);
      return false;
    }
  }

  function submitEntry(endpoint, storeKey, payload) {
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('server responded ' + res.status);
        return { ok: true, via: 'server' };
      })
      .catch(function () {
        // No backend yet (or it's unreachable) — fall back to a local demo store.
        var saved = saveLocally(storeKey, payload);
        return { ok: saved, via: 'local' };
      });
  }

  /* ---------------- Newsletter (footer, every page) ---------------- */
  function wireNewsletter() {
    var form = document.getElementById('newsletter-form');
    var message = document.getElementById('newsletter-message');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('newsletter-email');
      var email = input.value.trim();

      if (!EMAIL_RE.test(email)) {
        message.textContent = 'Unesite ispravnu email adresu.';
        message.className = 'form-message is-error';
        input.focus();
        return;
      }

      message.textContent = 'Šaljem prijavu…';
      message.className = 'form-message';

      submitEntry(NEWSLETTER_ENDPOINT, 'sigurnoit_newsletter_subs', {
        email: email,
        subscribedAt: new Date().toISOString()
      }).then(function (result) {
        if (result.ok) {
          message.textContent = 'Hvala! Prijavili ste se na novosti.';
          message.className = 'form-message is-success';
          form.reset();
        } else {
          message.textContent = 'Nešto je pošlo po zlu. Pokušajte ponovno.';
          message.className = 'form-message is-error';
        }
      });
    });
  }

  /* ---------------- Contact form (kontakt.html) ---------------- */
  function showFieldError(field, errorEl, msg) {
    if (msg) {
      field.classList.add('is-invalid');
      errorEl.textContent = msg;
    } else {
      field.classList.remove('is-invalid');
      errorEl.textContent = '';
    }
  }

  function wireContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('contact-status');

    var fields = {
      firstName: { el: form.querySelector('#cf-first-name'), err: form.querySelector('#err-first-name') },
      lastName: { el: form.querySelector('#cf-last-name'), err: form.querySelector('#err-last-name') },
      email: { el: form.querySelector('#cf-email'), err: form.querySelector('#err-email') },
      phone: { el: form.querySelector('#cf-phone'), err: form.querySelector('#err-phone') },
      message: { el: form.querySelector('#cf-message'), err: form.querySelector('#err-message') }
    };

    function validate() {
      var valid = true;

      if (!fields.firstName.el.value.trim()) {
        showFieldError(fields.firstName.el, fields.firstName.err, 'Ime je obavezno.');
        valid = false;
      } else showFieldError(fields.firstName.el, fields.firstName.err, '');

      if (!fields.lastName.el.value.trim()) {
        showFieldError(fields.lastName.el, fields.lastName.err, 'Prezime je obavezno.');
        valid = false;
      } else showFieldError(fields.lastName.el, fields.lastName.err, '');

      var email = fields.email.el.value.trim();
      if (!email) {
        showFieldError(fields.email.el, fields.email.err, 'Email je obavezan.');
        valid = false;
      } else if (!EMAIL_RE.test(email)) {
        showFieldError(fields.email.el, fields.email.err, 'Unesite ispravnu email adresu (npr. ime@primjer.hr).');
        valid = false;
      } else showFieldError(fields.email.el, fields.email.err, '');

      var phone = fields.phone.el.value.trim();
      if (!phone) {
        showFieldError(fields.phone.el, fields.phone.err, 'Broj telefona je obavezan.');
        valid = false;
      } else if (!PHONE_RE.test(phone)) {
        showFieldError(fields.phone.el, fields.phone.err, 'Unesite ispravan broj telefona.');
        valid = false;
      } else showFieldError(fields.phone.el, fields.phone.err, '');

      if (!fields.message.el.value.trim()) {
        showFieldError(fields.message.el, fields.message.err, 'Poruka je obavezna.');
        valid = false;
      } else showFieldError(fields.message.el, fields.message.err, '');

      return valid;
    }

    // Live validation once a field has been touched.
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', validate);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      if (!validate()) {
        status.textContent = 'Molimo ispravite označena polja prije slanja.';
        status.className = 'form-status is-error is-visible';
        return;
      }

      var payload = {
        firstName: fields.firstName.el.value.trim(),
        lastName: fields.lastName.el.value.trim(),
        email: fields.email.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        message: fields.message.el.value.trim(),
        sentAt: new Date().toISOString()
      };

      status.textContent = 'Šaljem poruku…';
      status.className = 'form-status is-visible';

      submitEntry(CONTACT_ENDPOINT, 'sigurnoit_contact_messages', payload).then(function (result) {
        if (result.ok) {
          status.textContent = 'Hvala, ' + payload.firstName + '! Vaša je poruka zaprimljena, javit ćemo vam se uskoro.';
          status.className = 'form-status is-success is-visible';
          form.reset();
        } else {
          status.textContent = 'Nešto je pošlo po zlu. Pokušajte ponovno ili nas kontaktirajte izravno na info@sigurnoit.hr.';
          status.className = 'form-status is-error is-visible';
        }
      });
    });
  }

  /* ---------------- Nav toggle + active link (header is inline in every page) ---------------- */
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

  document.addEventListener('DOMContentLoaded', function () {
    wireNavToggle();
    highlightActiveLink();
    wireNewsletter();
    wireContactForm();
  });
})();
