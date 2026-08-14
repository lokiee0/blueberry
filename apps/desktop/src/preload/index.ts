import type { BlueberryBridge } from '@blueberry/contracts';
import { contextBridge } from 'electron';

const bridge: BlueberryBridge = Object.freeze({
  platform: process.platform,
  versions: Object.freeze({
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  }),
});

contextBridge.exposeInMainWorld('blueberry', bridge);
