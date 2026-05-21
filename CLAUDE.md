# CLAUDE.md — Burnsy Tic Tac Toe

Guidance for AI assistants working in this repository.

## Project Overview

A production-grade React Tic Tac Toe SPA built with Vite. Despite its small scope, the project enforces enterprise-level quality: 100% unit test coverage, E2E browser tests, lint-staged pre-commit hooks, Conventional Commits, Docker containerization, Kubernetes manifests, and dual CI/CD pipelines (GitHub Actions + Harness.io).

**Package name**: `jbtictactoe` | **React**: 18.3.1 | **Build tool**: Vite 5.4.1

---

## Repository Structure

```
/
├── src/
│   ├── App.jsx           # Game component (only source file)
│   ├── App.test.jsx      # 22 unit tests (Vitest + React Testing Library)
│   ├── main.jsx          # Entry point — excluded from coverage
│   ├── setup.js          # @testing-library/jest-dom import
│   └── style.css         # Global styles (~167 lines, glassmorphism design)
├── tests/
│   └── app.spec.js       # 4 Playwright E2E tests
├── k8s/
│   ├── deployment.yaml   # Kubernetes Deployment (hardened)
│   └── service.yaml      # Kubernetes ClusterIP Service
├── .harness/             # Harness.io CI/CD pipeline definitions
├── .github/
│   ├── workflows/
│   │   ├── ci-cd.yml              # Full lint/test/build/docker/deploy pipeline
│   │   ├── claude.yml             # Claude AI PR/issue assistant (@claude mentions)
│   │   └── claude-code-review.yml # Auto code-review on PRs
│   ├── PLAN.md           # Step-by-step project build guide
│   ├── AGENTS.md         # GitHub Copilot agent definitions
│   └── copilot-instructions.md
├── .husky/
│   ├── pre-commit        # lint-staged + full test run + npm audit
│   └── commit-msg        # Enforces Conventional Commits format
├── Dockerfile            # Multi-stage: node:20-alpine → nginx:stable-alpine
├── vite.config.js        # Vite + Vitest configuration
├── playwright.config.js  # Playwright E2E configuration
├── .eslintrc.cjs         # ESLint (react plugin, no console in prod)
└── sonar-project.properties  # SonarQube integration config
```

---

## Development Commands

```bash
npm run dev              # Vite dev server at http://127.0.0.1:5173
npm run build            # Production bundle → dist/
npm run preview          # Preview production build locally
npm run lint             # ESLint on src/**/*.{js,jsx}
npm run test             # Vitest unit tests (watch mode in TTY; use `npm run test -- --run` for a single run)
npm run test:watch       # Vitest in explicit watch mode
npm run test:e2e         # Playwright E2E (headless Chromium)
npm run test:e2e:headed  # Playwright E2E (visible browser)
```

The Playwright config auto-starts the dev server (`npm run dev`) before E2E tests run — do not start it manually.

---

## Architecture & Key Conventions

### React component (`src/App.jsx`)

- Single functional component with hooks only (`useState`, `useMemo`, `useCallback`)
- All game state lives in `App`: `board` (Array of 9), `xIsNext` (boolean)
- `calculateWinner(board)` returns `{ player, line }` or `null` — never mutate its return value
- Winner calculation and status text are memoized; keep expensive derivations in `useMemo`
- Use `useCallback` for event handlers passed to child elements
- Do not introduce class components, context, or external state libraries

### Styling (`src/style.css`)

- BEM naming: `block`, `block--modifier` (e.g., `square`, `square--winning`)
- Glassmorphism theme: dark gradient background, `backdrop-filter: blur`, `rgba` transparency
- Responsive breakpoint at 520 px
- No CSS-in-JS or CSS modules — plain CSS only

### Accessibility requirements

Every interactive element must have:
- `aria-label` describing its purpose **only if it lacks descriptive visible text** (e.g., icon-only buttons); buttons with clear visible labels like "Reset" do not need one
- `aria-pressed` for toggle-style buttons
- Keyboard handler for `Enter` and `Space` (not just `onClick`)
- Correct `disabled` attribute when the action is unavailable

---

## Testing Standards

