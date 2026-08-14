# Strawberry Browser reverse-engineering report

Date: 2026-08-14  
Target: installed Windows application at `C:\Users\DC\AppData\Local\Programs\strawberry`  
Observed version: `0.1.25`

## Executive summary

Strawberry is a signed Electron desktop browser with an AI-agent layer. The executable is primarily an Electron/Chromium launcher; the application logic is packaged in `resources/app.asar`.

The ASAR unexpectedly contains a nearly complete development tree, including TypeScript source, Svelte source, tests, documentation, build configuration, and E2E environment configuration. This means the application can be understood mostly from original source rather than from decompiled machine code.

This report is based on static inspection. No login bypass, remote service interaction, user-data inspection, or exploit attempt was performed.

## Artifact inventory

- `Strawberry.exe`: 236,462,800 bytes; Authenticode signature was valid and identified Dendrite Systems Inc.
- `resources/app.asar`: 288,522,183 bytes; extracted to `analysis/app-extracted`.
- Extracted archive: 22,577 files and approximately 423 MB.
- First-party `src` tree: 5,139 files.
- Production entry point: `out/main/index.js`.
- Original main-process source: `src/main/index.ts`.
- Production preloads: `out/preload/uiPreload.js`, `out/preload/webpagePreload.js`, and `out/preload/offscreenPreload.js`.
- Original renderer: SvelteKit 2 / Svelte 5 under `src/renderer`.
- Native modules include `better-sqlite3`, `@parcel/watcher`, `@napi-rs/image`, `sqlite-vec`, UI hooks, and platform-specific helpers.

## Architecture

```text
Strawberry.exe (Electron/Chromium)
        |
        v
out/main/index.js
  source: src/main/index.ts
        |
        +-- managers: profiles, auth, permissions, updates, telemetry,
        |             integrations, sandbox, transcription, memory
        |
        +-- services: browser tabs, chat/agents, UI layers, artifacts,
        |             local file servers, extensions, automation tools
        |
        +-- WebContentsView layer system
              |
              +-- UI views -> uiPreload -> SvelteKit routes
              +-- web tabs -> webpagePreload -> arbitrary websites
              +-- offscreen views -> offscreenPreload
        |
        +-- EventManager IPC bus
              dendrite-event / dendrite-invoke / ipc:query
```

The UI is not a single renderer window. `LayerFactory` creates multiple `WebContentsView` instances for browser chrome, UI tabs, components, and web pages. The application uses persistent Electron session partitions to separate UI and web content.

## Boot flow

1. `package.json` points Electron to `out/main/index.js`.
2. The main module registers custom schemes before `app.whenReady()`.
3. Core managers are constructed: profiles, permissions, integrations, tools, windows, auth, protocol routing, and calendar polling.
4. The application changes Electron's `userData` path to the Strawberry-specific application-data directory.
5. On readiness, managers initialize browser windows, notifications, health monitoring, memory systems, transcription, sandboxing, updates, and platform services.
6. `LayerFactory` creates UI and webpage views with the appropriate preload.
7. SvelteKit routes render browser chrome, chat, settings, files, history, passwords, recordings, routines, knowledge/memory, teams, and component overlays.

## IPC and trust boundaries

The main application-level bridge is `EventManager`:

- Renderer events use `dendrite-event`.
- Request/response calls use `dendrite-invoke`.
- Typed domain/action queries are routed through `ipc:query`.
- Sender-provided window and layer identifiers are replaced with scope resolved from the sending `WebContents`.
- Static extraction found 526 literal `handleInvoke(...)` operation names, plus direct Electron IPC channels for clipboard, calendar, WebAuthn, extension messaging, dialogs, and autofill.

