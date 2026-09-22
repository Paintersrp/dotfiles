# macOS 27 Shell Design Skill

Use this skill when designing, implementing, reviewing, or refining a **desktop shell** whose visual and interaction target is **macOS 27**, especially a Wayland/Quickshell shell.

This skill translates macOS 27 design principles to a non-Apple desktop environment. It is **not** a license to copy Apple assets, reproduce Apple application chrome, or turn unrelated product decisions into "Mac conventions." Preserve the consuming project's explicit workflow, product behavior, palette, keybindings, and scope.

## Target and authority

Design target:

- macOS 27 visual and interaction language
- current Apple Human Interface Guidelines
- current macOS 27 Apple Design Resources / UI Kit
- WWDC26 macOS design guidance

Use this authority order:

1. Apple's macOS 27 UI Kit / current Apple Design Resources for representative visual components and proportions;
2. current Apple Human Interface Guidelines;
3. WWDC26 sessions describing macOS 27 and current design-system behavior;
4. direct observation of macOS 27 system UI and Apple applications when textual guidance is insufficient;
5. high-quality third-party Mac apps as precedent only;
6. third-party "macOS design systems" as candidate synthesis only, after verification.

Do not treat arbitrary CSS values, old macOS screenshots, previous Liquid Glass behavior, third-party app conventions, or model memory as macOS 27 authority.

## Mission

Reproduce the **design qualities** of macOS 27:

- content-first hierarchy;
- compact professional desktop density;
- restrained, functional use of Liquid-Glass-like material;
- precise alignment and related geometry;
- sparse semantic color;
- strong dark-mode legibility;
- clear focus, selection, hover, and active/inactive states;
- precise mouse and keyboard interaction;
- brief, purposeful, spatially coherent motion;
- polished depth without decorative glassmorphism.

Do **not** reproduce Apple-specific platform chrome or restricted assets merely to look Mac-like.

## Operating procedure

1. Identify the surface and its product purpose before styling it.
2. Classify it as **content**, **persistent control/navigation**, or **transient control/navigation**.
3. Read only the references relevant to that surface.
4. Establish information hierarchy and interaction states before material effects.
5. Use the least visual machinery needed to establish layer, focus, and selection.
6. Check the design at desktop density, with mouse and keyboard, and in an idle state.
7. Check that the interface remains understandable with blur/transparency reduced and motion removed.
8. When implementing on Wayland/Quickshell, use the translation guidance rather than attempting to clone Apple's proprietary renderer.

## Routing

Read:

- `references/source-basis.md` when a claim is presented as "Apple/macOS 27" authority.
- `references/principles-and-layering.md` for content-vs-control hierarchy and overall visual character.
- `references/materials-and-glass.md` for Liquid Glass, tint, translucency, depth, and when not to use glass.
- `references/geometry-and-concentricity.md` for radii, nested geometry, spacing relationships, and structural surfaces.
- `references/typography-and-density.md` for compact desktop scale, hierarchy, alignment, and font substitution.
- `references/color-and-contrast.md` for sparse accent use, dark appearance, semantic color, and state hierarchy.
- `references/input-focus-search.md` for pointer/keyboard behavior, hover, focus, selection, search, and transient surfaces.
- `references/motion-and-feedback.md` for animation, press feedback, spatial logic, and reduced motion.
- `references/wayland-quickshell-translation.md` for compositor blur, QML material construction, surfaces, masks, and implementation boundaries.
- `references/icons-and-assets.md` for icon discipline and non-Apple asset substitution.
- `references/performance-and-accessibility.md` for idle behavior, expensive effects, reduced transparency, and fallback behavior.
- `references/gotchas.md` for concise anti-patterns and common "Mac-like" design mistakes.

## Core guardrails

- **Content dominates.** Controls and navigation support content rather than competing with it.
- Treat Liquid Glass as a **functional layer**, not as a universal blur style.
- Do not use glass in content merely because translucency is possible.
- Prefer regular/tinted material character for text-rich controls; clear glass is exceptional.
- Do not encode a fixed blur/saturation recipe as "Liquid Glass."
- Use compact desktop density; resist touch-first sizing and web-dashboard spacing.
- Use accent color sparingly and semantically.
- Distinguish hover, keyboard focus, selection, pressed state, and active/inactive context.
- Avoid changing keyboard focus unexpectedly.
- Make search/transient UI immediately usable and easy to dismiss.
- Prefer one dominant transient interaction context at a time.
- Use motion only to explain state, location, continuity, or feedback.
- Mouse interaction should be precise and quieter than touch-oriented animation.
- Idle UI should be visually still unless ongoing activity genuinely needs representation.
- Use related/concentric nested geometry rather than unrelated radius constants.
- Establish depth with the minimum combination of tint, edge separation, diffusion, and shadow necessary.
- Do not copy traffic lights, title bars, Command glyphs, sidebars, or other Apple chrome when the product doesn't require them.
- Do not ship SF Pro or SF Symbols merely to imitate macOS. Reproduce their design qualities with appropriate open assets.
- Do not replace real application icons with generic monochrome symbols.
- On Wayland, prefer compositor background diffusion and bounded shell surfaces over screen-capture-based glass simulation.
- Never let "premium" become a justification for extra blur, glow, gradients, pills, or spring animation.

## Completion challenge

Before approving a macOS-27-inspired shell surface, ask whether it could still fail because it:

- looks like generic glassmorphism rather than a functional control layer;
- lets chrome compete with content;
- uses mobile/web scale on a desktop;
- depends on blur for basic legibility or state;
- confuses hover with selection or focus;
- uses accent color decoratively rather than semantically;
- stacks borders, shadows, glow, translucency, and gradients unnecessarily;
- applies unrelated corner radii to nested shapes;
- animates because animation "feels premium" rather than communicating something;
- continuously animates or repaints while idle;
- imitates Apple assets or platform chrome instead of translating the design principle;
- or violates explicit project behavior in order to be more Mac-like.

If yes, simplify or correct the design before calling it complete.
