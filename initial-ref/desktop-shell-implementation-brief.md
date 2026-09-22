# Desktop Shell Implementation Brief

Status: curated implementation handoff, not a Junction/TCS/DWG artifact.

## 1. Goal

Build a maintainable personal Arch Linux + Hyprland desktop configuration with a small, polished shell surface and a keyboard-first workflow. The result should feel professionally restrained and materially influenced by macOS 27, while remaining native to Wayland/Hyprland rather than imitating macOS chrome or behavior.

The implementation should be understandable as ordinary dotfiles: plain files, plain Git history, explicit packages, and clear ownership boundaries. Do not copy a public rice or introduce a framework whose behavior is harder to understand than the configuration it replaces.

## 2. Required implementation references

Use these skills as implementation authority for their respective domains:

- `quickshell-skill-v0.3.1` — Quickshell/QML semantics and integrations.
- `hyprland-lua-v0.56.2` — Hyprland Lua configuration, runtime state, workspace policy, rules, and shell integration.
- `macos27-shell-design-skill` — visual hierarchy, material translation, geometry, density, interaction, and motion.

Project requirements in this brief override generic skill preferences. Exact installed runtime metadata/source overrides remembered APIs.

Current target baseline at handoff time:

- Hyprland upstream: `v0.56.2`
- Arch Hyprland package: `0.56.2-3`
- Quickshell: `0.3.1-1`
- Terminal: Ghostty
- Shell: Zsh + restrained Oh My Zsh

Re-check installed package versions when implementation actually begins. Do not silently migrate to newer APIs merely because upstream `main` has changed.

## 3. Out of scope

The user will perform Arch installation, boot setup, GPU/driver setup, basic networking/audio, and initial Hyprland availability. Begin from a working Arch + Hyprland session.

Do not add in v1 unless a real need appears:

- control center or settings dashboard;
- dock;
- notification history/center;
- system tray;
- weather or system-stat widgets;
- clipboard manager/history UI;
- wallpaper-derived themes;
- app-placement automation;
- session restoration;
- custom backend/daemon;
- generic provider/plugin framework;
- tmux/zellij as part of the desktop workflow;
- custom lock implementation;
- persistent launcher ranking/recent-state database.

## 4. Ownership boundaries

### Hyprland owns

- physical input bindings;
- monitor configuration and host-specific hardware facts;
- compositor layout/focus/movement;
- workspace identity and routing;
- floating/fullscreen behavior;
- the named special workspace used by the scratchpad;
- application-window placement/rules;
- Quickshell layer treatment such as compositor blur.

### Quickshell owns

- per-monitor bar;
- launcher;
- workspace overview;
- transient notification daemon/toasts;
- shell UI state and mutual exclusion;
- search/ranking/presentation policy;
- media text presentation;
- shell surface geometry, tint, borders/highlights, local shadows and motion.

### Conventional tools own

- lock: `hyprlock`;
- screenshots: `grim` + `slurp` + `wl-clipboard`;
- clipboard transport: `wl-copy` / `wl-paste`;
- terminal: Ghostty;
- editor: Neovim.

Do not wrap conventional tools in custom services without a demonstrated requirement.

## 5. Workspace and monitor contract

Each physical monitor presents an independent conceptual local workspace bank `1..9`.

Hyprland still requires globally unique workspace IDs. Hide those backing IDs from the user and from normal UI.

Use a stable host-profile monitor bank and this backing scheme:

```text
workspace_id = bank * 100 + local_slot

bank 0: 1..9
bank 1: 101..109
bank 2: 201..209
```

The host profile owns physical monitor identity -> bank. Do not derive a permanent bank from runtime monitor IDs or connection order.

Quickshell always renders local `1..9` on every monitor and translates backing workspace IDs back into monitor/local-slot context.

Required behavior:

- `Super+1..9`: switch to that local workspace on the currently focused monitor.
- `Super+Shift+1..9`: send focused window to that local workspace on the current monitor without following it.
- `Super+H/J/K/L`: directional window focus within current monitor.
- `Super+Shift+H/J/K/L`: move/rearrange focused window directionally within current monitor.
- `Super+Ctrl+H/J/K/L`: resize focused window directionally.
- Arrow aliases may mirror the HJKL bindings.
- Disable Hyprland's implicit directional monitor fallback so ordinary HJKL never silently crosses monitors.
- `Super+Alt+H/J/K/L`: focus adjacent physical monitor.
- `Super+Alt+Shift+H/J/K/L`: move focused window to the adjacent monitor's currently visible workspace and follow the spatial move.

Normal applications open on the current active workspace. Do not add app-specific placement rules in v1.

## 6. Remaining core bindings

