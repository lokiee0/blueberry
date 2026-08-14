# Forensic Blueberry

Static application-information package for the installed Strawberry Browser application.

## Application summary

- Product: Strawberry Browser
- Version inspected: `0.1.25`
- Vendor/signing identity: Dendrite Systems Inc.
- Platform: Windows x64 Electron application
- Interface: SvelteKit 2 with Svelte 5
- Main runtime: Electron/Chromium with Node.js main process
- Primary package: `resources/app.asar`
- Production entry point: `out/main/index.js`
- Analysis date: 2026-08-14

Strawberry is a Chromium-based desktop browser with integrated AI chat and agent tooling. Its packaged code includes browser tabs, profiles, history, bookmarks, downloads, autofill, extensions, MCP/OAuth integrations, local sandbox execution, transcription, routines, synced files, and activity-memory functionality.

The production ASAR package contains a large original TypeScript and Svelte source tree. This allows source-level inspection rather than relying only on binary decompilation.

## Contents

- [Application information](application-information.md) — detailed architecture, boot flow, IPC, persistence, network behavior, security observations, and recommended next steps.
- [Artifact inventory](artifact-inventory.md) — inspected artifacts, hashes, sizes, signature evidence, and analysis boundaries.

## Recovered source

The extracted application is intentionally kept outside this documentation folder because it contains approximately 423 MB and 22,577 files:

`C:\Users\DC\AppData\Local\Programs\strawberry\analysis\app-extracted`

Important entry points:

- `src/main/index.ts` — Electron main-process bootstrap.
- `src/preload/uiPreload.ts` — trusted UI renderer bridge.
- `src/preload/webpagePreload.ts` — webpage preload boundary.
- `src/preload/offscreenPreload.ts` — offscreen renderer bridge.
- `src/renderer/src/routes` — SvelteKit screens and component routes.
- `src/main/managers/events/EventManager.ts` — central IPC/event router.
- `src/main/services/layers/LayerFactory.ts` — UI and webpage `WebContentsView` creation.
- `src/shared/config.ts` — backend URL selection and build configuration.

## Analysis status

Completed:

- Electron ASAR extraction.
- Executable signature verification.
- SHA-256 hashing of the executable and ASAR.
- Static architecture and feature mapping.
- Main/preload/renderer boundary identification.
- Initial IPC, storage, API, updater, and security review.

Not yet completed:

- Instrumented runtime execution.
- Network capture and endpoint verification.
- Per-operation IPC authorization testing.
- Authentication or subscription-flow testing.
- Local HTTP server security tests.
- Sandbox escape or permission-bypass testing.
- Verification of every feature against a live account.

## Handling note

This package documents static findings. It does not establish that any review lead is exploitable. The original application files, recovered source, embedded configuration, branding, and assets may be proprietary and should not be redistributed without authorization.
