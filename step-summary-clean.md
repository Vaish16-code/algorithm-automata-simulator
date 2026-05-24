## AI Guard — Async Reliability Report

> **Preset:** `recommended` &nbsp;|&nbsp; **Mode:** Changed files only
> **Files scanned:** 1 (1 changed)
> **Duration:** 3075ms

### ℹ️ Informational hints only

| Category | 🔴 High | 🟡 Medium | 🔵 Low | ⬜ Info |
|----------|---------|----------|-------|--------|
| Async Stability | 0 | 0 | 0 | 3 |

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
- Run `ai-guard run --verbose` to expand informational hints
- Run `ai-guard baseline` to suppress known issues and track only new ones

*Powered by [eslint-plugin-ai-guard](https://github.com/YashJadhav21/eslint-plugin-ai-guard)*
