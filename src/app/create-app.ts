import type { CameraAdapter } from '../platform/camera-adapter';
import { renderAppShell } from '../ui/app-shell';
import { mountCaptureView } from '../features/capture';

export interface AppDependencies {
  readonly mount: HTMLElement;
  readonly camera: CameraAdapter;
}

export function createApp({ mount, camera }: AppDependencies): void {
  const shell = renderAppShell(mount, 'simpleCam');
  mountCaptureView(shell.content, camera);
}
