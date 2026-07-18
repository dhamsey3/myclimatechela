# Carousel and Original About Copy Restoration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original About wording and the homepage's four sliding images without undoing the story-first editorial redesign.

**Architecture:** Keep the redesigned page shells and real credited photography. Replace only the rewritten About prose with the original source copy, and add a focused `StoryCarousel` component after Latest stories. The carousel owns slide/autoplay state and exposes visible, labelled controls.

**Tech Stack:** React 18, TypeScript 5.6, Framer Motion, Tailwind CSS 3, Lucide React, Vitest.

## Global Constraints

- Original About copy is authoritative and remains verbatim.
- Use the existing `/img/slide1.png` through `/img/slide4.png` assets.
- Carousel appears after Latest stories and before the editorial purpose section.
- Controls are always visible, keyboard reachable, and labelled.
- Automatic advancement stops after user interaction and is disabled when `prefers-reduced-motion: reduce` matches.
- No gradient overlays, hover-only controls, oversized shadows, or movement beyond slide transitions.

### Task 1: Original About copy restoration

**Files:**
- Modify: `src/components/AboutPage.tsx`
- Modify: `src/components/secondary-pages.test.ts`

- [ ] Add failing assertions for distinctive original sentences from the introduction, body, vision, mission, values, and closing invitation.
- [ ] Run `npm test -- src/components/secondary-pages.test.ts` and confirm failure on rewritten copy.
- [ ] Replace the rewritten About prose with the exact original strings while preserving the refined layout, local photograph, credit, routes, and support placement.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Accessible original-image carousel

**Files:**
- Create: `src/components/StoryCarousel.tsx`
- Create: `src/components/StoryCarousel.test.ts`
- Modify: `src/components/ClimateHomepage.tsx`
- Modify: `src/components/ClimateHomepage.test.ts`

- [ ] Add failing source assertions for all four original slide paths, visible previous/next controls, `aria-live`, reduced-motion detection, and homepage ordering after `Latest stories` but before `Our point of view`.
- [ ] Run the two focused tests and confirm failure because the component does not exist.
- [ ] Implement the four-slide carousel with five-second automatic advancement, visible controls, dots, semantic figure/image labels, pause after manual interaction, and reduced-motion autoplay suppression.
- [ ] Insert the carousel after Latest stories with a concise editorial heading.
- [ ] Run focused tests, full `npm test`, and `npm run build`.

### Task 3: Rendered QA and checkpoint

- [ ] Capture homepage and About at desktop and narrow widths.
- [ ] Verify image crop, controls, dots, text wrapping, original About copy, and no horizontal overflow.
- [ ] Correct verified defects test-first.
- [ ] Commit with `git commit -m "feat: restore original carousel and about copy"`.

## Plan self-review

- The plan restores only the two requested elements and preserves the approved redesign around them.
- Component ownership, order, autoplay conditions, and verification commands are explicit.
