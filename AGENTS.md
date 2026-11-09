<!-- shore-guard:lint-type-guardrail:start -->
## Shore Guard Lint and Type Rule Guardrail

You MUST NOT loosen lint, type-checking, or Shore Guard rules to make errors go away. Fix the code, not the rule.

This applies to (non-exhaustive):

- Editing `eslint.config.*` to disable, downgrade, or scope-narrow a rule.
- Editing `tsconfig.json` to disable strictness flags (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`, `useUnknownInCatchVariables`).
- Adding `// eslint-disable*`, `// @ts-ignore`, `// @ts-expect-error`, or `// @ts-nocheck`.
- Introducing `any`, `as any`, or non-null assertions (`!`) to silence errors.
- Setting `eslint.ignoreDuringBuilds` or `typescript.ignoreBuildErrors` in framework configs.
- Adding paths to `ignores` or `exclude` to skip linting or typechecking.

If a rule appears wrong for one case, STOP and obtain explicit human approval for that exact change. Approval does not generalize. Reporting the error and asking is acceptable; silently weakening a rule is not.
<!-- shore-guard:lint-type-guardrail:end -->
