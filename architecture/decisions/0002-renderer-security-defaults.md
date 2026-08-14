# ADR 0002: Renderer security defaults

- Status: Accepted
- Date: 2026-08-14

## Decision

Every trusted Blueberry renderer starts with context isolation, Chromium sandboxing, web security, and a restrictive content security policy enabled. Node integration and insecure mixed content are disabled. The preload exposes only immutable, typed values through `contextBridge`.

New windows are denied by default. Safe HTTPS and mail links may be handed to the operating system; other protocols remain blocked.

## Rationale

Renderer content should be treated as potentially compromised. A narrow preload bridge limits the impact of renderer code execution and provides a reviewable capability surface.

## Consequences

- Renderer features cannot import Node.js or Electron directly.
- New capabilities require validation in main or preload before exposure.
- Navigation and popup behavior must remain deny-by-default and covered by tests.
