/**
 * Shore Guard preset blueprint: Vite Client-Side Webapp
 *
 * Status: TEMPORARY / PROPOSAL. Hand this to the agent maintaining the shore-guard
 * repo. It is written in the exact shape of `packages/policy/src/presets.ts`
 * (`version`, `metadata`, `modules.pathMappings`, `modules.allowedEdges`,
 * `modules.forbiddenEdges`, `rules`) so it can be dropped into the F2 catalog next to
 * `nodeApiPreset`, `reactNextVercelWebappPreset`, `supabaseApiPreset`, and
 * `supabaseNodeRagPreset`, and exported as `viteClientSideWebappPreset`.
 *
 * Origin: discovery on dcassil/simpleCam (greenfield: one source file, zero internal
 * import edges). None of the four existing presets matches a framework-free,
 * server-free Vite single-page app, so this blueprint translates their concepts:
 *
 *   Node API                  -> Vite client
 *   --------------------------------------------------------------------------
 *   application wiring        -> entry (src/main.ts) and app composition layer
 *   routes / handlers         -> features (user-facing capabilities, e.g. capture)
 *   services (domain logic)   -> domain (pure TypeScript, no DOM, no browser APIs)
 *   repositories / infra      -> platform (adapters over MediaDevices, Canvas,
 *                                 storage, File System Access, etc.)
 *   "core must not import the  -> "domain/ui/shared must not import platform";
 *    HTTP framework"              "runtime code must not import Vite or Node"
 *
 *   React Next Vercel Webapp  -> Vite client
 *   --------------------------------------------------------------------------
 *   feature public entry only -> same: src/features/<name>/index.ts is the only
 *                                 importable surface of a feature
 *   application !-> server-only -> runtime !-> node builtins / build tooling
 *
 *   Supabase Node RAG         -> Vite client
 *   --------------------------------------------------------------------------
 *   client !-> SDK directly   -> ui/domain !-> platform adapters directly; all
 *                                 browser-API access is funneled through platform
 *
 * Layer graph (arrows are the ONLY allowed import directions):
 *
 *   entry ──► app ──► features ──► domain ──► shared
 *     │        │         │  │
 *     │        │         │  └────► platform ──► domain, shared
 *     │        │         └───────► ui ──► shared
 *     │        └──► ui, platform, shared
 *     └──► styles, shared
 *
 * Module semantics:
 *   entry        src/main.ts. Bootstraps the app: imports global styles, mounts #app,
 *                instantiates platform adapters and hands them to app. No logic.
 *   app          src/app/**. Composition root: screens, navigation, wiring of
 *                features with platform adapters. Imports features only through
 *                their public entry.
 *   features     src/features/<name>/index.ts. Public entry of a vertical slice
 *                (e.g. capture, gallery, settings). Owns feature-local state.
 *   feature-internals  Everything inside a feature other than index.ts. Importable
 *                only from within the same feature. (Same mapping technique as the
 *                Next preset's `feature-internals`; see Open question 1.)
 *   ui           src/ui/**. Presentational DOM components and primitives. Receives
 *                data and callbacks; never touches browser device APIs, never
 *                imports features or platform.
 *   domain       src/domain/**. Pure, synchronous-or-async TypeScript: types,
 *                value objects, state machines, validation. No DOM, no window,
 *                no navigator. Must be unit-testable in Node.
 *   platform     src/platform/**. The ONLY place that calls browser platform APIs:
 *                navigator.mediaDevices, HTMLCanvasElement/OffscreenCanvas,
 *                localStorage/IndexedDB, File System Access, Permissions, Wake Lock.
 *                Exposes framework-neutral interfaces typed with domain types.
 *   shared       src/shared/**. Leaf utilities and cross-cutting types. Imports
 *                nothing internal.
 *   styles       src/styles/**. Global stylesheets. Imported only by entry.
 *   node-builtins  Package-name mapping (like `server-only` / `fastify` in the
 *                existing presets). Forbidden from all runtime modules because this
 *                is a browser-only bundle.
 *   build-tooling  `vite`, `vite/*`, `vitest`. Forbidden from runtime modules;
 *                belongs only in vite.config.ts and tests, which are outside src.
 *
 * Open questions for the shore-guard maintainer:
 *   1. `feature-internals` is matched by path pattern, so a feature importing its
 *      OWN internals also matches `features -> feature-internals`. The Next preset
 *      has the same ambiguity with `application`. If the resolver supports a
 *      "same-feature-directory" exemption, the rule
 *      `architecture.feature-cross-deep-imports` should use it; otherwise keep it at
 *      `warn` as proposed here until the resolver can tell intra-feature imports
 *      from cross-feature ones.
 *   2. "domain must not touch the DOM" is only partially expressible as an import
 *      rule (domain !-> platform/ui). Globals such as `window`, `document`, and
 *      `navigator` are not imports. A candidate quality rule kind such as
 *      `no-dom-globals` (scoped to src/domain/**) would close that gap. Not claimed
 *      here because the known rule kinds are import-boundary, dependency-edge,
 *      no-cycles, no-orphans, and no-transitive-dependency.
 *   3. Pattern syntax is copied from the existing presets (glob with `!(index)`).
 *      Please confirm that the two feature-internals patterns in pathMappings
 *      below (the "!(index)" negations under src/features) resolve the way the
 *      Next preset's feature-internals pattern does in the real matcher.
 */

