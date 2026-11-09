import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app === null) {
  throw new Error('#app root not found');
}

app.innerHTML = '<main><h1>simpleCam</h1></main>';