The web-tab configuration explicitly sets `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, and `webSecurity: true`. UI/component views use separate preloads and internal-navigation guards, but do not explicitly state all four values in each constructor; Electron defaults and inherited behavior therefore matter and should be verified dynamically.

## Major functional areas

- Chromium-style browsing with tabs, history, bookmarks, downloads, profiles, password/autofill support, ad blocking, and Chrome-extension compatibility.
- AI chat and agent execution, including sub-agents, tool dispatch, file operations, web extraction/search, image/video generation calls, code execution, and artifact rendering.
- MCP and OAuth integrations, including a local integration database and remote HTTP MCP support.
- Native/local sandbox execution through a bundled Strawberry helper and sandbox transport layer.
- Local and synced files, knowledge, skills, companion configuration, routines, and task execution.
- Activity-memory and GIA activity-memory subsystems with timelines, semantic indexes, summaries, and screenshot-related operations.
- Audio recording, meeting transcription, voice commands, and calendar polling.
- Browser-data migration from Chromium, Firefox, and Safari sources.

Presence in source proves implementation exists; it does not prove that every feature is enabled for this build or account.

## Local persistence

The application stores per-profile and global state under Electron's Strawberry application-data directory. Identified stores include:

- Chromium/Electron profile partitions, cookies, and session data.
- `global-settings` through a custom ElectronStore implementation.
- `chat-sessions.db` and `profile-data.db`.
- `history.db`, `permissions.db`, `integrations.db`, and `agent-visits.db`.
- `activity-memory.db` and `gia-activity-memory.db`.
- Workspace sync outbox, version cache, and agent-draft SQLite databases.
- Local attachment, image, tab-screenshot, artifact, and companion asset servers bound to loopback addresses.

Global settings include a migration from encrypted to unencrypted storage. This does not by itself imply secrets are stored unencrypted: credential/session stores must be traced separately before making that conclusion.

## Network and update behavior

- Production API fallback is version-pinned: version `0.1.25` resolves to `https://v0-1-25.api.strawberrybrowser.com` unless an environment or build override is present.
- Authentication calls are routed under `/api/auth`; chat calls under `/api/chat`.
- A Supabase project URL is baked into the build environment. The extracted E2E configuration also includes an anon key; anon keys are client-side identifiers, but E2E configuration should still normally be excluded from production packages.
- Sentry Electron telemetry is configured in the main process and renderer CSP.
- Updates use `electron-updater` with a public Cloudflare R2/S3-compatible endpoint and publisher-name validation for Dendrite Systems Inc.
- Additional outbound integrations include Strawberry web/API services, search providers, extension assets, documentation, OAuth/MCP endpoints, and user-configured/local endpoints.

## Security and packaging observations

These are review leads, not confirmed vulnerabilities:

1. **Full source disclosure in the production archive.** Original source, tests, docs, profiling notes, and build configuration substantially reduce the effort required to inspect proprietary behavior.
2. **Development/E2E material is packaged.** `.env.e2e`, test fixtures, `.vscode`, scripts, and internal build documentation are present. A developer note in the packaged README should not ship, even though no actual password was quoted in this report.
3. **Large privileged IPC surface.** More than 500 literal application operations warrant an authorization matrix showing which renderer/layer can invoke each privileged action.
4. **Renderer CSP permits `unsafe-eval` and `unsafe-inline`.** This may be required by the renderer stack, but it weakens defense in depth if UI content can be influenced by untrusted data.
5. **Clipboard direct IPC handlers need sender review.** The direct handlers shown in `EventManager` do not visibly validate the sender in the handler itself. Reachability from untrusted webpage preloads must be tested before classifying this as a defect.
6. **Local HTTP servers need dynamic checks.** File and asset servers bind to loopback and implement origin rules. Token/path authorization, traversal resistance, port discovery, and cross-origin behavior should be tested.
7. **Agent and sandbox boundary is high impact.** The application intentionally supports code execution and filesystem/network tooling. Permission enforcement, egress filtering, helper-binary validation, and sandbox escape resistance deserve a separate threat-model review.
8. **Sensitive-data lifecycle needs targeted tracing.** Password imports, autofill, auth sessions, recordings, screenshots, activity memory, and synced files are implemented. Encryption-at-rest, retention, deletion, and telemetry redaction should be evaluated individually.

## Best next analysis steps

1. Build an IPC authorization table from all `handleInvoke`, `handleQuery`, and direct `ipcMain` registrations, mapped to preload exposure and allowed layer types.
2. Trace auth/session and autofill secrets from acquisition to disk, including `safeStorage`, cookie stores, profile databases, logs, and sync paths.
3. Run the application with an isolated Strawberry test profile and capture process creation, open ports, DNS/HTTP destinations, file writes, and IPC activity.
4. Test the loopback file servers for unauthenticated access, origin bypass, path traversal, and stale URL behavior.
5. Review agent permission matching and the native sandbox helper, then perform controlled denied/allowed filesystem and network tests.
6. Compare TypeScript source with the bundled `out` code for security-sensitive modules to confirm the shipped binary uses the inspected implementation.

## Validation limits

- Static source and packaged build files were inspected.
- The ASAR archive was extracted successfully.
- The Windows executable signature was verified.
- The application was not launched under instrumentation.
- No backend API, login, payment, account, sync, or integration behavior was exercised.
- No claim is made that a review lead is exploitable without a controlled reproduction.
