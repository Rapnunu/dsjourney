# Contributing to DSJourney

Branch workflow, commits, pull requests, and what never goes into Git.

---

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready releases |
| `feature/*` | Individual feature work |

Do **not** commit directly to `main` during normal feature work.

---

## Starting work

```powershell
git checkout main
git pull origin main
git checkout -b feature/descriptive-feature-name
```

Use a short, descriptive branch name (for example `feature/roadmap-persistence`, `feature/auth-polish`).

---

## Before you commit

```powershell
npm run lint
npm run typecheck
npm run build
git status
```

Fix lint, type, and build failures before committing. Review `git status` so only intended files are staged.

---

## Commit workflow

```powershell
git add <paths>
git status
git commit -m "type: concise description"
```

### Commit prefixes

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature or user-visible capability |
| `fix:` | Bug fix |
| `refactor:` | Code change without new behavior |
| `test:` | Tests only |
| `docs:` | Documentation only |
| `chore:` | Tooling, config, housekeeping |
| `style:` | UI polish without logic changes |

Write the subject in imperative mood and focus on **why** the change matters when helpful.

---

## Push and pull requests

**First push** on a new branch:

```powershell
git push -u origin feature/descriptive-feature-name
```

Open a **pull request into `main`** when the feature is ready.

### Review checklist

- Changed files match the PR description
- `npm run lint`, `npm run typecheck`, and `npm run build` pass
- No secrets in the diff (`.env`, keys, passwords)
- Shared data flow still works (sessions, roadmap, dependent pages)

---

## Staying updated

If `main` moved while you were working:

```powershell
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
```

Resolve merge conflicts carefully, then re-run checks before pushing.

---

## Never commit

| Item | Notes |
|------|--------|
| `.env` | Local secrets |
| `.env.local` | Local secrets (copy from `.env.example`) |
| `node_modules/` | Install with `npm install` |
| `.next/` | Next.js build output |
| Credentials | API keys, database passwords, tokens |

`.gitignore` excludes many of these, but **always run `git status` before every commit**.

---

## Local development notes

- Copy `.env.example` → `.env.local` and fill in Neon credentials.
- Stop `npm run dev` before `npm run build` if you need a production build check locally.
- Agent working rules for this repo live in `AGENTS.md`.
