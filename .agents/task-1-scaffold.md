You are scaffolding a brand-new, minimal client-side web app in the CURRENT directory (/Users/danielcassil/Code/simpleCam). The directory is empty except for .git and .agents. Project name: simplecam.

Create EXACTLY these files, hand-written (do NOT run `npm create vite`, do NOT run npm install, do NOT run git, do NOT run any build/typecheck). Write files only.

1. package.json
   - "name": "simplecam", "private": true, "version": "0.0.0", "type": "module"
   - scripts: "dev": "vite", "build": "tsc --noEmit && vite build", "preview": "vite preview", "typecheck": "tsc --noEmit"
   - devDependencies: "typescript": "~5.9.3", "vite": "^7.1.0"
   - no dependencies, no framework (vanilla TS).

2. tsconfig.json — strict vanilla-TS Vite config:
   target ES2022, lib ["ES2022","DOM","DOM.Iterable"], module ESNext, moduleResolution "bundler", skipLibCheck true, allowImportingTsExtensions true, verbatimModuleSyntax true, moduleDetection "force", noEmit true, strict true, noUnusedLocals true, noUnusedParameters true, noFallthroughCasesInSwitch true, noUncheckedSideEffectImports true, useDefineForClassFields true, isolatedModules true. include: ["src", "vite.config.ts"]. types: ["vite/client"].

3. vite.config.ts — `import { defineConfig } from 'vite'; export default defineConfig({});`

4. index.html — HTML5 doc, lang="en", UTF-8 meta, viewport meta, <title>simpleCam</title>, body contains `<div id="app"></div>` and `<script type="module" src="/src/main.ts"></script>`.

5. src/main.ts — imports './style.css'; queries `#app` with `document.querySelector<HTMLDivElement>('#app')`; if null, throw new Error('#app root not found'); otherwise sets innerHTML to a single `<main>` containing an `<h1>simpleCam</h1>`. Keep it tiny. No `any`, no non-null assertions.

6. src/style.css — minimal reset: `*, *::before, *::after { box-sizing: border-box; }`, body margin 0, min-height 100dvh, system-ui font stack, `color-scheme: light dark`. Nothing fancy.

7. src/vite-env.d.ts — `/// <reference types="vite/client" />`

8. .gitignore — node_modules, dist, dist-ssr, *.local, .DS_Store, .vscode/* except extensions.json, .idea, *.log

9. README.md — title "simpleCam", one sentence (small client-side web app built with Vite + TypeScript), and the three commands: npm install, npm run dev, npm run build.

When done, print the list of files you created and stop.
