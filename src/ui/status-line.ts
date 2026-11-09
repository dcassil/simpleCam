export function renderStatusLine(container: HTMLElement, text: string): HTMLParagraphElement {
  const statusLine = document.createElement('p');
  statusLine.textContent = text;
  container.append(statusLine);
  return statusLine;
}
