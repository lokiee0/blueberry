import { describe, expect, it } from 'vitest';

import { IPC_CHANNELS } from './index';

describe('IPC channel contracts', () => {
  it('uses namespaced, immutable channel names', () => {
    expect(IPC_CHANNELS.appInfo).toBe('app:info');
    expect(Object.isFrozen(IPC_CHANNELS)).toBe(true);
  });
});
