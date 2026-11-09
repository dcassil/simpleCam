export interface AppShell {
  readonly root: HTMLElement;
  readonly content: HTMLElement;
}

export function renderAppShell(mount: HTMLElement, title: string): AppShell {
  const root = document.createElement('main');
  const heading = document.createElement('h1');
  const content = document.createElement('section');

  heading.textContent = title;
  root.append(heading, content);
  mount.replaceChildren(root);

  return { root, content };
}
