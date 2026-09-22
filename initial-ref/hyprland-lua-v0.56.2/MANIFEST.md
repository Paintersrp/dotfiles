# Manifest

## Core

- `SKILL.md` — agent operating rules and reference routing
- `AUDIT.md` — adversarial audit against the intended desktop architecture

## References

- `source-basis.md` — target release and evidence hierarchy
- `lua-configuration.md` — `hl.config`, typed config, declarative/imperative boundary
- `dispatchers-and-bindings.md` — direct dispatchers, callbacks, bind semantics
- `runtime-state.md` — `hl.get_*`, object lifetime, config normalization
- `events-and-lifecycle.md` — `hl.on`, relevant lifecycle events
- `modules-and-reload.md` — `require`, ordering, reload/error behavior
- `processes-and-boundaries.md` — `hl.exec_cmd`, subprocess limits, ownership
- `monitors-and-host-identity.md` — stable host monitor identity vs runtime IDs
- `workspaces-and-routing.md` — local workspace banks and globally unique backing IDs
- `windows-focus-and-movement.md` — directional focus/move, follow semantics, monitor moves
- `special-workspaces.md` — named scratchpads and creation lifecycle
- `quickshell-shortcuts.md` — Hyprland → Quickshell global shortcut boundary
- `layers-and-namespaces.md` — Quickshell layer namespaces and compositor effects
- `fullscreen-and-exclusive-zones.md` — fullscreen/bar/overlay ownership
- `shell-ownership-boundaries.md` — compositor vs shell responsibility map
- `reload-validation-and-recovery.md` — normal reload, full reset, verification limits
- `debugging.md` — deterministic diagnostic sequence
- `version-and-package-integrity.md` — Arch/Hypr stack consistency
- `gotchas.md` — concise failure-pattern index
