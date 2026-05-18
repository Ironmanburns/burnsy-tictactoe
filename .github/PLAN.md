# PLAN.md - JB Tic Tac Toe Full Build & Implementation Guide

This document provides a complete, step-by-step guide to replicate the JB Tic Tac Toe project from scratch. Use this to recreate the full build in another environment or with a different Copilot model.

---

## Table of Contents
1. [Project Overview & Goals](#project-overview--goals)
2. [Phase 1: Project Setup](#phase-1-project-setup)
3. [Phase 2: Core Application](#phase-2-core-application)
4. [Phase 3: Comprehensive Testing](#phase-3-comprehensive-testing)
5. [Phase 4: Code Quality & Accessibility](#phase-4-code-quality--accessibility)
6. [Phase 5: CI/CD Pipeline](#phase-5-cicd-pipeline)
7. [Phase 6: Containerization & Deployment](#phase-6-containerization--deployment)
8. [Phase 7: Documentation & Agents](#phase-7-documentation--agents)
9. [Validation Checklist](#validation-checklist)
10. [Common Issues & Solutions](#common-issues--solutions)

---

## Project Overview & Goals

### Mission
Create a **production-grade React Tic Tac Toe game** with:
- ✅ 100% test coverage
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Docker containerization
- ✅ Kubernetes deployment
- ✅ Dual CI/CD systems (GitHub Actions + Harness.io)
- ✅ Security-first approach (9 scanning tools)
- ✅ Pre-commit validation hooks
- ✅ Professional documentation

### Tech Stack Decision Matrix
| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | React 18 | Hooks-based, modern, production-ready |
| Build | Vite 5.4 | Fast, zero-config, native ES modules |
| Testing | Vitest 1.0 | Unit tests, jsdom environment, coverage |
| E2E | Playwright 1.38 | Browser automation, chromium, reliability |
| Linting | ESLint 8.57 | Code quality, React plugin, customizable |
| Pre-commit | Husky 8.0 | Git hooks, lint-staged, test execution |
| Container | Docker | Multi-stage, nginx, security hardened |
| Orchestration | Kubernetes | Manifests, health checks, security context |
| CI/CD | GitHub + Harness | Dual pipelines, native steps, flexibility |

---

## Phase 1: Project Setup

### Step 1.1: Initialize Vite React Project
```bash
npm create vite@latest jbtictactoe -- --template react
cd jbtictactoe
npm install
```

### Step 1.2: Install Core Dependencies
```bash
npm install react@18.3.1 react-dom@18.3.1
```

### Step 1.3: Install Development Dependencies
```bash
# Testing
npm install --save-dev vitest@1.0.0 jsdom@23.0.0
npm install --save-dev @testing-library/react@14.0.0
npm install --save-dev @testing-library/jest-dom@6.0.0
npm install --save-dev @playwright/test@1.38.0
npm install --save-dev @vitest/coverage-v8@1.6.1

# Build & DevOps
npm install --save-dev vite@5.4.1
npm install --save-dev @vitejs/plugin-react@4.3.1

# Code Quality
npm install --save-dev eslint@8.57.0
npm install --save-dev eslint-plugin-react@7.34.0

# Pre-commit & Git Hooks
npm install --save-dev husky@8.0.3
npm install --save-dev lint-staged@15.0.0
```

### Step 1.4: Initialize Git & Husky
```bash
git init
npm run prepare  # Installs husky hooks

# Verify .husky directory was created
ls -la .husky/
```

### Step 1.5: Create Project Structure
```bash
# Already exists from Vite
# src/
# ├── App.jsx
# ├── main.jsx
# └── style.css

# Create test directories
mkdir -p tests
```

---

## Phase 2: Core Application

### Step 2.1: Create Game Logic in App.jsx

**File: src/App.jsx**
- Implement `calculateWinner(board)` function
- Export for testing
- Return `{ player: 'X'|'O', line: [0,1,2,...] }` or `null`
- Support all 8 winning combinations (3 horizontal, 3 vertical, 2 diagonal)

**Key Features:**
```javascript
- useState for board and xIsNext
- useMemo for calculateWinner and status
- useCallback for event handlers (handleClick, handleKeyDown, resetGame)
- Keyboard navigation (Enter, Space keys)
- Aria attributes for accessibility
```

**Component Structure:**
```
App.jsx
├── calculateWinner() - Pure function, exported
├── App() - Functional component
│   ├── State: board, xIsNext
│   ├── Derived: winner, winningLine, status
│   ├── Handlers: handleClick, handleKeyDown, resetGame
│   └── JSX with:
│       ├── Title bar with game title and reset button
│       ├── Status display (prominent, accessible)
│       ├── 3x3 game board with individual square buttons
│       └── Instructions text
└── Exports: calculateWinner, App (default)
```

### Step 2.2: Style Application with CSS

**File: src/style.css**

**Key Styling Elements:**
- Root variables for colors and fonts
- Body background with gradients and animation
- App shell with glassmorphism effect
- Title bar (h1 + reset button)
- Status area (now prominent with glow effect)
- 3x3 board grid with gap spacing
- Individual square buttons with hover states
- Winning square highlighting with gradient
- Responsive design with media queries

**BEM Classes:**
```
.app-shell
.title-bar
.title-bar h1
.title-bar button
.status
.board
.square
.square:hover
.square--winning
.instructions
```

**Critical Style Updates:**
```css
.status {
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 900;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
  background: linear-gradient(...);
  border: 2px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 0 28px rgba(0, 229, 255, 0.25);
}
```

---

## Phase 3: Comprehensive Testing

### Step 3.1: Configure Vitest

**File: vite.config.js**
```javascript
test: {
  environment: 'jsdom',
  exclude: ['tests/**', 'node_modules/**'],
  globals: true,
  setupFiles: ['./src/setup.js'],
  coverage: {
    exclude: ['src/main.jsx', 'node_modules/', 'tests/'],
  },
}
```

**File: src/setup.js**
```javascript
import '@testing-library/jest-dom'
```

### Step 3.2: Write Unit Tests (22 total)

**File: src/App.test.jsx**

**Test Groups:**

1. **calculateWinner Tests (8):**
   - Empty board returns null
   - Horizontal wins (top, middle, bottom rows)
   - Vertical wins (left, center, right columns)
   - Diagonal wins (both diagonals)
   - Draw (full board, no winner)

2. **App Component Tests (14):**
   - Initial rendering and player alternation
   - Winner detection and message
   - Reset functionality
   - Blocked clicks on filled squares
   - Blocked clicks after winner
   - Draw state detection
   - Winning square highlighting
   - Reset removes highlighting
   - Disabled state on filled squares
   - Disabled state when winner declared
   - Keyboard navigation (Enter key)
   - Keyboard navigation (Space key)
   - Aria-labels on squares
   - Aria-label updates when filled

**Test Pattern (AAA):**
```javascript
it('test description', () => {
  // Arrange: Setup component
  const { container } = render(<App />)
  const squares = within(container).getAllByRole('button', { name: /Square/ })

  // Act: Perform actions
  fireEvent.click(squares[0])

  // Assert: Verify results
  expect(within(container).getByText('Next player: O')).toBeTruthy()
})
```

**Key Testing Patterns:**
- Query by accessible role: `getAllByRole('button', { name: /Square/ })`
- Use `within()` for scoped queries
- Clean up after each test: `afterEach(() => cleanup())`
- Test both positive and negative cases
- Verify accessibility attributes

### Step 3.3: Configure Playwright

**File: playwright.config.js**
```javascript
export default defineConfig({
  baseURL: 'http://127.0.0.1:5173',
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
  use: {
    browserName: 'chromium',
  },
  expect: {
    timeout: 5000,
  },
  timeout: 30000,
  actionTimeout: 10000,
})
```

### Step 3.4: Write E2E Tests

**File: tests/app.spec.js**

**Test Scenarios:**
1. Game loads with initial UI
2. X and O alternate on clicks
3. Winner declared with highlighting
4. Reset button clears board
5. (Additional scenarios for draw, accessibility, etc.)

**Pattern:**
```javascript
import { test, expect } from '@playwright/test'

test.describe('Game Workflow', () => {
  test('should play complete game', async ({ page }) => {
    await page.goto('/')
    // interactions and assertions
  })
})
```

### Step 3.5: Verify Coverage

```bash
npm run test -- --run --coverage
```

**Expected Output:**
```
App.jsx: 100% statements, 100% branches, 100% functions, 100% lines
Test Files: 1 passed
Tests: 22 passed
```

---

## Phase 4: Code Quality & Accessibility

### Step 4.1: Configure ESLint

**File: .eslintrc.cjs**
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}
```

### Step 4.2: Implement Accessibility Features

**In App.jsx:**
```javascript
// Stable keys instead of index
key={`square-${index}`}

// Aria labels for screen readers
aria-label={`Square ${index + 1}${board[index] ? ': ' + board[index] : ''}`}

// Disabled state
disabled={!!winner || !!board[index]}

// Pressed state for filled squares
aria-pressed={!!board[index]}

// Keyboard navigation
const handleKeyDown = useCallback((e, index) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick(index)
  }
}, [handleClick])
```

### Step 4.3: Run Quality Checks

```bash
npm run lint          # ESLint
npm run test -- --run # Tests
npm audit             # Dependencies
```

---

## Phase 5: CI/CD Pipeline

### Step 5.1: GitHub Actions Workflow

**File: .github/workflows/ci-cd.yml**

**Structure:**
- Trigger: `workflow_dispatch` with 8 runtime inputs
- Job 1: `lint-build-scan` (linting, testing, building, scanning)
- Job 2: `deploy` (Kubernetes deployment)

**Steps in Job 1:**
1. Checkout code
2. Setup Node.js 20
3. npm ci (clean install)
4. ESLint
5. npm audit
6. Unit tests
7. Install Playwright
8. E2E tests
9. Build production bundle
10. Docker Buildx setup
11. Docker login (if pushing)
12. Docker build & push
13. Trivy container scan

**Steps in Job 2:**
1. Setup kubectl
2. Configure kubeconfig
3. Create namespace
4. Apply Kubernetes manifests
5. Rollout status check

**Runtime Inputs:**
- `environment` - Deployment environment label
- `kube_namespace` - Kubernetes namespace
- `kube_context` - Kubernetes context
- `image_name` - Docker image name
- `image_tag` - Docker image tag
- `deploy` - Whether to deploy (yes/no)
- `push_image` - Whether to push image (yes/no)

### Step 5.2: Harness.io Pipeline

**File: .harness/pipeline.yaml**

**Structure:**
- 11 runtime variables
- CI Stage: 14 security & build steps
- CD Stage: 2 deployment steps

**CI Steps:**
1. TruffleHog (secret detection)
2. npm ci
3. ESLint
4. npm audit (SAST)
5. OWASP Dependency-Check
6. Snyk (optional)
7. Unit tests
8. SonarQube (optional)
9. Playwright install
10. Playwright tests
11. npm outdated
12. Checkov K8s scan
13. Docker build (native)
14. Trivy scan

**CD Steps:**
1. K8s dry-run validation
2. K8sRollingDeploy (native step)

---

## Phase 6: Containerization & Deployment

### Step 6.1: Create Dockerfile

**File: Dockerfile**

**Multi-stage Build:**
```dockerfile
# Stage 1: Builder (node:20-alpine)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (nginx:stable-alpine)
FROM nginx:stable-alpine
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 ... nginx
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'add_header Cache-Control ...' > /etc/nginx/conf.d/cache.conf
USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Security Features:**
- Non-root user (nginx:101)
- Read-only root filesystem
- Dropped all capabilities
- Cache headers configured
- Minimal base image

### Step 6.2: Create Kubernetes Manifests

**File: k8s/deployment.yaml**

**Key Components:**
```yaml
Deployment:
  - replicas: 1
  - image: ghcr.io/OWNER/jbtictactoe:latest
  - port: 80
  - securityContext:
      runAsNonRoot: true
      runAsUser: 101
      allowPrivilegeEscalation: false
  - resources:
      requests: {cpu: 100m, memory: 128Mi}
      limits: {cpu: 250m, memory: 256Mi}
  - livenessProbe: HTTP GET / every 10s
  - readinessProbe: HTTP GET / every 5s
```

**File: k8s/service.yaml**

**Service:**
```yaml
Service:
  - type: ClusterIP
  - port: 80
  - targetPort: 80
  - selector: app: tictactoe-app
```

---

## Phase 7: Documentation & Agents

### Step 7.1: Create Copilot Instructions

**File: .github/copilot-instructions.md**

**Sections:**
1. Project overview
2. Tech stack summary
3. Project structure
4. Naming conventions
5. Preferred testing patterns
6. Code style guidelines
7. Development workflow
8. Security & best practices
9. Common tasks
10. References

### Step 7.2: Define Specialized Agents

**File: .github/AGENTS.md**

**Three Agents:**

1. **@frontend-pro** - React, CSS, UX, testing
2. **@backend-arch** - Docker, K8s, CI/CD
3. **@security-reviewer** - Scanning, compliance, hardening

**For Each:**
- Expertise areas
- Capabilities
- When to use
- Example usage
- Constraints

### Step 7.3: Create This Plan

**File: .github/PLAN.md**

This comprehensive guide for replication.

---

## Validation Checklist

### Application
- [ ] App.jsx renders 3x3 board
- [ ] Click flow works (X→O alternation)
- [ ] Winner detection works (all 8 combinations)
- [ ] Draw detection works
- [ ] Reset clears board
- [ ] Status message visible and prominent
- [ ] Winning squares highlight
- [ ] Keyboard navigation works (Enter/Space)
- [ ] Accessibility features present (aria-labels, disabled states)

### Testing
- [ ] 22 unit tests passing
- [ ] 4 E2E tests passing
- [ ] 100% coverage on App.jsx
- [ ] Coverage report excludes main.jsx
- [ ] Tests run in pre-commit hook

### Code Quality
- [ ] ESLint: 0 errors
- [ ] npm audit: passes
- [ ] No unused variables
- [ ] BEM CSS naming consistent

### Pre-commit Hooks
- [ ] Husky installed (`npm run prepare`)
- [ ] .husky/pre-commit executable
- [ ] .husky/commit-msg executable
- [ ] Lint-staged runs on commit
- [ ] Tests run on commit
- [ ] TruffleHog detects secrets
- [ ] Conventional commits enforced

### Docker
- [ ] Dockerfile builds successfully
- [ ] Image size reasonable (~50MB)
- [ ] Container runs on port 80
- [ ] Non-root user (nginx:101)
- [ ] No secrets in image

### Kubernetes
- [ ] Manifests apply successfully
- [ ] Pod starts and is ready
- [ ] Health checks pass
- [ ] Security context applied
- [ ] Resource limits set

### CI/CD
- [ ] GitHub Actions workflow passes
- [ ] Harness pipeline runs successfully
- [ ] Docker image builds
- [ ] Trivy scan passes
- [ ] Deployment succeeds

### Documentation
- [ ] copilot-instructions.md complete
- [ ] AGENTS.md defines 3 agents
- [ ] PLAN.md this file present
- [ ] README.md updated

---

## Common Issues & Solutions

### Issue 1: Vitest Picking Up Playwright Tests

**Problem:** Vitest collects tests/app.spec.js and fails with "test.describe() called here"

**Solution:**
```javascript
// vite.config.js
test: {
  exclude: ['tests/**', 'node_modules/**'],
}
```

### Issue 2: Playwright Tests Fail - No Dev Server

**Problem:** "Target page, context or browser has been closed"

**Solution:**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

Or use playwright.config.js `webServer` option (auto-starts dev server).

### Issue 3: Coverage Shows 64% Instead of 100%

**Problem:** main.jsx and config files included in coverage report

**Solution:**
```javascript
// vite.config.js
coverage: {
  exclude: ['src/main.jsx', 'node_modules/', 'tests/'],
}

// sonar-project.properties
sonar.exclusions=node_modules/**,dist/**,*.spec.jsx,src/main.jsx
```

### Issue 4: Tests Query Buttons with name=""

**Problem:** After adding aria-labels, buttons have names like "Square 1", queries for `name: ''` fail

**Solution:**
```javascript
// Before:
const squares = within(container).getAllByRole('button', { name: '' })

// After:
const squares = within(container).getAllByRole('button', { name: /Square/ })
```

### Issue 5: .eslintrc Missing React Rules

**Problem:** React plugin not loaded, react/prop-types not recognized

**Solution:**
```javascript
// .eslintrc.cjs
plugins: ['react'],
extends: ['eslint:recommended', 'plugin:react/recommended'],
settings: {
  react: {
    version: 'detect',
  },
},
```

### Issue 6: npm audit Reports Vulnerabilities

**Problem:** Pre-commit hook rejects commit due to moderate vulnerabilities

**Solution:**
```bash
# Review vulnerabilities
npm audit

# Fix if available
npm audit fix

# Or use --legacy-peer-deps if necessary
npm install --legacy-peer-deps

# Ignore in pre-commit for moderate
npm audit --audit-level=moderate --production
```

### Issue 7: Kubernetes Deployment Fails - Image Not Found

**Problem:** ImagePullBackOff or ErrImagePull

**Solution:**
```bash
# Build and push image first
docker build -t ghcr.io/OWNER/jbtictactoe:latest .
docker push ghcr.io/OWNER/jbtictactoe:latest

# Update k8s/deployment.yaml with correct image
# Then apply manifests
kubectl apply -f k8s/
```

### Issue 8: Port 5173 Already in Use

**Problem:** Dev server fails to start

**Solution:**
```bash
# Vite tries another port automatically, or:
npm run dev -- --port 5175

# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Issue 9: TruffleHog False Positives

**Problem:** Pre-commit hook blocks commit due to harmless strings

**Solution:**
```bash
# Use baseline to ignore known patterns
trufflehog git file:// --baseline <baseline-file>

# Or disable pre-commit temporarily
git commit --no-verify  # Not recommended for production
```

### Issue 10: Husky Hooks Not Running

**Problem:** Commit doesn't trigger pre-commit hook

**Solution:**
```bash
# Reinstall husky
npm run prepare

# Verify hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Check .git/hooks are linked
ls -la .git/hooks/
```

---

## Implementation Order Recommendation

### Optimal Sequence (Minimal Backtracking)

1. **Phase 1** - Project setup (5 min)
2. **Phase 2** - Core app + styling (20 min)
3. **Phase 3** - Testing (30 min) ← Iterate if coverage <100%
4. **Phase 4** - Quality & accessibility (15 min)
5. **Phase 5** - CI/CD pipelines (30 min)
6. **Phase 6** - Docker & K8s (25 min)
7. **Phase 7** - Documentation (20 min)

**Total: ~2.5 hours**

### Parallel Setup (If Using AI Assistant)

1. While writing App.jsx → Start test setup
2. While writing tests → Prepare Dockerfile
3. While configuring tests → Write CI/CD workflows
4. While running tests → Create K8s manifests

---

## Tools & Commands Reference

### Development
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build locally
npm run lint             # Check code quality
```

### Testing
```bash
npm run test             # Watch mode
npm run test -- --run    # Single run
npm run test -- --run --coverage
npm run test:e2e         # E2E tests
npm run test:e2e:headed  # E2E with browser visible
```

### Git & Pre-commit
```bash
npm run prepare          # Install husky hooks
git commit -m "feat: description"  # Runs hooks
git commit --no-verify   # Skip hooks (emergency)
```

### Docker
```bash
docker build -t jbtictactoe:local .
docker run -p 8080:80 jbtictactoe:local
docker push ghcr.io/OWNER/jbtictactoe:latest
```

### Kubernetes
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs <pod-name>
kubectl rollout restart deployment/tictactoe-app
```

---

## Success Criteria

Your implementation is **production-ready** when:

✅ **All Tests Pass**
- 22 unit tests passing
- 4 E2E tests passing
- 100% coverage on App.jsx

✅ **Code Quality**
- ESLint: 0 errors
- npm audit: passes
- Pre-commit hooks running

✅ **Security**
- TruffleHog: no secrets
- Trivy: no critical vulnerabilities
- Non-root container user
- K8s security context applied

✅ **Accessibility**
- Aria-labels on all interactive elements
- Keyboard navigation works
- Disabled states visible
- Screen reader compatible

✅ **Deployment**
- Docker image builds
- Kubernetes manifests apply
- Health checks pass
- Pod is ready and running

✅ **Documentation**
- copilot-instructions.md complete
- AGENTS.md defines agents
- PLAN.md this guide
- README.md updated

---

## Related Documentation
- [Copilot Instructions](./.github/copilot-instructions.md)
- [Agent Definitions](./.github/AGENTS.md)
- [Project README](../README.md)
- [GitHub Actions Workflow](./.github/workflows/ci-cd.yml)
- [Harness Pipeline](./.harness/pipeline.yaml)
- [Kubernetes Deployment](../k8s/deployment.yaml)
