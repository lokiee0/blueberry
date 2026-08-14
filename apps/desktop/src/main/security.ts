const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['https:', 'mailto:']);

export function isAllowedExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);

    if (!ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol)) {
      return false;
    }

    if (url.protocol === 'https:') {
      return Boolean(url.hostname) && !url.username && !url.password;
    }

    return Boolean(url.pathname);
  } catch {
    return false;
  }
}