```text
Super+Space       launcher
Super+T           Ghostty at $HOME
Super+S           Neovim scratchpad
Super+L           lock
Super+Q           close focused window
Super+F           true fullscreen
Super+V           toggle floating
Alt+Tab           toggle current-monitor workspace overview
Print             region screenshot -> clipboard
Shift+Print       focused-monitor screenshot -> clipboard
```

Use Super+left-drag to move floating windows and Super+right-drag to resize floating windows if the native Hyprland binding remains appropriate.

No separate maximize binding initially.

## 7. Top bar

One Quickshell bar per physical monitor.

Target height: approximately 28 logical px; visually calibrate on the real machine rather than treating the number as an Apple constant.

Structure:

```text
left                  center                    right
1 2 3 4 5 6 7 8 9    Artist — Track           time
```

Workspace presentation:

- all nine numbers are permanently visible;
- active = strongest state, using restrained surface emphasis plus blue accent/underline;
- occupied inactive = clearly legible;
- empty = strongly subdued;
- clicking a number switches the local workspace on that bar's monitor.

Center media text:

- geometrically centered, not merely centered in remaining space;
- `Artist — Track`;
- disappears entirely when there is no appropriate playing media;
- no media popup/panel in v1.

Right:

- time only;
- no date, seconds, calendar, network, battery, tray or system stats in v1.

True fullscreen hides the bar only on the monitor whose active workspace is fullscreen, and removal of the visible bar must also remove its exclusive zone.

## 8. Launcher

`Super+Space` toggles a centered launcher on the currently focused monitor.

It is a focused search surface, not a dashboard.

Normal result providers:

1. Applications from desktop entries.
2. Running windows globally across all monitors.

Application selection always launches the application, even if another instance/window is already open.

Window selection focuses the exact selected window, switching monitor/workspace as necessary.

Running-window results must expose enough context to disambiguate the same local workspace number on different monitors, e.g.:

```text
Neovim · Right · WS 3
```

Search behavior:

- fuzzy but deterministic;
- exact/prefix matches outrank substring; substring outranks fuzzy;
- no frequency/recent/learned ranking state.

Commands exist only under an explicit `>` prefix. Initial command set:

```text
> lock
> logout
> reboot
> shutdown
> reload shell
```

`lock` and `reload shell` may execute immediately. `logout`, `reboot`, and `shutdown` require lightweight inline confirmation. No arbitrary shell command execution.

Keyboard behavior:

- Up/Down: result navigation;
- Ctrl+K / Ctrl+J: accepted previous/next aliases;
- Enter: activate selected result;
- Esc: dismiss;
- Super+Space: toggle;
- ordinary H/J/K/L remain normal text input unless used with the explicit Ctrl navigation chord.

Footer semantics should communicate navigation/select/command mode; do not label the activation verb simply `Open` because windows focus and commands execute.

The scratchpad and Quickshell's own surfaces are excluded from running-window search.

Launcher behavior when an app is fullscreen: appear above it temporarily without destroying or changing the application's fullscreen state.

## 9. Workspace overview

`Alt+Tab` toggles a current-monitor-only 3x3 overview of the local `1..9` workspace model.

Do not implement classic hold-Alt / repeatedly-tap-Tab / release-to-activate behavior.

Overview behavior:

- all nine local workspace slots visible;
- active slot unmistakable;
- occupied slots show abstract/schematic window representations;
- empty slots strongly subdued;
- selecting a workspace switches there;
- selecting a represented window switches/focuses that exact window;
- scratchpad excluded.

Input while open:

- `1..9`: direct workspace activation;
- H/J/K/L and arrows: spatial navigation;
- Enter: activate;
- Esc: dismiss;
- pointer selection supported.

The overview is intentionally spatially stronger than the launcher. Use a stronger dark veil/recession effect rather than nine glass cards.

## 10. Transient-surface exclusivity

Major shell surfaces are mutually exclusive:

- opening launcher closes overview;
- opening overview closes launcher;
- opening scratchpad first dismisses launcher/overview;
- clicking outside launcher/overview dismisses it;
- successful selection dismisses launcher/overview;
- top bar remains structurally present except when hidden for true fullscreen.

Quickshell owns this state machine.

## 11. Scratchpad

`Super+S` controls one session-scoped persistent Neovim scratchpad process.

Use a named Hyprland special workspace, conceptually `special:scratch`.

The scratch terminal must use a dedicated Ghostty Wayland application ID/class distinct from normal Ghostty windows. Launch Neovim directly through that dedicated Ghostty instance so closing Neovim ends that scratch instance.

Desired presentation:

- floating overlay, never tiled/reflowing underlying windows;
- right aligned on the currently focused monitor;
- roughly 35–40% monitor width;
- almost the full usable height below the top bar;
- small outer inset;
- receives focus when shown.

The same scratch process moves with the user's context: show it on whichever monitor is currently focused.

