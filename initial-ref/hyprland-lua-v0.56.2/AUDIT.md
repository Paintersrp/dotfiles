# Adversarial audit

This audit checks whether an implementation agent following the skill can implement the intended desktop architecture without predictable Hyprland-0.56.2 mistakes.

## 1. Per-monitor local 1–9 workspaces

**Challenge:** Two or more physical monitors must each appear to own local workspaces `1..9`, while Hyprland requires globally unique numeric IDs.

**Expected skill path:** host monitor identity → stable bank → deterministic backing ID → exact workspace ownership rule → UI decodes backing ID.

**Pass criteria:** no runtime monitor-ID bank assignment, no duplicated workspace IDs, no visible `101..109` leakage, no event-history database.

**Result:** PASS.

## 2. Focus local workspace

**Challenge:** `Super+3` on monitor B must open B's local 3 even if it has never existed.

**Expected:** compute bank/ID at keypress and use workspace focus dispatcher; do not rely on v0.56.2 `Monitor:set_workspace()` creating the missing workspace.

**Result:** PASS.

## 3. Send window without following

**Challenge:** `Super+Shift+3` sends the window to local 3 on the current monitor while the user stays put.

**Expected:** compute target from active monitor bank and use explicit no-follow/silent movement semantics.

**Result:** PASS.

## 4. Cross-monitor navigation

**Challenge:** ordinary HJKL must not leak across monitor edges; separate modified chords own cross-monitor focus/movement.

**Expected:** disable directional monitor fallback; use native monitor-direction focus/move primitives for the explicit cross-monitor chords.

**Result:** PASS.

## 5. Cross-monitor window destination

**Challenge:** moving right should send the window to the right monitor's currently visible workspace, not the same local slot number.

**Expected:** monitor-targeted move, not workspace-slot mirroring.

**Result:** PASS.

## 6. Scratchpad

**Challenge:** one persistent session-scoped Neovim instance should appear as a right-side floating drawer on whichever monitor invokes it.

**Expected:** named special workspace + dedicated Ghostty/app identity + native toggle + creation-on-empty first choice + Hyprland-owned float geometry.

**Result:** PASS, with real-machine lifecycle test intentionally required for close/reopen behavior.

## 7. Quickshell shortcut path

**Challenge:** launcher/overview toggles must not spawn a helper process per keypress.

**Expected:** Hyprland bind → native global shortcut → existing Quickshell process; IPC reserved for external/debug control.

**Result:** PASS.

## 8. Fullscreen bar behavior

**Challenge:** true fullscreen hides the bar only on the affected monitor and removes its reserved space; launcher can still overlay fullscreen.

**Expected:** Quickshell reacts to native Hyprland workspace fullscreen state; Hyprland owns overlay/layer policy; no duplicated Lua fullscreen state.

**Result:** PASS.

## 9. macOS-like material integration

**Challenge:** launcher/bar need compositor blur without coupling visual QML internals to Hyprland.

**Expected:** stable layer namespace; Hyprland blur/rule; QML tint/geometry; one owner for entrance animation.

**Result:** PASS.

## 10. Reload

**Challenge:** config reload occurs while workspaces/scratchpad exist.

**Expected:** local Lua policy reconstructs from host profile/current compositor state; no essential callback-history state.

**Result:** PASS.

## 11. Monitor hotplug

**Challenge:** a configured monitor disappears and later returns.

**Expected:** native Hyprland fallback first; bank remains host-derived; no speculative restoration daemon; regression test on real hardware.

**Result:** PASS.

## 12. Old training-data contamination

**Challenge:** agent remembers hyprlang `.conf`, old `hyprctl dispatch workspace 3`, or current-`main` Lua behavior.

**Expected:** source-basis/stub hierarchy rejects unverified syntax/API.

**Result:** PASS.

## 13. Event-loop misuse

**Challenge:** agent wants to call shell commands or poll inside a key callback.

**Expected:** callback guardrails prohibit blocking work and prefer native state/dispatch.

**Result:** PASS.

## 14. Rule mismatch

**Challenge:** scratchpad float rule fails after terminal title changes.

**Expected:** stable initial application identity, inspect live client identity before broadening rule.

**Result:** PASS.

## Deliberate non-goals / unresolved runtime calibration

The skill does not pretend to prove these before the actual Arch/Hyprland machine exists:

- exact physical monitor identifiers;
- exact scratchpad dimensions and offsets;
- exact blur/pass/tint visual values;
- special-workspace close/reopen lifecycle on the target runtime;
- monitor unplug/replug UX on the user's actual topology;
- whether a target-version upstream bug requires a temporary workaround.

These are validation/calibration tasks, not missing architecture.

## Audit conclusion

The skill is sufficient to ground an implementation agent in Hyprland v0.56.2 Lua without making project-specific product decisions or relying on old Hyprland configuration folklore.
