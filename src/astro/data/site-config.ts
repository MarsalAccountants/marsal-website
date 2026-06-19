/** Public site constants — analytics, maps, social profiles. */

export const GTM_ID = 'GTM-M4PS2ZPF';

export const CONSENT_COOKIE = 'marsal_cookie_consent';

/** Verified Google Maps link for Marsal Accountants (from Google Business Profile). */
export const MAP_OPEN_URL = 'https://maps.app.goo.gl/ZtQnxZCdLAXAA21T9';

/**
 * Map preview embed — clicks are handled by the overlay linking to MAP_OPEN_URL.
 */
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=55.8500814,-4.4319203+(Marsal+Accountants)&hl=en&z=17&output=embed';

export const SOCIAL_LINKS = {
  googleBusiness: MAP_OPEN_URL,
  facebook: 'https://www.facebook.com/marsal.accountants',
  twitter: 'https://x.com/marsalacntnts',
} as const;

export const SAME_AS_URLS = [
  MAP_OPEN_URL,
  SOCIAL_LINKS.facebook,
  SOCIAL_LINKS.twitter,
];
