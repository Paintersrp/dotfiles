# Opus Handoff — Arch + Hyprland Personal Workstation

Status: curated noncanonical implementation context. This is not a Junction planning artifact.

## Requested outcome

Implement a maintainable personal Arch Linux + Hyprland workstation configuration after the user has installed a working base Arch/Hyprland system. The desktop is keyboard-first, multi-monitor, compact, and professionally restrained, with a macOS 27-inspired design language translated to Wayland rather than copied literally.

Do not copy an existing rice. Build from the project requirements using the supplied framework/design skills.

## Required reading

Read these before implementation:

1. `desktop-shell-implementation-brief.md` — project behavior and visual/product contract.
2. `fresh-arch-workstation-brief.md` — package, shell, editor, bootstrap, doctor, and update contract.
3. `quickshell-skill-v0.3.1/` — Quickshell 0.3.1 implementation semantics.
4. `hyprland-lua-v0.56.2/` — Hyprland 0.56.2 Lua implementation semantics.
5. `macos27-shell-design-skill/` — macOS 27 design translation and guardrails.
6. `hyprland-shell-visualizer-v2.html` — visual baseline only; project brief corrections override mock text/details.

## Authority order

When sources disagree:

1. explicit project requirements in the two briefs;
2. exact installed target runtime metadata/stubs and target-version source;
3. the relevant framework/design skill;
4. visualizer as bounded visual evidence;
5. model memory only after verification.

Do not silently adopt APIs or patterns from upstream `main` when the installed target is older.

## Current implementation-reference baseline

At handoff time:

- Hyprland upstream/reference: v0.56.2; Arch package currently 0.56.2-3.
- Quickshell: 0.3.1-1.
- Neovim: current Arch package is 0.12.5-1; use NvChad starter-derived configuration.

Re-check the actual installed versions before implementation. Version drift is a revalidation trigger, not an automatic downgrade request.

## Core invariants

- Each physical monitor presents local workspaces `1..9`; backing Hyprland IDs remain hidden.
- Stable monitor bank mapping comes from the explicit host profile, not runtime monitor ordering.
- Quickshell owns bar/launcher/overview/notifications and shell-state mutual exclusion.
- Hyprland owns physical keybindings, compositor policy, application-window placement, workspaces, special workspace scratchpad, and compositor blur/layer treatment.
- Scratchpad is one session-scoped Neovim instance in a named Hyprland special workspace with a dedicated Ghostty application identity.
- The bar is ~28 logical px, per monitor, and disappears with its exclusive zone on true fullscreen for that monitor.
- Launcher searches applications and windows; commands exist only under `>`.
- Overview is current-monitor-only 3x3 local workspaces, not classic MRU Alt+Tab.
- No control center, dock, tray, notification history, clipboard manager, session restoration, custom daemon, generic provider system, or app-placement automation in v1.
- macOS 27 is the design target for hierarchy/material/motion character, not Apple chrome/assets.
- Tokyo Night-derived high-contrast colors remain the project palette direction.
- Inter for Quickshell UI; JetBrains Mono Nerd Font for Ghostty/NvChad.
- Use plain Git + GNU Stow.

## Workstation/bootstrap invariants

- Pacman owns the OS-integrated workstation surface.
- AUR is explicit and limited; use Paru for the initial `visual-studio-code-bin` and `claude-code` exceptions.
- mise owns Node LTS/pnpm; uv owns Python project environments; rustup owns Rust toolchains.
- OpenCode and Codex come from Pacman; Pi from npm under mise Node.
- Zsh + restrained Oh My Zsh, no heavyweight prompt framework.
- NvChad is starter-derived and tracked in the dotfiles repo; bootstrap does not clone over it.
- `bootstrap` establishes missing state; `doctor` observes only; `update` deliberately advances external software.
- Never use `pacman -Sy` as a setup/dry-run shortcut.
- Never use Stow `--adopt` automatically.
- Do not configure credentials or secrets.

## Suggested implementation order

This is sequencing guidance, not a ticket decomposition:

1. Repository/Stow/package-manifest foundation and static tooling.
2. Bootstrap/doctor/update command skeletons and dry-run behavior.
3. Zsh/Git/Ghostty/NvChad workstation configuration.
4. Host-profile contract and Hyprland Lua core policy.
5. Quickshell foundation, theme tokens, per-monitor bar.
6. Launcher.
7. Overview.
8. Scratchpad.
9. Notifications/media/lock/screenshots.
10. macOS-27 visual calibration on the real compositor.
11. Full real-machine validation including fullscreen, monitor routing, hotplug, reloads, scratch close/reopen, package/runtime checks.

## Real-machine validation is required

Do not claim completion solely from static/QML/Lua checks. Validate under the actual Arch/Hyprland session, especially:

- both/all monitors and local workspace banks;
- cross-monitor focus/move behavior;
- send-without-follow;
- launcher focus over fullscreen;
- per-monitor bar fullscreen behavior/exclusive zone;
- special workspace scratch lifecycle and monitor movement;
- Quickshell layer placement and blur;
- notification actions/dismissal;
- monitor disconnect/reconnect;
- config reload behavior;
- idle CPU/GPU and unexpected continuous repaint;
- visual density/material/motion against the supplied macOS 27 design skill and visual baseline.

## Preserve implementation simplicity

Prefer native Hyprland, Quickshell, Qt, standard Linux services, and explicit small configuration over scripts/daemons/state stores. If an apparent missing feature can be solved by the target runtime's native object model or dispatcher, do that before introducing a subprocess or custom service.

When a workaround is truly necessary, document the exact target-version issue and the condition under which it should be removed/retested.
