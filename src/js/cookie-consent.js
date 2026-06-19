/**
 * UK cookie consent — loads GTM/GA4 only after analytics consent.
 * Functional cookies (e.g. marsal_market) are disclosed in the privacy policy.
 */

const CONSENT_COOKIE = 'marsal_cookie_consent';
const GTM_ID = 'GTM-M4PS2ZPF';
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60;

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
}

function setConsentCookie(value) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    CONSENT_COOKIE +
    '=' +
    encodeURIComponent(value) +
    '; Path=/; Max-Age=' +
    CONSENT_MAX_AGE +
    '; SameSite=Lax' +
    secure;
}

function loadGtm() {
  if (window.__marsalGtmLoaded) return;
  window.__marsalGtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  }]);

  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  document.head.appendChild(script);

  const noscript = document.createElement('noscript');
  noscript.innerHTML =
    '<iframe src="https://www.googletagmanager.com/ns.html?id=' +
    GTM_ID +
    '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
  document.body.insertBefore(noscript, document.body.firstChild);

  window.dataLayer.push(['consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  }]);
}

function hideBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.add('cookie-banner--hidden');
}

function showBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('cookie-banner--hidden');
}

function acceptCookies() {
  setConsentCookie('accepted');
  loadGtm();
  hideBanner();
}

function rejectCookies() {
  setConsentCookie('rejected');
  hideBanner();
}

function bindBannerActions() {
  document.getElementById('cookie-accept')?.addEventListener('click', acceptCookies);
  document.getElementById('cookie-reject')?.addEventListener('click', rejectCookies);
}

function bindSettingsLinks() {
  document.querySelectorAll('[data-cookie-settings]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showBanner();
    });
  });
}

function initCookieConsent() {
  bindBannerActions();
  bindSettingsLinks();

  const consent = getCookie(CONSENT_COOKIE);
  if (consent === 'accepted') {
    loadGtm();
    hideBanner();
    return;
  }
  if (consent === 'rejected') {
    hideBanner();
    return;
  }
  showBanner();
}

export { initCookieConsent, showBanner };
