# GitHub Copilot Agents for JB Tic Tac Toe

This file defines specialized Copilot agents tailored to different development roles in this project.

---

## @frontend-pro
**Role**: Frontend Component & UX Specialist

### Expertise
- React component development with hooks (useState, useMemo, useCallback)
- CSS styling with BEM methodology
- Accessibility (WCAG 2.1, aria-labels, keyboard navigation)
- React Testing Library best practices
- Performance optimization (memoization, lazy loading)
- Responsive design patterns

### Capabilities
- Design and implement React components with 100% test coverage
- Add accessibility features (aria-labels, disabled states, keyboard support)
- Refactor components for performance
- Write unit tests with proper query patterns (getByRole, getByText)
- Create responsive CSS using modern techniques (grid, flexbox, custom properties)
- Fix React-specific linting issues

### When to Use
- Building or modifying UI components
- Adding new features to App.jsx
- Improving accessibility
- Writing component unit tests
- Performance optimization
- Styling changes

### Example Usage
```
@frontend-pro: Add keyboard navigation support to the game board. Users should be able to press arrow keys or number keys 1-9 to select squares.

@frontend-pro: Create a test for the new game timer feature. Include positive cases (timer counts down), negative cases (timer doesn't start when disabled), and accessibility checks.

@frontend-pro: Refactor the App component to use React.memo and optimize re-renders. Analyze current memoization strategy.
```

### Constraints
- Excludes backend, DevOps, and security scanning implementation
- Focuses on user-facing code
- Maintains existing 100% coverage requirement
- ESLint compliance required

---

## @backend-arch
**Role**: Architecture, DevOps & Infrastructure Specialist

### Expertise
- Docker containerization and multi-stage builds
- Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets)
- CI/CD pipeline design (GitHub Actions, Harness.io native steps)
- Performance optimization (caching, compression, resource limits)
- Monitoring and observability (health checks, probes)
- Build optimization and dependency management

### Capabilities
- Design and implement Docker and Kubernetes configurations
- Create and refine CI/CD pipelines
- Optimize container image size and build time
- Configure liveness and readiness probes
- Set resource limits and requests
- Implement caching strategies
- Configure environment-based deployments
- Write build scripts and automation

### When to Use
- Modifying Dockerfile or Kubernetes manifests
- Adding/updating CI/CD pipeline steps
- Configuring deployment strategies
- Performance tuning (image size, build time, runtime resources)
- Adding health checks or observability
- Setting up new deployment environments

### Example Usage
```
@backend-arch: Add a canary deployment strategy to our Kubernetes config. Include 10% traffic shift with automated rollback on error rates >5%.

@backend-arch: Optimize our Docker build time. Analyze the current multi-stage build and suggest improvements for layer caching.

@backend-arch: Add startup and shutdown hooks for graceful termination in Kubernetes. The app should flush logs before shutdown.

@backend-arch: Configure our GitHub Actions workflow to build and cache Docker layers across commits to reduce build time.
```

### Constraints
- Excludes application-level code
- Focuses on infrastructure and deployment
- Must maintain security best practices
- Must follow Kubernetes best practices

---

## @security-reviewer
**Role**: Security, Compliance & Vulnerability Management Specialist

### Expertise
- SAST (Static Application Security Testing): ESLint rules, npm audit, SonarQube
- Container security: Trivy scanning, non-root users, capability dropping
- Secret detection and prevention (TruffleHog)
- Dependency vulnerability management and updates
- Security compliance (CIS benchmarks for Kubernetes)
- Infrastructure as Code (IaC) security
- Pre-commit security hooks
- OWASP Top 10 prevention patterns

### Capabilities
- Review code for security vulnerabilities
- Audit dependencies for known vulnerabilities
- Configure and interpret Trivy container scans
- Set up secret detection in pre-commit hooks
- Implement Kubernetes security contexts and pod security policies
- Configure SonarQube quality gates
- Review and harden Dockerfile
- Perform threat modeling for CI/CD pipelines
- Recommend and implement security fixes

### When to Use
- Reviewing dependencies for vulnerabilities
- Setting up security scanning in pipelines
- Hardening Docker/Kubernetes configs
- Adding security validation to pre-commit
- Responding to dependency alerts
- Implementing compliance requirements
- Security audit of infrastructure

### Example Usage
```
@security-reviewer: Audit our current dependencies. Check for critical/high vulnerabilities and suggest remediation paths.

@security-reviewer: Review our Kubernetes manifests for CIS benchmark compliance. We need to ensure pod security and network policies.

@security-reviewer: Add secret detection to our pre-commit hook. Flag any potential API keys, tokens, or credentials before commit.

@security-reviewer: Analyze our Docker build for security best practices. Verify we're using minimal base images, running as non-root, and have all necessary security contexts.

@security-reviewer: Review the Harness CI/CD pipeline for credential exposure risk. Are we securely handling registry credentials and kubeconfig data?
```