Hiding does not destroy it. Closing Neovim does destroy it; the next invocation starts a fresh instance.

No persistence across logout/reboot. No scratchpad entry in launcher running-window search or overview.

Prefer native special-workspace lifecycle plus `on_created_empty` before introducing explicit process registries. Validate close/reopen behavior on the target machine before adding lifecycle workarounds.

## 12. Notifications

Quickshell owns the desktop notification daemon.

Presentation:

- small top-right transient toasts;
- limited simultaneous stack;
- automatic dismissal according to notification semantics;
- actions supported when the sender provides them and the UI actually exposes them;
- visual system shared with launcher/bar materials;
- no persistent notification history or notification center.

Advertise only notification capabilities that are implemented.

## 13. Lock and screenshots

Lock:

- `hyprlock`;
- invoked by `Super+L` and `> lock`;
- same broad visual family as the shell, but simple;
- time/date/authentication focus only;
- no weather, widgets, media dashboard or custom PAM shell.

Screenshots:

```text
Print
→ slurp region
→ grim capture
→ clipboard

Shift+Print
→ focused monitor capture
→ clipboard
```

No screenshot history, OCR, uploader or screenshot-management GUI in v1.

## 14. Visual direction

The visual target is macOS 27 professional desktop execution translated to Wayland, not literal macOS reproduction.

Core principles:

- content dominates;
- persistent shell chrome is structurally quiet;
- transient control/navigation surfaces may use restrained Liquid-Glass-inspired material;
- compact desktop-scale information density;
- strong alignment and visual hierarchy;
- sparse semantic accent color;
- nested rounded geometry should be concentric/related rather than independently rounded;
- depth should use the minimum mechanisms necessary;
- focus, selection, hover and pressed states remain semantically distinct;
- motion is short, purposeful and spatially coherent;
- idle UI is still;
- disabling blur/transparency must not destroy readability or hierarchy.

Do not imitate macOS with traffic lights, Apple fonts/assets, command glyphs, sidebars, Mac title bars or application-specific chrome.

### Project palette direction

Use a high-contrast Tokyo Night-derived dark palette. Existing visual baseline:

```text
background      #161821
surface         #1d2030
surface-2       #212536
raised          #25293a
primary text    #dfe6ff
normal text     #d2daf7
muted text      #8b95b9
accent blue     #82aaff
cyan            #86e1fc
green           #c3e88d
yellow          #ffc777
red             #ff757f
purple          #c099ff
```

Treat these as a baseline visual direction, not an excuse to use every semantic color throughout the shell.

Preferred UI typeface for this project: Inter or another open font with comparable compact neutral readability. Do not use SF Pro.

For shell-owned symbolic controls, Lucide is an acceptable baseline. Preserve real desktop-entry application icons rather than monochroming third-party apps.

## 15. Material/rendering ownership

Use Hyprland compositor blur for background diffusion behind appropriate Quickshell layer surfaces.

Use Quickshell for:

- Tokyo-Night tint;
- opacity;
- geometry;
- subtle edge highlight/border;
- small local shadows where needed;
- QML interaction/motion.

Give major Quickshell surfaces stable layer namespaces so Hyprland can target them separately, conceptually:

```text
desktop-shell-bar
desktop-shell-launcher
desktop-shell-overview
desktop-shell-notification
```

Do not animate blur strength. Do not create permanent fullscreen transparent windows merely to hold small UI. Do not use live screencopy as the normal implementation of glass.

Likely material strength:

- bar: mild diffusion/tint, edge separation, no heavy shadow;
- launcher: stronger bounded transient material and shallow elevation;
- notifications: similar, smaller;
- overview: dark veil and mostly opaque spatial representations, little/no glass;
- scratch content: opaque content-first surface.

Exact blur, tint opacity, shadow and animation values require real-machine visual calibration.

## 16. Terminal and shell workflow

Normal terminal binding:

```text
Super+T
→ Ghostty
→ working directory $HOME
```

A terminal-created new window may independently inherit the current terminal CWD if Ghostty supports/configures that behavior. The compositor-level binding remains deterministic at `$HOME`.

Main development workflow is terminal-centric:

```text
Super+T
cd project
opencode / claude / codex / pi
```

Do not turn Ghostty tabs/splits into the primary spatial workflow; Hyprland owns spatial organization.

Zsh + Oh My Zsh should stay restrained. Use a small plugin set and a simple useful prompt showing approximately:

- current directory/repository;
- Git branch and dirty state;
- failed previous command when relevant.

Do not build a prompt dashboard with unrelated runtime telemetry.

Terminal/window titles should expose useful project/process identity for global launcher search where practical.

## 17. Dotfiles shape

Use plain Git + GNU Stow unless implementation evidence exposes a real blocker.

