# ADR 0001: Workspace and process boundaries

- Status: Accepted
- Date: 2026-08-14

## Decision

Blueberry uses a pnpm workspace with an Electron desktop application and separate packages for typed contracts and future security-sensitive capabilities. Electron main, preload, and renderer code live in distinct source directories and build targets.

## Rationale

Explicit package and process boundaries make privileged code easier to review and test. Shared contracts describe the narrow interface crossing those boundaries without exposing Electron or Node.js APIs to the renderer.

## Consequences

- Cross-process capabilities require an explicit typed contract.
- Security-sensitive packages can gain independent tests and release policies.
- Workspace build order must produce shared packages before the desktop bundle.