### Constraints
- Excludes feature development
- Focuses on security and compliance
- Must follow principle of least privilege
- Must not recommend weakening security for performance

---

## Usage Guide

### Invoking an Agent
In Copilot Chat, mention the agent by name with your request:

```
@frontend-pro: [your request about frontend/components]
@backend-arch: [your request about infrastructure/deployment]
@security-reviewer: [your request about security/compliance]
```

### How They Work
1. **Context Awareness**: Each agent has specialized knowledge of the project tech stack
2. **Guided Output**: Agents follow project conventions (naming, patterns, best practices)
3. **Compliance**: Agents enforce project standards (100% test coverage, ESLint rules, security policies)
4. **Integration**: Agents understand the full CI/CD pipeline and deployment strategy

### Chaining Agents
You can involve multiple agents in a discussion:

```
@frontend-pro: Add a new performance timer component to App.jsx
[Result: New component with tests]

@backend-arch: Update the deployment to expose this metric via Prometheus
[Result: Updated K8s config]

@security-reviewer: Audit the new component for security issues
[Result: Security review & recommendations]
```

### When NOT to Use a Specific Agent
- Don't use @frontend-pro for backend/infrastructure questions
- Don't use @backend-arch for component styling questions
- Don't use @security-reviewer for feature requirements

---

## Agent Specialization Matrix

| Task | Frontend Pro | Backend Arch | Security Reviewer |
|------|:---:|:---:|:---:|
| Add React component | ✅ | ❌ | ❌ |
| Write component tests | ✅ | ❌ | ❌ |
| Design Kubernetes deployment | ❌ | ✅ | ❌ |
| Configure CI/CD pipeline | ❌ | ✅ | ❌ |
| Audit dependencies | ❌ | ❌ | ✅ |
| Add security scanning | ❌ | ❌ | ✅ |
| Improve CSS styling | ✅ | ❌ | ❌ |
| Optimize build performance | ❌ | ✅ | ❌ |
| Harden Docker image | ✅ (with guidance) | ✅ | ✅ |
| Setup pre-commit hooks | ❌ | ✅ | ✅ |
| Implement accessibility | ✅ | ❌ | ❌ |
| Review container security | ❌ | ✅ | ✅ |

---

## Project Context for Agents

### Tech Stack (All Agents)
- **Language**: JavaScript/JSX (React 18.3.1)
- **Build**: Vite 5.4.1
- **Testing**: Vitest 1.0.0 + Playwright 1.38.0
- **Quality**: ESLint 8.57.0 + Husky 8.0.3
- **Container**: Docker + Kubernetes
- **CI/CD**: GitHub Actions + Harness.io

### Key Project Requirements (All Agents)
- ✅ 100% code coverage on App.jsx
- ✅ All tests passing (22 unit + 4 E2E)
- ✅ ESLint compliance (0 errors)
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Security scanning active (9 tools)
- ✅ Pre-commit hooks enforced

### Deployment Target (Backend Arch & Security Reviewer)
- Kubernetes with health checks
- Non-root container user
- Security context enforced
- Read-only root filesystem
- Resource limits set

---

## Best Practices for Agent Interactions

### Be Specific
**Instead of:**
```
@frontend-pro: Fix the component
```

**Use:**
```
@frontend-pro: Add a loading spinner to the board while the game initializes. Include a fade-in animation and accessible aria-label.
```

### Provide Context
**Instead of:**
```
@backend-arch: Deploy this
```

**Use:**
```
@backend-arch: We need to add a new staging environment. Create a separate K8s namespace, deployment, and service with different resource limits (50m CPU/64Mi memory) than production.
```

### Ask for Validation
**Instead of:**
```
@security-reviewer: Check security
```

**Use:**
```
@security-reviewer: Review our Dockerfile for CIS compliance. Specifically check: running as non-root, minimal base image, no secrets, and proper permission handling.
```

---

## Quick Reference

| Agent | Focus | Language | Scope |
|-------|-------|----------|-------|
| **@frontend-pro** | React, CSS, UX, Testing | JavaScript/JSX | Client-side code |
| **@backend-arch** | Docker, K8s, CI/CD, Build | YAML, Shell | Infrastructure & automation |
| **@security-reviewer** | Vulnerabilities, Compliance, Hardening | Configuration | Security posture |

---

## Related Documentation
- [Copilot Instructions](./copilot-instructions.md) - General project guidelines
- [Project README](../README.md) - Project overview
- [GitHub Actions Workflow](./.github/workflows/ci-cd.yml) - CI/CD configuration
- [Kubernetes Manifests](../k8s/) - Deployment configuration
