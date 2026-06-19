/** Shared UK/US marketing site routing — accountants.marsal.work ↔ marsalaccountants.co.uk */

export type Market = 'uk' | 'us';

export const MARKET_COOKIE = 'marsal_market';
/** Cookie Max-Age in seconds (365 days). */
export const MARKET_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export const UK_ORIGIN = 'https://www.marsalaccountants.co.uk';
export const US_ORIGIN = 'https://accountants.marsal.work';

/**
 * Public label for the US practice until the NY entity is registered.
 * After formation, set to the legal name (e.g. Marsal Accountants USA LLC) and rebuild both sites.
 */
export const US_PRACTICE_PUBLIC_LABEL = 'United States office';

import { mapPathForUsSite } from './path-map';

export { mapPathForUsSite, US_SERVICE_SLUGS } from './path-map';

export function originForMarket(market: Market): string {
  return market === 'us' ? US_ORIGIN : UK_ORIGIN;
}

export function buildMarketUrl(market: Market, pathname: string): string {
  const base = originForMarket(market).replace(/\/$/, '');
  const path = market === 'us' ? mapPathForUsSite(pathname) : pathname || '/';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
