/** Public site constants — analytics, maps, social profiles. */

export const GTM_ID = 'GTM-M4PS2ZPF';

export const CONSENT_COOKIE = 'marsal_cookie_consent';

/** Google Maps embed for Office 1.4, 1 Macdowall Street, Paisley PA3 2NB. */
export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Office+1.4,+1+Macdowall+Street,+Paisley,+PA3+2NB,+Scotland&hl=en&z=16&output=embed';

export const SOCIAL_LINKS = {
  googleBusiness: 'https://www.google.com/maps/search/Marsal+Accountants+Paisley',
  facebook: 'https://www.facebook.com/marsal.accountants',
  twitter: 'https://x.com/marsalacntnts',
} as const;

export const SAME_AS_URLS = [
  SOCIAL_LINKS.googleBusiness,
  SOCIAL_LINKS.facebook,
  SOCIAL_LINKS.twitter,
];
