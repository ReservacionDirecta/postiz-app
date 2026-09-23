import { parse } from 'tldts';

export function getCookieUrlFromDomain(
  domain: string
): string | undefined {
  // Explicit opt-out for shared-suffix hosts (e.g. *.up.railway.app):
  // browsers reject the Domain attribute there, so use host-only cookies.
  if (process.env.COOKIE_HOST_ONLY === 'true') {
    return undefined;
  }
  const url = parse(domain);
  if (!url.domain) {
    return url.hostname || undefined;
  }
  // When the registrable domain IS a public suffix (e.g. *.up.railway.app),
  // browsers reject cookies with a Domain attribute entirely. Return
  // undefined so Express sets a host-only cookie instead.
  if (url.domain === url.publicSuffix) {
    return undefined;
  }
  return '.' + url.domain;
}
