# MyClimateDefinition.org — Redesign Roadmap

This document outlines a phased rollout for the new visual language and UI/UX improvements introduced in `public/css/modern.css` and `public/js/ui-enhancements.js`.

## Phases

Phase 0 — Prep (1 day)
- Add new CSS variables and component stylesheet (`public/css/modern.css`).
- Add `public/js/ui-enhancements.js` for progressive micro-interactions.
- Keep original CSS/JS in place and make the new theme opt-in via `body.mc-theme-v2`.

Phase 1 — Header & Hero (1–2 days)
- Implement split hero (`.mc-hero`) and compact header refinements.
- Validate keyboard navigation and mobile stacking.

Phase 2 — Posts & Cards (1–2 days)
- Improve `.hcard` variants and add responsive `.mc-grid` card layout.
- Add chip filters and accessible search enhancements.

Phase 3 — Post layout & TOC (2–3 days)
- Introduce single-post layout with large hero, floating share, and TOC.
- Add inline interactive components (callouts, data art).

Phase 4 — CTA & experiments (1 day)
- Implement CTA band and experiments spotlight; wire subscription endpoint.

Phase 5 — Polish & Performance (1–2 days)
- Image optimization (AVIF/WebP, srcset), Lighthouse tuning, font loading improvements.
- Accessibility audit and fixes (contrast, focus, aria attributes).

Phase 6 — Launch & iterate
- Flip the opt-in class to fully enable the theme after testing.

## QA Checklist
- Lighthouse (mobile & desktop) score targets: Performance >= 80; Accessibility >= 90.
- Keyboard navigation: all interactive elements reachable and visible focus.
- Reduced motion: animations pause when OS-level or user-level preference set.
- Contrast checks for all text and UI states.
- Cross-browser verification (Chrome, Firefox, Safari) and mobile viewport testing.

## Two alternative design directions

1) Minimalist + Data-Driven
- Pros: authoritative, fast, great for research content. Uses compact typography and dense data visuals.
- Cons: less emotional storytelling; may feel cold for general audiences.

2) Immersive Narrative
- Pros: creates a strong emotional connection for long-form stories; cinematic visuals and full-bleed media.
- Cons: heavier to implement and optimize; more risk to performance on mobile.

Recommended approach: Modular + card-based (the current implementation) — it balances storytelling, experimentation, and performance while allowing incremental rollout.

---
To preview the new theme: add `class="mc-theme-v2"` to the `<body>` element in `public/index.html` and `public/posts.html`.

If you'd like, I can open a small PR based on this branch with incremental commits for each phase.
