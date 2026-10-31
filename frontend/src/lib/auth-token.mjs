export function getTokenFromUrl(searchOrUrl = '') {
  if (!searchOrUrl) return null;

  const rawValue = String(searchOrUrl);
  const targetUrl = rawValue.startsWith('http')
    ? new URL(rawValue)
    : new URL(rawValue, 'http://localhost');

  const token = targetUrl.searchParams.get('token');
  return token && token.trim() ? token : null;
}

export function clearTokenFromUrl(url = 'http://localhost') {
  const parsedUrl = new URL(url, 'http://localhost');
  parsedUrl.searchParams.delete('token');
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || '/';
}
