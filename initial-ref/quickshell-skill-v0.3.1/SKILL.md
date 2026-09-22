# Quickshell 0.3.1 Implementation Skill

Use this skill when implementing, modifying, reviewing, or debugging a Quickshell desktop shell targeting **Quickshell v0.3.1** on **Arch Linux**, especially with **Wayland + Hyprland**.

This skill teaches Quickshell-specific implementation semantics. It is not product/design authority. Preserve the consuming project's explicit behavior, visual design, keybindings, and scope.

## Target and authority

Target runtime:

- Quickshell `v0.3.1`
- Arch package `quickshell 0.3.1-1`
- Wayland
- Hyprland where Hyprland-specific references are used

Before relying on a Quickshell API, use this authority order:

1. exact installed package and installed `.qmltypes` on the target machine;
2. upstream Quickshell source at tag `v0.3.1` and its `v0.3.1` changelog;
3. official **versioned** documentation under `https://quickshell.org/docs/v0.3.1/`;
4. official examples after checking that the used APIs are compatible with v0.3.1;
5. third-party shells as non-authoritative pattern/debugging evidence;
6. model memory only after verification.

Do not use upstream `master`, an unversioned documentation route, or a copied rice as v0.3.1 API authority.

## Operating procedure

1. Inspect the existing shell and determine the actual affected concern.
2. Read only the relevant references below.
3. Prefer native Quickshell/Qt/Hyprland state and protocols over subprocess polling.
4. Preserve reactive QML semantics and reload/monitor lifecycle behavior.
5. Keep shared services outside per-screen replicated surfaces.
6. Verify uncertain types/properties/methods against v0.3.1 authority before emitting them.
7. Treat QML/runtime warnings as debugging evidence, not cosmetic noise.
8. Validate behavior on the real Wayland compositor when the behavior depends on focus, layer-shell, monitors, rendering, compositor IPC, or another live integration.

## Routing

Read:

- `references/source-basis.md` when version/API authority is relevant.
- `references/fundamentals.md` for project structure, root objects, scopes, singletons, and components.
- `references/qml-reactivity.md` for bindings, signals, `Connections`, and component scope.
- `references/sizing-and-layout.md` for geometry, implicit sizing, layouts, and binding/polish loops.
- `references/windows-and-surfaces.md` for `QsWindow`, `PanelWindow`, `FloatingWindow`, popups, and desired window size.
- `references/multi-monitor-and-replication.md` for screens, `Variants`, per-screen windows, and shared-service ownership.
- `references/lifecycle-and-reload.md` for live reload, `Reloadable`, `PersistentProperties`, `LazyLoader`, and object lifetime.
- `references/hyprland.md` for Hyprland monitors, workspaces, toplevels, dispatchers, Lua mode, refresh semantics, and raw IPC fallback.
- `references/applications-and-windows.md` for desktop entries, launchable apps, running windows, and launcher semantics.
- `references/mpris.md` for media players and capability/position semantics.
- `references/notifications.md` for notification-server ownership, tracking, actions, capabilities, and reload behavior.
- `references/shortcuts-ipc-and-processes.md` for Hyprland global shortcuts, `IpcHandler`, `Process`, and detached execution.
- `references/wayland-surfaces.md` for layer-shell focus, exclusion, masks, and lower-level Wayland behavior.
- `references/performance.md` for always-on shell performance and rendering/service pitfalls.
- `references/debugging.md` when diagnosing failures, warnings, crashes, lifecycle issues, or unexplained CPU/GPU use.
- `references/gotchas.md` for concise v0.3.1-specific and real-world failure patterns.

## Core guardrails

- Treat QML property bindings as the default state-propagation mechanism.
- Do not imperatively overwrite a property binding unintentionally.
- Use `qs.*` imports for project modules rather than old `root:/` imports.
- Use implicit dimensions for desired `QsWindow` size; setting `width`/`height` is deprecated for that purpose in v0.3.1.
- Do not reason about QML layout as though it were CSS.
- Use `Variants` for per-screen creation of windows/non-`Item` objects.
- Do not place global services, timers, or polling processes inside per-screen delegates unless one instance per screen is intentional.
- Use proper QML singletons for genuinely global shared state/services.
- Do not retain a disconnected `ShellScreen` as durable monitor identity.
- Prefer `Quickshell.Hyprland` over polling `hyprctl` for state Quickshell already exposes.
- For Hyprland-specific launcher/overview code that needs monitor/workspace relationships, prefer Hyprland toplevel state over compositor-neutral toplevel state.
- Treat `DesktopEntries` as application data, not ranking policy.
- Treat `Mpris.players` as multiple independent players; choosing one is product policy.
- Advertise only notification capabilities the shell actually implements.
- Prefer Hyprland `GlobalShortcut` for keybind -> running-shell actions; use `IpcHandler` for intentional external CLI/control surfaces.
- `Process.command` is an argument vector, not an implicit shell command line.
- Prefer `PanelWindow` before direct `WlrLayershell` use when the portable abstraction is sufficient.
- Evaluate long-lived shell code for idle CPU, idle GPU, timers, subprocesses, watchers, and retained objects.

## Completion challenge

Before considering Quickshell work complete, ask whether an otherwise correct implementation can still fail because it:

- uses an API from a different Quickshell version;
- duplicated a service per monitor;
- broke a property binding via imperative assignment;
- introduced a binding/polish loop;
- retained stale screen or integration objects across lifecycle changes;
- depends on cached/raw IPC data without refreshing it;
- advertises a capability it does not implement;
- starts background work merely by instantiating an unused service;
- pushes expensive initialization onto first interaction without accepting the latency;
- uses an unnecessarily large always-visible surface that repaints continuously;
- mistakes LSP behavior for runtime/API authority;
- or requires live Wayland/Hyprland proof that has not yet been performed.

If yes, resolve or explicitly retain the limitation before calling the work complete.
