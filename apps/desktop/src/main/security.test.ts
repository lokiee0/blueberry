import { describe, expect, it } from 'vitest';

import { isAllowedExternalUrl } from './security';

describe('isAllowedExternalUrl', () => {
  it.each([
    'https://example.com',
    'https://example.com/path?q=blueberry',
    'mailto:hello@example.com',
  ])('allows safe external destination %s', (url) => {
    expect(isAllowedExternalUrl(url)).toBe(true);
  });

  it.each([
    'http://example.com',
    'file:///C:/Windows/System32',
    'javascript:alert(1)',
    'https://user:password@example.com',
    'not a url',
  ])('blocks unsafe external destination %s', (url) => {
    expect(isAllowedExternalUrl(url)).toBe(false);
  });
});
