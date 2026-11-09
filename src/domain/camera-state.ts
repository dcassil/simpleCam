export type CameraStatus = 'idle' | 'requesting' | 'streaming' | 'denied' | 'unavailable';

export interface CameraState {
  readonly status: CameraStatus;
  readonly errorMessage: string | null;
}

export const initialCameraState: CameraState = {
  status: 'idle',
  errorMessage: null,
};

export function describeCameraStatus(status: CameraStatus): string {
  switch (status) {
    case 'idle':
      return 'Camera not started';
    case 'requesting':
      return 'Requesting camera access';
    case 'streaming':
      return 'Camera is streaming';
    case 'denied':
      return 'Camera access denied';
    case 'unavailable':
      return 'Camera unavailable';
  }
}
