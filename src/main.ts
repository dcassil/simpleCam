import './styles/global.css';
import { createApp } from './app/create-app';
import { createMediaDevicesCamera } from './platform/camera-adapter';
import { assertDefined } from './shared/assert';

const mount = assertDefined(document.querySelector<HTMLDivElement>('#app'), '#app root');
createApp({ mount, camera: createMediaDevicesCamera() });
