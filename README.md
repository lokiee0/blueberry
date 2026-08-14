# Blueberry Rebuild

Clean-room workspace for recreating the useful behavior of Strawberry Browser without depending on Strawberry's proprietary source, branding, authentication, billing, or hosted backend.

See the [implementation plan](docs/implementation-plan.md) for the complete architecture, milestones, security requirements, data model, and acceptance criteria.

## Separation rules

- This directory is independent from the installed Strawberry application.
- Do not copy Strawberry source code or proprietary assets into this project.
- Use the forensic report only to understand high-level behavior and architecture.
- Write new implementation code, names, UI assets, tests, and documentation.
- Use independently configured AI providers and backend services.

## Proposed technology

- Electron desktop shell
- SvelteKit and TypeScript user interface
- SQLite local persistence
- Secure Electron preload and typed IPC bridge
- Configurable AI provider interface
- MCP integration support
- Permission-controlled local tools
- Sandboxed code execution as a later phase

## Initial milestones

1. Desktop shell and secure Electron process boundaries.
2. Browser tabs, address bar, navigation, history, and bookmarks.
3. Local profiles, settings, downloads, and SQLite storage.
4. AI chat with configurable providers.
5. MCP integrations and permission-controlled tools.
6. Optional synchronization, transcription, and local memory.
7. Packaging, updates, security testing, and code signing.

## Documentation

- [Documentation index](docs/README.md)
- [Implementation plan](docs/implementation-plan.md)
- [Forensic analysis reference](docs/forensic-analysis/README.md)

The forensic reports are retained only as reference material. The installed
Strawberry application, extracted source, and proprietary assets must remain
outside this clean-room rebuild workspace.
