Restructure the src/ folder of this Vite + vanilla TypeScript app (/Users/danielcassil/Code/simpleCam) into the layered layout below. Write files only. Do NOT run git, npm install, tsc, or vite. tsconfig is strict with noUnusedLocals, noUnusedParameters, verbatimModuleSyntax (use `import type` for type-only imports), and noUncheckedSideEffectImports. No `any`, no non-null assertions, no eslint-disable, no ts-ignore.

Import direction is STRICT and downward only:
  entry(src/main.ts) -> app, styles, platform, shared
  app -> features (ONLY via src/features/<name>/index.ts), ui, platform, shared
  features -> ui, domain, platform, shared
  ui -> domain, shared
  platform -> domain, shared
  domain -> shared
  shared -> nothing internal
Nothing may import upward. domain/ must not reference window, document, or navigator. Only platform/ may call browser device APIs. Do not start the camera or request permissions anywhere; the page stays a blank placeholder.

Files:

1. DELETE src/style.css. CREATE src/styles/global.css with the same content it had:
   `*, *::before, *::after { box-sizing: border-box; }` then body { margin: 0; min-height: 100dvh; font-family: system-ui, sans-serif; color-scheme: light dark; }

2. src/shared/assert.ts
   export function assertDefined<T>(value: T | null | undefined, label: string): T — throws new Error(`${label} is not defined`) when null/undefined, else returns value.

3. src/domain/camera-state.ts  (pure, no DOM types used)
   export type CameraStatus = 'idle' | 'requesting' | 'streaming' | 'denied' | 'unavailable';
   export interface CameraState { readonly status: CameraStatus; readonly errorMessage: string | null; }
   export const initialCameraState: CameraState = { status: 'idle', errorMessage: null };
   export function describeCameraStatus(status: CameraStatus): string — returns short human text per status (e.g. 'Camera not started' for idle).

4. src/platform/camera-adapter.ts
   import type { CameraStatus } from '../domain/camera-state';
   export interface CameraAdapter { readonly isSupported: () => boolean; readonly requestStream: () => Promise<MediaStream>; }
   export function createMediaDevicesCamera(): CameraAdapter — isSupported returns typeof navigator !== 'undefined' && navigator.mediaDevices !== undefined && typeof navigator.mediaDevices.getUserMedia === 'function'; requestStream calls navigator.mediaDevices.getUserMedia({ video: true, audio: false }). Also export function statusForUnsupported(adapter: CameraAdapter): CameraStatus — returns 'unavailable' if !adapter.isSupported(), else 'idle'.
   (Do not CALL requestStream anywhere in this task.)

5. src/ui/app-shell.ts
   export interface AppShell { readonly root: HTMLElement; readonly content: HTMLElement; }
   export function renderAppShell(mount: HTMLElement, title: string): AppShell — clears mount, appends a <main> containing <h1>{title}</h1> and an empty <section> (the content area). Use DOM APIs (createElement/textContent), not innerHTML.

6. src/ui/status-line.ts
   export function renderStatusLine(container: HTMLElement, text: string): HTMLParagraphElement — creates a <p> with the text, appends it to container, returns it.

7. src/features/capture/capture-view.ts  (feature-internal)
   import type { CameraAdapter } from '../../platform/camera-adapter';
   import { statusForUnsupported } from '../../platform/camera-adapter';
   import { describeCameraStatus, initialCameraState } from '../../domain/camera-state';
   import type { CameraState } from '../../domain/camera-state';
   import { renderStatusLine } from '../../ui/status-line';
   export function mountCaptureView(container: HTMLElement, camera: CameraAdapter): CameraState — computes state = { ...initialCameraState, status: statusForUnsupported(camera) }, renders a status line with describeCameraStatus(state.status), returns state.

8. src/features/capture/index.ts  (public entry) — `export { mountCaptureView } from './capture-view';`

9. src/app/create-app.ts
   import type { CameraAdapter } from '../platform/camera-adapter';
   import { renderAppShell } from '../ui/app-shell';
   import { mountCaptureView } from '../features/capture';
   export interface AppDependencies { readonly mount: HTMLElement; readonly camera: CameraAdapter; }
   export function createApp({ mount, camera }: AppDependencies): void — shell = renderAppShell(mount, 'simpleCam'); mountCaptureView(shell.content, camera).

10. src/main.ts (overwrite)
   import './styles/global.css';
   import { createApp } from './app/create-app';
   import { createMediaDevicesCamera } from './platform/camera-adapter';
   import { assertDefined } from './shared/assert';
   const mount = assertDefined(document.querySelector<HTMLDivElement>('#app'), '#app root');
   createApp({ mount, camera: createMediaDevicesCamera() });

Keep src/vite-env.d.ts unchanged. Single quotes, semicolons, 2-space indent. When done, print the list of files created/deleted and stop.
