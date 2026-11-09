import type { CameraAdapter } from '../../platform/camera-adapter';
import { statusForUnsupported } from '../../platform/camera-adapter';
import { describeCameraStatus, initialCameraState } from '../../domain/camera-state';
import type { CameraState } from '../../domain/camera-state';
import { renderStatusLine } from '../../ui/status-line';

export function mountCaptureView(
  container: HTMLElement,
  camera: CameraAdapter,
): CameraState {
  const state: CameraState = {
    ...initialCameraState,
    status: statusForUnsupported(camera),
  };

  renderStatusLine(container, describeCameraStatus(state.status));
  return state;
}
