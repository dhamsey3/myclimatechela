# Editorial Secondary Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace formal “journal” terminology and generic remote hero imagery with locally stored real photography and editorial About/Contact layouts.

**Architecture:** Preserve the current React routes, form endpoint, and shared shell. Add two local licensed photo assets plus a small attribution document, then recompose About and Contact using the existing editorial tokens and semantic HTML. Source-level Vitest assertions protect terminology, local imagery, credits, and removal of template treatments.

**Tech Stack:** React 18, TypeScript 5.6, Vite 6, Tailwind CSS 3, React Router 7, Lucide React, Vitest.

## Global Constraints

- No user-facing “journal” terminology.
- Store selected free-to-use Pexels photographs in `public/img/editorial/` and visibly credit each photographer with the original source link.
- Preserve About/Contact routes, existing content meaning, contact form fields, FormSubmit endpoint, loading state, and success state.
- No remote hero images, gradient headlines, decorative orbs, floating hero icons, thick bordered card stacks, or hover scaling.
- Keep semantic links, headings, form labels, visible focus, stable image ratios, and mobile stacking.

---

### Task 1: Terminology and licensed photo assets

**Files:**
- Create: `public/img/editorial/about-climate-action.jpg`
- Create: `public/img/editorial/contact-conversation.jpg`
- Create: `public/img/editorial/PHOTO_CREDITS.md`
- Modify: `src/components/ClimateHomepage.tsx`
- Modify: `src/components/BuyMeACoffee.tsx`

**Interfaces:**
- Produces two stable local image paths and source/photographer metadata used by the page components.

- [ ] **Step 1: Add failing source assertions**

Create `src/components/secondary-pages.test.ts` with `?raw` imports for Homepage, BuyMeACoffee, AboutPage, and ContactPage. Assert the concatenated source does not contain user-facing `journal`, About/Contact use `/img/editorial/` paths and Pexels credit links, and About/Contact contain no `images.pexels.com`, `images.unsplash.com`, `bg-gradient-to`, or blur-orb classes.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/secondary-pages.test.ts`

Expected: FAIL on journal terminology, missing local image paths/credits, and existing template treatments.

- [ ] **Step 3: Download and document the selected photographs**

Download the approved Pexels climate-action photograph for About and candid-conversation photograph for Contact. Save them at the exact paths above. Create `PHOTO_CREDITS.md` listing page placement, photographer, original Pexels page URL, and Pexels free-use source status.

- [ ] **Step 4: Replace homepage/support terminology**

Use `publication`, `stories`, or `work` in `ClimateHomepage.tsx` and `BuyMeACoffee.tsx`; remove all user-facing `journal` copy without changing actions.

### Task 2: Editorial About page

**Files:**
- Modify: `src/components/AboutPage.tsx`
- Test: `src/components/secondary-pages.test.ts`

**Interfaces:**
- Consumes `/img/editorial/about-climate-action.jpg` and its Pexels credit URL.
- Preserves `/contact` and `/` navigation actions plus About content meaning.

- [ ] **Step 1: Recompose About without template surfaces**

Build a `main#main-content` with: editorial introduction and local documentary photo/credit; open long-form purpose section; two-column vision/mission rule-separated section; compact values grid; one contact CTA; one restrained support card. Use serif headings, kicker labels, paper/card surfaces, thin rules, and no decorative icon bubble or remote image fallback.

- [ ] **Step 2: Run the focused source test**

Run: `npm test -- src/components/secondary-pages.test.ts`

Expected: About assertions pass; Contact assertions may still fail until Task 3.

### Task 3: Purposeful Contact page

**Files:**
- Modify: `src/components/ContactPage.tsx`
- Test: `src/components/secondary-pages.test.ts`

**Interfaces:**
- Consumes `/img/editorial/contact-conversation.jpg` and its Pexels credit URL.
- Preserves `https://formsubmit.co/info@myclimatedefinition.org`, form names, submission loading, and success view.
- Adds `submitError: string` for inline unsuccessful-response and network-error recovery.

- [ ] **Step 1: Recompose Contact and add inline failure recovery**

Build `main#main-content` with a compact editorial intro/photo/credit, then a desktop two-column region: simple contact-path list and the existing form. Remove the three-card connection row and support component. On submit, clear the prior error, throw on non-OK HTTP status, show a concise inline error with `role="alert"`, and keep the user's entered values for retry.

- [ ] **Step 2: Run focused tests and production verification**

Run: `npm test -- src/components/secondary-pages.test.ts`

Expected: all secondary-page assertions pass.

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: TypeScript and Vite exit with code 0.

### Task 4: Rendered QA and branch checkpoint

**Files:**
- Modify only files required by verified defects.

- [ ] **Step 1: Capture About and Contact at desktop and narrow widths**

Use the local Vite server and headless Chrome. Inspect hierarchy, image crop, attribution legibility, long-copy fit, form labels/actions, contact paths, mobile stacking, and absence of horizontal clipping.

- [ ] **Step 2: Correct defects test-first and rerun affected checks**

Tighten the closest source assertion, confirm it fails, apply the smallest correction, then rerun the focused test and build.

- [ ] **Step 3: Commit the complete refinement**

```bash
git add public/img/editorial src/components docs/superpowers/plans/2026-07-18-editorial-secondary-pages.md
git commit -m "feat: refine editorial secondary pages"
```

## Plan self-review

- All approved terminology, licensing, layout, accessibility, and error-state requirements map to Tasks 1–4.
- Asset paths and source links are explicit and consistent.
- No route, form endpoint, calculator behaviour, or unrelated page is changed.
