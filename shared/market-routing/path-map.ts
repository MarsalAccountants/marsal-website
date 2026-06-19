/** Path mapping for UK ↔ US marketing hosts (keep in sync with market-routing-head.js and Cloudflare worker). */

export const US_SERVICE_SLUGS = [
  'accounting',
  'bookkeeping',
  'payroll',
  'individual-tax-returns',
  'business-tax',
  'sales-tax',
] as const;

const UK_TO_US_SERVICE: Record<string, string> = {
  vat: 'sales-tax',
  'self-assessment-tax-returns': 'individual-tax-returns',
  'corporation-tax-return-services': 'business-tax',
  'property-accounts': 'individual-tax-returns',
  'management-accounts': 'accounting',
  'tax-investigation': 'business-tax',
  'marsal-business-launchpad': 'accounting',
  'business-setup': 'accounting',
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Map any pathname to the best equivalent on the US site. */
export function mapPathForUsSite(pathname: string): string {
  const path = normalizePath(pathname);
  if (path === '/' || path === '/services/' || path === '/contact/' || path === '/articles/') {
    return path;
  }
  if (path.startsWith('/articles/')) return path;
  if (path.startsWith('/local/new-york/')) return path;
  if (path.startsWith('/services/')) {
    const slug = path.replace(/^\/services\//, '').replace(/\/$/, '');
    if ((US_SERVICE_SLUGS as readonly string[]).includes(slug)) return `/services/${slug}/`;
    if (UK_TO_US_SERVICE[slug]) return `/services/${UK_TO_US_SERVICE[slug]}/`;
    return '/services/';
  }
  if (path.startsWith('/local/paisley/')) {
    const paisleySlug = path.replace(/^\/local\/paisley\//, '').replace(/\/$/, '');
    const nyMap: Record<string, string> = {
      'accountants-in-paisley': 'accountants-in-new-york-city',
      'making-tax-digital-vat-paisley': 'nyc-sales-tax-small-business',
      'vat-registration-paisley': 'nyc-sales-tax-small-business',
      'vat-return-deadlines-paisley': 'nyc-sales-tax-small-business',
    };
    if (nyMap[paisleySlug]) return `/local/new-york/${nyMap[paisleySlug]}/`;
    return '/local/new-york/accountants-in-new-york-city/';
  }
  return '/';
}