Conceptual repository:

```text
dotfiles/
├── hypr/
├── quickshell/
├── ghostty/
├── zsh/
├── hyprlock/
├── hosts/
├── packages/
├── tooling/
└── README.md
```

Exact internal file boundaries are implementation discretion. Avoid premature micro-modularization.

Host-specific configuration contains only hardware facts such as:

- monitor identity;
- resolution;
- refresh;
- scale;
- physical layout;
- truly hardware-specific input overrides.

Do not scatter connector names such as `DP-1` throughout general compositor policy.

Keep one authoritative Quickshell theme-token source. A small stable subset of colors may be explicitly duplicated into Hyprland, Ghostty and hyprlock rather than introducing a cross-format theme generator.

## 18. Package and bootstrap direction

Keep explicit package manifests, conceptually:

```text
packages/core.txt
packages/desktop.txt
packages/development.txt
packages/optional.txt
```

Prefer official Arch packages when practical. Use AUR deliberately, not automatically.

The future bootstrap may install packages, establish dotfile links, create/select the host profile, and validate prerequisites. It must not become a hidden OS installer or alter boot/GPU/network/storage configuration.

A `doctor` command is justified for diagnostics only. It may verify:

- expected packages/executables;
- symlink deployment;
- host profile presence;
- configured monitor identities vs detected monitors;
- Lua/QML/static config validity where tooling supports it;
- shell/terminal/scratch commands resolve;
- expected layer/service availability.

It must not silently rewrite user configuration to "repair" problems.

Git history is the rollback mechanism. Do not maintain `.bak`, `.old`, generated backup trees or parallel config copies.

## 19. Suggested implementation sequence

This is sequencing guidance rather than a required ticket decomposition.

1. **Repository foundation** — Stow layout, package manifests, host-profile contract, editor/LSP metadata, README skeleton.
2. **Hyprland core policy** — monitors, local-workspace banks, directional focus/movement, fullscreen/floating, global shell shortcuts.
3. **Quickshell foundation** — theme, per-monitor bar, shell state, native Hyprland models and stable layer namespaces.
4. **Launcher** — applications, global windows, deterministic search, explicit command mode.
5. **Overview** — 3x3 current-monitor spatial view and exact window activation.
6. **Scratchpad** — named special workspace, dedicated Ghostty identity, drawer geometry/lifecycle.
7. **Notifications / media / utilities** — transient notification daemon, now-playing text, lock and screenshots.
8. **Visual calibration** — material, typography, spacing, concentric geometry, motion and real compositor blur on target monitors.
9. **Reliability pass** — fullscreen, reloads, multi-monitor movement, monitor disconnect/reconnect, scratch close/reopen, package/runtime verification.
10. **Bootstrap / doctor / documentation** — only after the live system behavior is established enough to automate safely.

## 20. Real-machine validation gates

Do not consider the implementation proven until it has been exercised under the real Hyprland session.

At minimum validate:

### Workspace/monitor behavior

- every monitor shows local `1..9`;
- same local slot on different monitors maps to distinct backing workspaces;
- `Super+N` never steals/moves another monitor's workspace;
- send-without-follow behaves correctly;
- ordinary HJKL does not leak across monitors;
- explicit cross-monitor focus/move works in each physical direction.

### Quickshell

- bar attaches/detaches with monitors correctly;
- launcher opens on focused monitor and can focus windows on any monitor;
- launcher and overview mutually exclude each other;
- shell surfaces do not accidentally reserve layout space;
- fullscreen hides only the appropriate bar;
- launcher/overview can overlay fullscreen without destroying fullscreen;
- idle shell CPU/GPU activity is appropriately low.

### Scratchpad

- first invocation launches once;
- hide/show preserves process;
- same scratch moves to current monitor;
- underlying tiled layout is unchanged;
- close Neovim, then invoke again -> clean fresh instance;
- config reload while hidden/shown behaves acceptably;
- monitor disconnect/reconnect does not strand it.

### Visual/accessibility robustness

- text remains readable over realistic application backgrounds;
- disabling blur still leaves clear hierarchy;
- keyboard focus and result selection are unambiguous;
- no QML binding/polish/runtime-warning loops;
- animations remain short and do not compound with compositor animations.

## 21. Implementation restraint

When a problem appears, first determine which owner is responsible:

```text
Hyprland behavior
→ compositor config/policy

Quickshell state/rendering
→ shell

Ghostty behavior
→ terminal config

conventional Linux service
→ that service/tool
```

Do not solve one layer's problem by inventing a second state system in another layer.

Do not add a daemon, cache, database, generalized plugin model, theme compiler, session-state engine or recovery framework merely because implementation permits it. Add complexity only when a demonstrated requirement cannot be handled cleanly by the existing owners.
