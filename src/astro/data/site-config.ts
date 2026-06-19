/** Public site constants — analytics, maps, social profiles. */

export const GTM_ID = 'GTM-M4PS2ZPF';

export const CONSENT_COOKIE = 'marsal_cookie_consent';

/** Office 1.4, 1 Macdowall Street, Paisley PA3 2NB — fixed pin (avoids wrong geocode e.g. PureGym). */
export const MAP_ADDRESS = 'Office 1.4, 1 Macdowall St, Paisley PA3 2NB';
export const MAP_LAT = 55.8500814;
export const MAP_LNG = -4.4319203;

/** Opens Google Maps directions to our office. */
export const MAP_OPEN_URL =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(MAP_ADDRESS);

/**
 * Embed centred on lat/lng — address-only geocoding was resolving to PureGym Paisley.
 */
export const MAP_EMBED_URL =
  `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}+(Marsal+Accountants)&hl=en&z=17&output=embed`;

export const SOCIAL_LINKS = {
  googleBusiness: MAP_OPEN_URL,
  facebook: 'https://www.facebook.com/marsal.accountants',
  twitter: 'https://x.com/marsalacntnts',
} as const;

export const SAME_AS_URLS = [
  'https://www.google.com/maps/search/Marsal+Accountants+Paisley',
  SOCIAL_LINKS.facebook,
  SOCIAL_LINKS.twitter,
];
