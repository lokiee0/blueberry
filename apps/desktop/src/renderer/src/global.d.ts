import type { BlueberryBridge } from '@blueberry/contracts';

declare global {
  interface Window {
    readonly blueberry: BlueberryBridge;
  }
}

export {};
