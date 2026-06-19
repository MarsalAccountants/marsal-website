/**
 * Inlined in <head> on UK and US marketing sites (Phase 2).
 * Cookie + ?market= redirects run synchronously; geo uses /cdn-cgi/trace when available.
 */
(function marketRoutingHead() {
  var CFG = window.MARSAL_MARKET_BOOT;
  if (!CFG || typeof CFG !== 'object') return;
  var CURRENT = CFG.currentMarket;
  var host = location.hostname;
  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.localhost');

  if (isLocal && !CFG.forceOnLocalhost) return;

  var params = new URLSearchParams(location.search);
  if (params.get('nomarket') === '1') return;

  var ua = navigator.userAgent || '';
  if (/googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator/i.test(ua)) {
    return;
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function setCookie(value) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      CFG.cookieName +
      '=' +
      encodeURIComponent(value) +
      '; Path=/; Max-Age=' +
      CFG.cookieMaxAge +
      '; SameSite=Lax' +
      secure;
  }

  function mapPathForUs(pathname) {
    var path = pathname || '/';
    if (path !== '/' && !path.endsWith('/')) path = path + '/';
    if (path === '/' || path === '/services/' || path === '/contact/' || path === '/articles/') return path;
    if (path.indexOf('/articles/') === 0) return path;
    if (path.indexOf('/local/new-york/') === 0) return path;
    if (path.indexOf('/services/') === 0) {
      var slug = path.replace(/^\/services\//, '').replace(/\/$/, '');
      var usSlugs = ['accounting', 'bookkeeping', 'payroll', 'individual-tax-returns', 'business-tax', 'sales-tax'];
      if (usSlugs.indexOf(slug) !== -1) return '/services/' + slug + '/';
      var ukToUs = {
        vat: 'sales-tax',
        'self-assessment-tax-returns': 'individual-tax-returns',
        'corporation-tax-return-services': 'business-tax',
        'property-accounts': 'individual-tax-returns',
        'management-accounts': 'accounting',
        'tax-investigation': 'business-tax',
        'marsal-business-launchpad': 'accounting',
        'business-setup': 'accounting',
      };
      if (ukToUs[slug]) return '/services/' + ukToUs[slug] + '/';
      return '/services/';
    }
    if (path.indexOf('/local/paisley/') === 0) {
      var pSlug = path.replace(/^\/local\/paisley\//, '').replace(/\/$/, '');
      var pMap = {
        'accountants-in-paisley': 'accountants-in-new-york-city',
        'making-tax-digital-vat-paisley': 'nyc-sales-tax-small-business',
        'vat-registration-paisley': 'nyc-sales-tax-small-business',
        'vat-return-deadlines-paisley': 'nyc-sales-tax-small-business',
      };
      if (pMap[pSlug]) return '/local/new-york/' + pMap[pSlug] + '/';
      return '/local/new-york/accountants-in-new-york-city/';
    }
    return '/';
  }

  function targetUrl(market, pathname) {
    var base = market === 'us' ? CFG.usOrigin : CFG.ukOrigin;
    base = base.replace(/\/$/, '');
    var path = market === 'us' ? mapPathForUs(pathname) : pathname || '/';
    return base + (path.charAt(0) === '/' ? path : '/' + path);
  }

  function redirect(market) {
    var dest = targetUrl(market, location.pathname);
    if (dest === location.href.split('?')[0]) return;
    location.replace(dest);
  }

  var forced = params.get('market');
  if (forced === 'us' || forced === 'uk') {
    setCookie(forced);
    redirect(forced);
    return;
  }

  var cookie = getCookie(CFG.cookieName);
  if (cookie === 'us' && CURRENT === 'uk') {
    redirect('us');
    return;
  }
  if (cookie === 'uk' && CURRENT === 'us') {
    redirect('uk');
    return;
  }
  if (cookie === 'us' || cookie === 'uk') return;

  function countryImpliesUs(country) {
    return country === 'US';
  }

  function countryImpliesUk(country) {
    return country === 'GB' || country === 'GG' || country === 'JE' || country === 'IM';
  }

  function applyGeo(country) {
    if (!country) return;
    if (countryImpliesUs(country) && CURRENT === 'uk') {
      setCookie('us');
      redirect('us');
    } else if (countryImpliesUk(country) && CURRENT === 'us') {
      setCookie('uk');
      redirect('uk');
    } else if (!countryImpliesUs(country) && CURRENT === 'us') {
      setCookie('uk');
      redirect('uk');
    }
  }

  fetch('/cdn-cgi/trace', { cache: 'no-store' })
    .then(function (r) {
      return r.text();
    })
    .then(function (text) {
      var m = text.match(/loc=([A-Z]{2})/);
      applyGeo(m ? m[1] : '');
    })
    .catch(function () {});
})();
