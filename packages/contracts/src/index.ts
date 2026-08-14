export type BlueberryPlatform =
  | 'aix'
  | 'android'
  | 'cygwin'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'netbsd'
  | 'openbsd'
  | 'sunos'
  | 'win32';

export interface RuntimeVersions {
  readonly chrome: string;
  readonly electron: string;
  readonly node: string;
}

export interface BlueberryBridge {
  readonly platform: BlueberryPlatform;
  readonly versions: RuntimeVersions;
}

export const IPC_CHANNELS = Object.freeze({
  appInfo: 'app:info',
} as const);
