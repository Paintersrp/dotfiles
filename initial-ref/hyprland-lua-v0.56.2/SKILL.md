# Hyprland Lua v0.56.2

Use this skill when implementing, reviewing, or debugging Hyprland Lua configuration for the target environment below.

## Target

- Hyprland upstream: `v0.56.2` (`efb5099`)
- Arch package family: `0.56.2-3`
- Configuration language: Lua
- Platform: Arch Linux / Wayland
- Shell integration: Quickshell 0.3.1

This skill is version-pinned. Do not silently substitute current `main`, old hyprlang `.conf` syntax, or pre-0.55 examples.

## Operating model

Hyprland Lua is primarily **declarative compositor configuration plus a small imperative policy layer**.

Prefer:

1. `hl.config()` for static compositor policy.
2. Direct dispatcher binds for ordinary actions.
3. Short Lua callbacks only when behavior depends on current compositor state.
4. `hl.get_*()` for compositor state.
5. `hl.dispatch(hl.dsp.*(...))` to execute dynamic compositor actions.
6. Native Hyprland/Wayland mechanisms before scripts, subprocesses, or duplicated state.

Do not turn Hyprland into a daemon, state database, shell backend, or general automation runtime.

## Critical guardrails

- Verify uncertain APIs against `/usr/share/hypr/stubs/hl.meta.lua` on the target machine.
- Treat the live Hyprland wiki as potentially newer than v0.56.2.
- `hl.dsp.*` constructs a dispatcher; it does **not** execute the action by itself.
- Resolve dynamic state inside the key/event callback, not during config load.
- Never block a Lua callback with sleeps, `io.popen`, network I/O, clipboard waits, or long shell work.
- Prefer `hl.get_*()` over spawning `hyprctl` from inside Hyprland Lua.
- Do not retain monitor/workspace/window objects as durable state; retain stable identifiers and resolve current objects when needed.
- Treat config reload as a Lua-state reset. Correctness should be derivable, not dependent on mutation history.
- Use native compositor bindings when they already express the behavior; do not route ordinary movement/drag actions through Lua unnecessarily.
- Document any upstream-version workaround with its issue/reason and removal condition.

## Reference routing

Read only the references relevant to the task.

### Writing or restructuring configuration

- `references/source-basis.md`
- `references/lua-configuration.md`
- `references/modules-and-reload.md`
- `references/processes-and-boundaries.md`

### Keybindings or dynamic actions

- `references/dispatchers-and-bindings.md`
- `references/runtime-state.md`
- `references/events-and-lifecycle.md`

### Monitors, workspaces, and window movement

- `references/monitors-and-host-identity.md`
- `references/workspaces-and-routing.md`
- `references/windows-focus-and-movement.md`

### Scratchpads / special workspaces

- `references/special-workspaces.md`
- `references/windows-focus-and-movement.md`

### Quickshell integration

- `references/quickshell-shortcuts.md`
- `references/layers-and-namespaces.md`
- `references/fullscreen-and-exclusive-zones.md`
- `references/shell-ownership-boundaries.md`

### Debugging or failures

- `references/reload-validation-and-recovery.md`
- `references/debugging.md`
- `references/version-and-package-integrity.md`
- `references/gotchas.md`

## Project-independent design boundaries

This skill teaches Hyprland 0.56.2 mechanics and safe patterns. It does **not** decide:

- the user's keymap;
- number of workspaces;
- monitor layout;
- shell visuals;
- launcher behavior;
- exact scratchpad dimensions;
- package-management policy beyond Hyprland stack consistency.

Those belong to project authority.