### Unit tests (Vitest)

- **File**: `src/App.test.jsx` — keep tests co-located with source
- **Coverage target**: 100% of `src/App.jsx`; `src/main.jsx` is excluded
- Use React Testing Library queries in this priority order: `getByRole` > `getByText` > `getAllByRole`
- Use `fireEvent` for interactions; avoid `userEvent` (not installed)
- Always call `cleanup()` in `afterEach`
- Test both the `calculateWinner` function directly and the rendered component behavior
- New game logic branches require both a direct function test and a component integration test

### E2E tests (Playwright)

- **File**: `tests/app.spec.js` — Chromium only
- Tests must pass with the dev server auto-started by Playwright config
- Base URL is `http://127.0.0.1:5173` — do not change it

### Running tests before committing

The pre-commit hook runs the full unit test suite automatically. If tests fail, the commit is blocked. Fix tests before attempting another commit.

---

## Commit Message Convention

All commits **must** follow Conventional Commits or the `commit-msg` hook will reject them:

```
<type>(<optional scope>): <description>

Types: feat | fix | docs | style | refactor | perf | test | chore | ci
```

Examples:
```
feat: add draw-detection logic
fix(board): prevent click after game over
test: add keyboard navigation coverage
chore: update playwright to 1.40
```

---

## CI/CD Pipeline

### GitHub Actions (`ci-cd.yml`)

Triggered manually (`workflow_dispatch`) with inputs for environment, image tag, and deploy target.

**Job: lint-build-scan** (always runs):
1. `npm ci`
2. `npm run lint`
3. `npm audit --audit-level=high` (blocking in CI)
4. `npm run test -- --run`
5. Playwright E2E tests
6. `npm run build`
7. Docker image build (optionally pushed to GHCR)
8. Trivy vulnerability scan

**Job: deploy** (conditional on `deploy=yes` input):
- Installs `kubectl`, configures kubeconfig, applies `k8s/` manifests, waits for rollout

### Required secrets (GitHub)
- `REGISTRY_USERNAME` / `REGISTRY_PASSWORD` — container registry
- `KUBE_CONFIG_DATA` — base64-encoded kubeconfig
- `CLAUDE_CODE_OAUTH_TOKEN` — Claude PR assistant

### Claude AI workflows
- `@claude` in a PR comment or issue triggers `claude.yml` using the `CLAUDE_CODE_OAUTH_TOKEN` secret
- PRs automatically receive a code review from `claude-code-review.yml` on open/sync/reopen

---

## Docker & Kubernetes

**Dockerfile** uses a two-stage build:
1. `node:20-alpine` — install deps and `vite build`
2. `nginx:stable-alpine` — serve `dist/` as static files

Default image name: `ghcr.io/OWNER/jbtictactoe` (OWNER resolved at workflow runtime)

**k8s/deployment.yaml** enforces security hardening:
- Non-root user
- Read-only root filesystem
- Dropped capabilities

When modifying Kubernetes manifests, preserve all security context fields.

---

## Code Quality Gates

All of the following must pass before a change is mergeable:

| Gate | Command | Blocks |
|------|---------|--------|
| ESLint | `npm run lint` | Pre-commit, CI |
| Unit tests (100% coverage) | `npm run test` | Pre-commit, CI |
| npm audit | Pre-commit: `--audit-level=moderate --production` (non-blocking) / CI: `--audit-level=high` (blocking) | CI |
| E2E tests | `npm run test:e2e` | CI |
| Docker build | CI only | CI |
| Trivy scan | CI only | CI |

`no-console` is enforced by ESLint — remove any `console.*` calls before committing.

---

## What Not To Do

- Do not add dependencies without a clear reason — the stack is intentionally minimal
- Do not introduce class components, Redux, or Context API
- Do not skip or weaken pre-commit hooks (`--no-verify`)
- Do not change `src/main.jsx` unless modifying the React entry point; it is intentionally excluded from coverage
- Do not hardcode ports or URLs outside `playwright.config.js` and `vite.config.js`
- Do not add `console.log` — ESLint will reject it
- Do not modify Kubernetes security contexts without explicit instructions