const catalogDescription = (overview: string, avoid: string, layers: string): string =>
  `Overview: ${overview}\nWhen to avoid: ${avoid}\nLayers: ${layers}`;

export const viteClientSideWebappPreset = {
  version: 1,
  metadata: {
    id: 'shore.preset.vite-client-side-webapp',
    name: 'Vite Client-Side Webapp',
    description: catalogDescription(
      'A framework-free, server-free Vite single-page app with a pure domain core, feature slices behind public entries, and all browser platform APIs isolated in adapters.',
      'Avoid for apps with a backend or server rendering, for React or Next.js codebases, or for trivial static pages where layer separation adds no value.',
      'Entry bootstrap, app composition, feature slices, presentational UI, pure domain, platform adapters, shared leaf utilities, and global styles.',
    ),
    revision: '1.0.0',
  },
  modules: {
    pathMappings: {
      entry: ['src/main.ts'],
      app: ['src/app/**/*.ts'],
      features: ['src/features/*/index.ts'],
      'feature-internals': ['src/features/*/!(index).ts', 'src/features/*/!(index)/**/*.ts'],
      ui: ['src/ui/**/*.ts'],
      domain: ['src/domain/**/*.ts'],
      platform: ['src/platform/**/*.ts'],
      shared: ['src/shared/**/*.ts'],
      styles: ['src/styles/**/*.css'],
      'node-builtins': [
        'node:*',
        'fs',
        'path',
        'os',
        'child_process',
        'crypto',
        'http',
        'https',
        'net',
        'stream',
        'url',
        'util',
        'worker_threads',
      ],
      'build-tooling': ['vite', 'vite/*', 'vitest', 'vitest/*'],
    },
    allowedEdges: [
      { from: 'entry', to: 'app' },
      { from: 'entry', to: 'styles' },
      { from: 'entry', to: 'shared' },
      { from: 'entry', to: 'platform' },
      { from: 'app', to: 'features' },
      { from: 'app', to: 'ui' },
      { from: 'app', to: 'platform' },
      { from: 'app', to: 'shared' },
      { from: 'features', to: 'ui' },
      { from: 'features', to: 'domain' },
      { from: 'features', to: 'platform' },
      { from: 'features', to: 'shared' },
      { from: 'ui', to: 'shared' },
      { from: 'ui', to: 'domain' },
      { from: 'platform', to: 'domain' },
      { from: 'platform', to: 'shared' },
      { from: 'domain', to: 'shared' },
    ],
    forbiddenEdges: [
      // Feature public-entry boundary (translated from the Next preset).
      { from: 'app', to: 'feature-internals' },
      { from: 'entry', to: 'feature-internals' },
      { from: 'entry', to: 'features' },
      // No upward imports.
      { from: 'features', to: 'app' },
      { from: 'features', to: 'entry' },
      { from: 'ui', to: 'app' },
      { from: 'ui', to: 'features' },
      { from: 'ui', to: 'feature-internals' },
      { from: 'ui', to: 'platform' },
      { from: 'domain', to: 'app' },
      { from: 'domain', to: 'features' },
      { from: 'domain', to: 'feature-internals' },
      { from: 'domain', to: 'ui' },
      { from: 'domain', to: 'platform' },
      { from: 'platform', to: 'app' },
      { from: 'platform', to: 'features' },
      { from: 'platform', to: 'feature-internals' },
      { from: 'platform', to: 'ui' },
      { from: 'shared', to: 'app' },
      { from: 'shared', to: 'features' },
      { from: 'shared', to: 'feature-internals' },
      { from: 'shared', to: 'ui' },
      { from: 'shared', to: 'domain' },
      { from: 'shared', to: 'platform' },
      // Browser-only bundle: no Node builtins, no build tooling at runtime
      // (translated from "core must not import the HTTP framework").
      { from: 'entry', to: 'node-builtins' },
      { from: 'app', to: 'node-builtins' },
      { from: 'features', to: 'node-builtins' },
      { from: 'feature-internals', to: 'node-builtins' },
      { from: 'ui', to: 'node-builtins' },
      { from: 'domain', to: 'node-builtins' },
      { from: 'platform', to: 'node-builtins' },
      { from: 'shared', to: 'node-builtins' },
      { from: 'entry', to: 'build-tooling' },
      { from: 'app', to: 'build-tooling' },
      { from: 'features', to: 'build-tooling' },
      { from: 'feature-internals', to: 'build-tooling' },
      { from: 'ui', to: 'build-tooling' },
      { from: 'domain', to: 'build-tooling' },
      { from: 'platform', to: 'build-tooling' },
      { from: 'shared', to: 'build-tooling' },
    ],
  },
  rules: [
    {
      ruleId: 'architecture.app-feature-deep-imports',
      kind: 'import-boundary',
      scope: { paths: ['src/main.ts', 'src/app/**/*.ts'], modules: ['entry', 'app', 'feature-internals'] },
      severity: 'error',
      diagnostic: 'Entry or app code crosses the feature public-entry boundary with a deep feature import.',
      remediation: 'Export the dependency from the feature index and import that public entry instead.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.feature-cross-deep-imports',
      kind: 'import-boundary',
      scope: { paths: ['src/features/**/*.ts'], modules: ['features', 'feature-internals'] },
      severity: 'error',
      diagnostic: 'A feature reaches into the internals of another feature instead of its public entry.',
      remediation: 'Import the other feature through its index, or move the shared piece to domain, ui, or shared.',
      adoptionStage: 'warn',
    },
    {
      ruleId: 'architecture.domain-imports-browser-layers',
      kind: 'import-boundary',
      scope: { paths: ['src/domain/**/*.ts'], modules: ['domain', 'platform', 'ui', 'features', 'feature-internals', 'app'] },
      severity: 'error',
      diagnostic: 'Pure domain code crosses into a browser-facing layer, so it can no longer run or be tested outside the browser.',
      remediation: 'Keep domain free of platform, ui, feature, and app imports; pass browser results in as plain domain values.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.ui-imports-platform-or-features',
      kind: 'import-boundary',
      scope: { paths: ['src/ui/**/*.ts'], modules: ['ui', 'platform', 'features', 'feature-internals', 'app'] },
      severity: 'error',
      diagnostic: 'Presentational UI crosses the adapter boundary by importing platform, feature, or app code.',
      remediation: 'Receive data and callbacks as parameters; let the feature or app layer own platform access.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.platform-imports-upward',
      kind: 'import-boundary',
      scope: { paths: ['src/platform/**/*.ts'], modules: ['platform', 'app', 'features', 'feature-internals', 'ui'] },
      severity: 'error',
      diagnostic: 'A platform adapter imports app, feature, or ui code, inverting the dependency direction.',
      remediation: 'Expose a framework-neutral interface from the adapter and let higher layers call it.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.shared-imports-internal',
      kind: 'import-boundary',
      scope: { paths: ['src/shared/**/*.ts'], modules: ['shared', 'app', 'features', 'feature-internals', 'ui', 'domain', 'platform'] },
      severity: 'error',
      diagnostic: 'A shared leaf utility imports another internal layer, so it is no longer a leaf.',
      remediation: 'Move the code into the layer it depends on, or remove the dependency.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.runtime-imports-node-builtins',
      kind: 'import-boundary',
      scope: { paths: ['src/**/*.ts'], modules: ['entry', 'app', 'features', 'feature-internals', 'ui', 'domain', 'platform', 'shared', 'node-builtins'] },
      severity: 'error',
      diagnostic: 'Browser runtime code imports a Node.js builtin that does not exist in the client bundle.',
      remediation: 'Use a Web API equivalent or a platform adapter; Node builtins belong only in config and tooling.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.runtime-imports-build-tooling',
      kind: 'import-boundary',
      scope: { paths: ['src/**/*.ts'], modules: ['entry', 'app', 'features', 'feature-internals', 'ui', 'domain', 'platform', 'shared', 'build-tooling'] },
      severity: 'error',
      diagnostic: 'Runtime code imports the bundler or test runner package.',
      remediation: 'Keep Vite and Vitest imports in vite.config.ts and test files outside src.',
      adoptionStage: 'enforce',
    },
    {
      ruleId: 'architecture.feature-cycles',
      kind: 'no-cycles',
      scope: { paths: ['src/features/**/*.ts', 'src/domain/**/*.ts', 'src/platform/**/*.ts'] },
      severity: 'error',
      diagnostic: 'An import cycle exists between feature, domain, or platform modules.',
      remediation: 'Break the cycle by extracting the shared piece into domain or shared, or by inverting one dependency through an interface.',
      adoptionStage: 'warn',
    },
    {
      ruleId: 'architecture.orphan-modules',
      kind: 'no-orphans',
      scope: { paths: ['src/**/*.ts'] },
      severity: 'warning',
      diagnostic: 'A source module is not reachable from src/main.ts.',
      remediation: 'Wire the module into a feature or app, or delete it.',
      adoptionStage: 'observe',
    },
  ],
} as const;
