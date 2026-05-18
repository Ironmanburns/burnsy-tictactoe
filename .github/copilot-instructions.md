# GitHub Copilot Instructions for JB Tic Tac Toe

## Project Overview
**JB Tic Tac Toe** is a production-grade React single-page application implementing a 2-player Tic Tac Toe game with comprehensive testing, CI/CD pipelines, and cloud-native deployment capabilities.

---

## Tech Stack Summary

### Frontend
- **Framework**: React 18.3.1 (functional components with hooks)
- **Build Tool**: Vite 5.4.1 with @vitejs/plugin-react
- **Styling**: CSS with BEM methodology and CSS-in-JS variables
- **Package Manager**: npm 9+

### Testing
- **Unit Tests**: Vitest 1.0.0 with jsdom environment
- **Component Testing**: @testing-library/react 14.0.0
- **E2E Tests**: @playwright/test 1.38.0 (chromium browser)
- **Coverage**: @vitest/coverage-v8 1.6.1 (100% target on source code)

### Code Quality
- **Linter**: ESLint 8.57.0 with react plugin
- **Pre-commit**: Husky 8.0.3 + lint-staged 15.0.0
- **Security**: TruffleHog (secret detection), npm audit, Trivy (container scanning)
- **Static Analysis**: SonarQube integration ready

### DevOps & Deployment
- **Containerization**: Docker multi-stage build (node:20-alpine → nginx:stable-alpine)
- **Orchestration**: Kubernetes with native manifests (Deployment, Service)
- **CI/CD Platforms**: GitHub Actions (workflow_dispatch) + Harness.io (native steps)
- **Health Checks**: Kubernetes liveness/readiness probes configured

---

## Project Structure

```
jbtictactoe/
├── src/                          # Application source
│   ├── App.jsx                  # Main game component (100% tested)
│   ├── App.test.jsx             # Unit tests (22 tests)
│   ├── main.jsx                 # Entry point (excluded from coverage)
│   ├── setup.js                 # Test setup (@testing-library/jest-dom)
│   └── style.css                # Global styles (BEM naming)
├── tests/                        # E2E tests
│   └── app.spec.js              # Playwright browser tests (4 tests)
├── k8s/                          # Kubernetes manifests
│   ├── deployment.yaml          # Pod & container config
│   └── service.yaml             # Service definition
├── .harness/                     # Harness.io pipeline
│   ├── pipeline.yaml            # 2-stage CI/CD (Build + Deploy)
│   ├── service.yaml             # Service connector
│   └── environment.yaml         # Environment config
├── .github/workflows/            # GitHub Actions
│   └── ci-cd.yml                # Complete workflow (linting, testing, deploy)
├── .husky/                       # Git hooks
│   ├── pre-commit               # Runs lint-staged + tests + audit
│   └── commit-msg               # Conventional commits validation
├── Dockerfile                   # Multi-stage build
├── playwright.config.js         # E2E test config
├── vite.config.js              # Build & test config
├── .eslintrc.cjs               # ESLint rules
├── package.json                 # Dependencies & scripts
└── sonar-project.properties    # SonarQube config
```

---

## Naming Conventions

### JavaScript/JSX Files
- **Component files**: PascalCase (App.jsx)
- **Test files**: 
  - Unit tests: `Component.test.jsx`
  - E2E tests: `feature.spec.js`
- **Functions**: camelCase (calculateWinner, handleClick, resetGame)
- **Constants**: camelCase, prefixed descriptively (lines, moveSequence)
- **Hooks**: camelCase prefixed with 'use' (useState, useMemo, useCallback)

### CSS Classes
- **BEM Naming**: block__element--modifier
  - `.app-shell` - Main container
  - `.title-bar` - Header
  - `.board` - Game grid
  - `.square` - Individual cell
  - `.square--winning` - Filled winning square
  - `.status` - Game status display
  - `.instructions` - Help text

### Kubernetes/Docker
- **Image names**: `ghcr.io/OWNER/jbtictactoe:latest`
- **Deployment names**: `tictactoe-app`
- **Service names**: `tictactoe-service`
- **Labels**: `app: tictactoe-app`

