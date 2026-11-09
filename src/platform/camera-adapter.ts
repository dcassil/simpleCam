import type { CameraStatus } from '../domain/camera-state';

export interface CameraAdapter {
  readonly isSupported: () => boolean;
  readonly requestStream: () => Promise<MediaStream>;
}

export function createMediaDevicesCamera(): CameraAdapter {
  return {
    isSupported: () =>
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices !== undefined &&
      typeof navigator.mediaDevices.getUserMedia === 'function',
    requestStream: () =>
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }),
  };
}

export function statusForUnsupported(adapter: CameraAdapter): CameraStatus {
  return adapter.isSupported() ? 'idle' : 'unavailable';
}
