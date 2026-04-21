# Git Workflow

## Branches

- `main` — production, always deployable
- `feat/<short-description>` — new feature
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — dependency updates, config, tooling
- `refactor/<short-description>` — code restructuring without behaviour change

Branch names are lowercase, hyphen-separated. Keep them short and descriptive.

## Commits

Follow Conventional Commits:

```
<type>(<scope>): <short imperative summary>

[optional body — the WHY, not the what]
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`, `perf`

Rules:
- Subject line ≤ 72 characters, no trailing period
- Use the imperative mood: "add button" not "added button"
- If a commit needs explanation, put it in the body — not a comment in code
- One logical change per commit — don't bundle unrelated changes
- Never commit commented-out code, `console.log`, or debug artifacts

## Pull Requests

- PRs should be small and focused — one feature or fix per PR
- Write a description that explains *why*, not just what changed
- Self-review the diff before requesting review
- All CI checks (lint, type-check, tests) must pass before merge
- Squash-merge feature branches into main to keep history linear

## What Never Goes in a Commit

- `.env` files or any secrets
- `node_modules/`
- Build artifacts (`dist/`)
- IDE-specific files not already in `.gitignore`