### Git/CI
- **Branch pattern**: feature/*, bugfix/*, hotfix/* (via Conventional Commits)
- **Commit format**: `type(scope): description`
  - Types: feat, fix, docs, style, refactor, perf, test, chore, ci
  - Example: `feat(board): add keyboard navigation`

---

## Preferred Testing Patterns

### Unit Testing (Vitest + React Testing Library)

**File Structure**:
```javascript
// App.test.jsx
import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent, cleanup, within } from '@testing-library/react'
import App, { calculateWinner } from './App'

afterEach(() => cleanup())

describe('Module', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

**Key Patterns**:
- Use `describe()` for logical grouping
- Use `it()` for individual test cases
- Use `within(container)` for scoped queries
- Query by accessible role: `getAllByRole('button', { name: /Square/ })`
- Query by text content: `getByText('Winner: X')`
- Always clean up after tests with `afterEach(() => cleanup())`
- Use `fireEvent` for user interactions
- Test both positive and negative scenarios
- Test accessibility attributes (aria-label, disabled state)

**Example**:
```javascript
it('disables squares when they are already filled', () => {
  const { container } = render(<App />)
  const squares = within(container).getAllByRole('button', { name: /Square/ })
  
  fireEvent.click(squares[0])
  expect(squares[0]).toBeDisabled()
  expect(squares[0]).toHaveAttribute('aria-label', 'Square 1: X')
})
```

### E2E Testing (Playwright)

**File Structure**:
```javascript
// app.spec.js (ESM)
import { test, expect } from '@playwright/test'

test.describe('Game Workflow', () => {
  test('should play a complete game', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  })
})
```

**Key Patterns**:
- Use `test.describe()` for test suites
- Use `test()` for individual scenarios
- Use `page.goto()` for navigation
- Use `page.locator()` for element selection
- Use `expect()` for assertions
- Test complete user workflows
- Run with `npm run test:e2e` or `npm run test:e2e:headed`

### Coverage Requirements
- **Target**: 100% on source code (App.jsx)
- **Exclude**: Entry points (main.jsx), config files
- **Tools**: Vitest coverage with v8 engine
- **Command**: `npm run test -- --run --coverage`

### Pre-commit Hooks
Automatically run on commit:
1. ESLint formatting (via lint-staged)
2. Vitest unit tests (full suite)
3. TruffleHog secret detection
4. npm audit (moderate severity)
5. Conventional commits validation

---

## Code Style Guidelines

### React Components
- **Functional components only** - Use hooks (useState, useMemo, useCallback)
- **Memoization**: Use `useMemo` for expensive calculations, `useCallback` for stable function references
- **Accessibility**: Always include aria-labels, disabled states, keyboard support
- **JSX**: React 17+ syntax (no need for `import React`)

### Function Formatting
```javascript
// Preferred: useCallback for event handlers
const handleClick = useCallback((index) => {
  if (board[index] || winner) return
  // logic
}, [board, winner])

// Preferred: useMemo for derived state
const status = useMemo(() => {
  return winner ? `Winner: ${winner}` : 'Next player: X'
}, [winner])
```

### Error Handling
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)
- Validate user input before state updates

---

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5174)
npm run lint         # Check code quality
npm run test         # Watch mode unit tests
npm run test:e2e     # Run E2E tests (requires dev server)
npm run build        # Production build
```

### Before Committing
```bash
# Automatic via pre-commit hook:
git commit -m "feat(scope): description"
# Runs: lint, tests, security checks
```

### CI/CD Deployment
- **GitHub Actions**: Triggered by workflow_dispatch with runtime inputs
- **Harness.io**: Alternative native CI/CD with K8s rolling deployments
- **Pipeline Stages**: Lint → Test → Security Scan → Build → Deploy

---

## Security & Best Practices

### Security Scanning
- **SAST**: ESLint, npm audit, SonarQube
- **Secrets**: TruffleHog (pre-commit hook)
- **Dependencies**: npm audit --audit-level=moderate
- **Container**: Trivy (HIGH/CRITICAL only)
- **IaC**: Checkov (Kubernetes CIS benchmarks)

### Docker Security
- ✅ Non-root user (nginx:101)
- ✅ Read-only root filesystem
- ✅ Dropped all capabilities
- ✅ Multi-stage build (minimal final image)
- ✅ Cache headers configured

### Kubernetes Security
- ✅ Pod security context enforced
- ✅ Health checks (liveness & readiness)
- ✅ Resource limits (CPU 100m req/250m limit, Mem 128Mi req/256Mi limit)
- ✅ Non-root container user
- ✅ No privilege escalation allowed

---

## Common Tasks

### Adding a Feature
1. Create feature branch: `git checkout -b feature/my-feature`
2. Implement with tests: `npm run dev` + write tests
3. Run checks: `npm run lint && npm run test -- --run`
4. Commit: `git commit -m "feat(scope): description"`
5. Push and create PR

### Writing Tests
1. Add test case to appropriate `.test.jsx` or `.spec.js` file
2. Follow AAA pattern (Arrange, Act, Assert)
3. Query by accessible role/text (not class/ID)
4. Run: `npm run test:watch` for development
5. Coverage: `npm run test -- --run --coverage`

### Deploying
- **Local**: `npm run build && npm run preview`
- **Docker**: `docker build -t jbtictactoe:tag .`
- **K8s**: Push image → Update k8s/deployment.yaml → `kubectl apply`
- **Harness**: Configure connectors → trigger pipeline

---

## References
- [React 18 Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
