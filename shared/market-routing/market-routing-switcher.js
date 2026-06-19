/**
 * Region switcher clicks — set marsal_market cookie and navigate.
 */
(function marketRoutingSwitcher() {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-marsal-market]');
    if (!link) return;
    e.preventDefault();
    var market = link.getAttribute('data-marsal-market');
    if (market !== 'uk' && market !== 'us') return;
    var href = link.getAttribute('href');
    if (!href) return;
    try {
      var url = new URL(href, location.origin);
      url.searchParams.set('market', market);
      location.href = url.toString();
    } catch (err) {
      location.href = href + (href.indexOf('?') >= 0 ? '&' : '?') + 'market=' + market;
    }
  });
})();
