# Adversarial audit — macOS 27 shell design skill

This audit tests whether the skill guides a capable implementation model toward macOS-27-like professional restraint without turning the shell into generic glassmorphism or overriding project behavior.

## Test 1 — Persistent 28px top bar

Question: Does the skill push the agent toward a floating rounded Waybar pill?

Expected routing:
- principles-and-layering
- materials-and-glass
- geometry-and-concentricity
- wayland-quickshell-translation

Skill catches:
- persistent bar is structural control/navigation;
- edge-spanning geometry is valid;
- material should be light/quiet;
- minimal edge separation is preferable to large shadow/glow;
- compact desktop density is appropriate.

PASS.

## Test 2 — Application/window launcher

Question: Does the agent produce a large glass dashboard with recommendations and decorative modules?

Expected routing:
- principles-and-layering
- materials-and-glass
- typography-and-density
- input-focus-search
- motion-and-feedback

Skill catches:
- launcher is bounded transient control surface;
- open should lead directly to focused search;
- result selection is distinct from input focus and hover;
- history/recommendations are optional product features;
- stronger material depth is acceptable, but decoration is not the purpose.

PASS.

## Test 3 — Workspace overview

Question: Does "macOS 27" make the agent render nine blurred glass cards?

Expected routing:
- principles-and-layering
- materials-and-glass
- wayland-quickshell-translation

Skill catches:
- workspace representations are spatial content;
- overview should use recession/veil and clear selection rather than applying glass indiscriminately;
- fullscreen surface should exist only while overview is active.

PASS.

## Test 4 — Notification toast

Question: Can the agent make a polished transient surface without excessive glow and motion?

Expected routing:
- materials-and-glass
- color-and-contrast
- motion-and-feedback

Skill catches:
- shallow transient elevation;
- semantic color only where needed;
- brief spatially coherent entrance/exit;
- static readable state while visible;
- more opaque fallback remains valid.

PASS.

## Test 5 — Neovim scratchpad

Question: Does the skill turn the editor into a huge transparent glass drawer?

Expected routing:
- principles-and-layering
- materials-and-glass
- wayland-quickshell-translation

Skill catches:
- editor is content;
- content remains opaque/near-opaque and high contrast;
- shell frame may carry restrained depth, but glass is not applied throughout content.

PASS.

## Test 6 — Tokyo-Night-derived project palette

Question: Does macOS design authority override the project's chosen palette?

Expected routing:
- color-and-contrast
- source-basis

Skill catches:
- project palette remains project authority;
- macOS guidance controls semantic use, hierarchy, and contrast rather than requiring Apple gray/blue values;
- accent remains sparse.

PASS.

## Test 7 — Agent reaches for SF Pro / SF Symbols

Question: Does the skill require Apple assets to achieve the target?

Expected routing:
- typography-and-density
- icons-and-assets

Skill catches:
- font is behavioral/typographic translation rather than asset copying;
- open shell symbol family is used;
- real application icons remain intact.

PASS.

## Test 8 — "Premium" animation pass

Question: Does an agent add spring motion, glows, animated blur, and idle shimmer?

Expected routing:
- motion-and-feedback
- performance-and-accessibility
- gotchas

Skill catches:
- every motion needs communicative purpose;
- pointer feedback is restrained;
- no animated blur;
- idle UI remains still;
- effects must survive reduced motion/transparency.

PASS.

## Test 9 — Exact Apple numbers are unknown

Question: Does the agent invent "official macOS" radius/shadow/blur numbers from memory?

Expected routing:
- source-basis
- geometry-and-concentricity
- materials-and-glass

Skill catches:
- exact representative values should be taken from current UI Kit/observation when materially needed;
- arbitrary third-party CSS numbers are not Apple authority;
- relational geometry is preferred over fake universal constants.

PASS.

## Test 10 — Skill changes product behavior to be more Mac-like

Question: Does the skill replace project keybindings, workspace model, launcher semantics, or controls with macOS conventions?

Result:
- SKILL explicitly preserves consuming-project authority;
- Apple shortcut/chrome conventions are not normative for Linux shell behavior;
- design skill affects presentation/interaction quality, not already-set product semantics.

PASS.

## Test 11 — Blur disabled or compositor fallback

Question: Does the hierarchy collapse if compositor blur is unavailable?

Expected routing:
- materials-and-glass
- performance-and-accessibility
- wayland-quickshell-translation

Skill catches:
- material remains legible through tint/surface separation;
- more opaque fallback is part of the same design;
- blur is supportive, not the only state/hierarchy mechanism.

PASS.

## Test 12 — Multi-monitor shell at idle

Question: Does aesthetic implementation impose permanent fullscreen/translucent repaint costs on each monitor?

Expected routing:
- wayland-quickshell-translation
- performance-and-accessibility

Skill catches:
- surface area should be proportional to visible UI;
- transient fullscreen surfaces exist only while active;
- idle shell should remain visually and computationally quiet.

PASS.

## Residual design work intentionally left to the project

The skill does not prescribe:

- project palette hex values;
- exact final Quickshell dimensions;
- exact outer corner radius values;
- exact shadow kernels/opacities;
- exact Hyprland blur values;
- exact animation durations/easing curves;
- project-specific icon mapping;
- product workflow, keybindings, workspace behavior, or feature set.

These should be visually calibrated against macOS 27 reference material and the actual target desktop rather than falsely branded as universal Apple constants.

## Audit result

PASS. The skill is sufficiently bounded to steer an implementation/design model toward macOS 27's current hierarchy, material discipline, density, state clarity, and motion character while preserving Linux-shell product authority and avoiding generic glassmorphism.
