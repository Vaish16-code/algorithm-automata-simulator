## AI Guard — Async Reliability Report

> **Preset:** `recommended` &nbsp;|&nbsp; **Mode:** Changed files only
> **Files scanned:** 2 (2 changed)
> **Duration:** 2706ms

### ⚠️ 2 high-confidence issues found

| Category | 🔴 High | 🟡 Medium | 🔵 Low | ⬜ Info |
|----------|---------|----------|-------|--------|
| Async Stability | 1 | 0 | 0 | 3 |
| Reliability | 1 | 0 | 0 | 0 |

### Top Findings

| File | Line | Rule | Confidence |
|------|------|------|------------|
| `ai-guard-ci/ci-high-confidence.ts` | 2 | `no-floating-promise` | 🔴 High |
| `ai-guard-ci/ci-high-confidence.ts` | 6 | `no-empty-catch` | 🔴 High |

<details>
<summary>💡 3 informational hints (click to expand)</summary>

These are stylistic hints with higher false-positive rates in frameworks like Next.js and React. Review manually before acting.

| File | Line | Rule |
|------|------|------|
| `ai-guard-ci/ci-signals.ts` | 12 | `no-async-without-await` |
| `ai-guard-ci/ci-signals.ts` | 19 | `no-async-without-await` |
| `ai-guard-ci/ci-signals.ts` | 26 | `no-async-without-await` |
</details>

---

**Next steps:**
- Review high/medium confidence findings in the **Files changed** tab
- Run `ai-guard run --verbose` locally to see full details
- Run `ai-guard run --verbose` to expand informational hints
- Run `ai-guard baseline` to suppress known issues and track only new ones

*Powered by [eslint-plugin-ai-guard](https://github.com/YashJadhav21/eslint-plugin-ai-guard)*
