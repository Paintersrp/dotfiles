# Adversarial audit of the Quickshell 0.3.1 skill

This is an authoring audit, not runtime reference material.

## Test 1: Per-monitor top bar

Question: Can an agent build one bar per connected monitor without duplicating global services?

Expected routing:
- fundamentals
- multi-monitor-and-replication
- windows-and-surfaces
- hyprland

Skill catches:
- use `Variants` with `Quickshell.screens`;
- use `PanelWindow`;
- shared service ownership stays outside delegates;
- map screen to Hyprland monitor natively;
- use implicit window size;
- reserve work area intentionally.

Residual implementation discretion:
- exact component split;
- exact bar anchors/margins;
- exact styling.

PASS.

## Test 2: Application + window launcher

Question: Can an agent implement search without confusing launchable apps with running windows or inventing polling?

Expected routing:
- applications-and-windows
- hyprland
- qml-reactivity
- shortcuts-ipc-and-processes
- wayland-surfaces

Skill catches:
- DesktopEntries vs running toplevel distinction;
- Hyprland toplevel state for workspace/monitor-aware results;
- ranking remains product policy;
- `DesktopEntry.execute()` limitation;
- focus must be deliberate for text input;
- native shortcuts/IPC before helper processes.

Residual project authority required:
- ranking algorithm;
- result grouping;
- launch-vs-focus product semantics;
- exact command provider behavior.

PASS.

## Test 3: Workspace overview

Question: Can an agent build a monitor-local overview without hard-coding stale screen state?

Expected routing:
- multi-monitor-and-replication
- hyprland
- wayland-surfaces
- performance

Skill catches:
- current reactive screens, no durable stale ShellScreen;
- native Hyprland workspaces/toplevels;
- overlay should not reserve work area;
- large/fullscreen surface exists only when needed;
- live thumbnails are not implied by the skill.

Residual project authority required:
- schematic vs captured thumbnails;
- navigation behavior;
- selected monitor scope.

PASS.

## Test 4: Now-playing bar element

Question: Can an agent show media metadata without assuming one universal player or adding unnecessary polling?

Expected routing:
- mpris
- qml-reactivity
- performance

Skill catches:
- multiple players;
- selection is product policy;
- normalized metadata;
- capabilities vary;
- no position polling unless progress UI needs it.

PASS.

## Test 5: Notification toasts

Question: Can an agent implement a notification daemon without accidentally claiming unsupported features/history?

Expected routing:
- notifications
- wayland-surfaces
- lifecycle-and-reload

Skill catches:
- tracking semantics;
- capability flags as promises;
- safe plain text when markup unsupported;
- reload generation handling;
- history is product policy, not implicit.

PASS.

## Test 6: Keybind toggles launcher/overview

Question: Does an agent reach for helper scripts/processes unnecessarily?

Expected routing:
- shortcuts-ipc-and-processes
- hyprland

Skill catches:
- native Hyprland GlobalShortcut for keybind -> running shell;
- IpcHandler for external tooling rather than every keybind;
- process is fallback.

PASS.

## Test 7: Multi-monitor hotplug/reload

Question: Does the shell remain structurally correct when screens change or config reloads?

Expected routing:
- lifecycle-and-reload
- multi-monitor-and-replication
- debugging

Skill catches:
- reactive screen model;
- stale screen references;
- reload identity/continuity;
- lifecycle test expectations;
- historical fixed bugs retained as test concerns rather than current defects.

PASS.

## Test 8: Idle shell consumes unexpected GPU/CPU

Question: Does the debugging guidance avoid premature architectural rewrites?

Expected routing:
- performance
- debugging
- gotchas

Skill catches:
- continuous repaint/damage first;
- timers/animations/change loops;
- service scans/processes;
- layout/polish loops;
- DesktopEntries rescan only as a diagnostic lead;
- no immediate custom cache/daemon rewrite.

PASS.

## Test 9: Model emits API remembered from older/newer Quickshell

Question: Does the skill force version verification?

Expected routing:
- source-basis

Skill catches:
- v0.3.1 target;
- installed `.qmltypes` and tagged source priority;
- unversioned/master/example limitations.

PASS.

## Test 10: Skill accidentally becomes product authority

Question: Does the skill dictate bar height, palette, launcher ranking, workspace count, notification history, or a specific folder tree?

Result:
- It does not prescribe product styling/workflow.
- It gives structural implementation guidance only where Quickshell semantics warrant it.
- Product-specific outcomes remain consuming-project authority.

PASS.

## Residual gaps intentionally not covered

These remain target-project or external-framework concerns rather than generic Quickshell 0.3.1 skill content:

- exact Hyprland key syntax/configuration file mechanics beyond the Quickshell integration boundary;
- complete freedesktop desktop-entry launch semantics;
- secure lock-screen design and authentication policy;
- generic QtQuick visual-design guidance;
- exact performance budgets;
- project-specific application ranking/player-selection/notification-retention policies;
- future Quickshell versions.

## Audit result

The pack is sufficient for a strong implementation model to avoid the major Quickshell-specific errors exposed in the research phases while preserving normal project/product authority.
