# Editorial Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn My Climate Definition into a calm, story-first climate publication whose first viewport presents a credible featured article and an immediate path to reading.

**Architecture:** Keep the existing React/Vite routes and feed fetch, but extract feed normalization and fallback data into a pure module that can be tested independently. Recompose the homepage from the existing shared components, simplify navigation/footer semantics, and establish editorial design tokens in the global stylesheet. The About and Contact structures remain unchanged and inherit shared tokens.

**Tech Stack:** React 18, TypeScript 5.6, Vite 6, React Router 7, Tailwind CSS 3, Framer Motion, Lucide React, Vitest.

## Global Constraints

- Preserve existing routes, search behaviour, Medium feed ingestion, contact submission, and calculator formulae.
- Add no runtime dependency or remote font dependency.
- Use warm paper, dark ink, muted forest, and one clay accent; remove primary gradients, glass effects, animated background orbs, rotating icons, large coloured shadows, and excessive hover scaling.
- Latest stories must appear before the calculator and support prompt.
- Use semantic landmarks, anchors for destinations, buttons for actions, meaningful alt text, visible focus states, and no hover-only essential control.
- Use the first normalized feed item as the featured story and local fallback data when the feed is empty or fails.
- Keep changed surfaces responsive without horizontal overflow or clipped text.

---

## File structure

- Create `src/lib/posts.ts`: owns the `BlogPost` type, raw-feed normalization, fallbacks, and safe external URL resolution.
- Create `src/lib/posts.test.ts`: verifies feed normalization, fallback selection, and URL preservation.
- Modify `package.json`: adds the Vitest test command and development dependency.
- Modify `src/index.css`: defines the editorial colour/type system, global focus treatment, selection, and reusable editorial utilities.
- Modify `src/components/Navigation.tsx`: provides compact semantic navigation and the skip link.
- Modify `src/components/ClimateHomepage.tsx`: owns homepage composition and feed loading state, consuming `src/lib/posts.ts`.
- Modify `src/components/BuyMeACoffee.tsx`: provides a restrained, responsive support treatment.
- Modify `src/components/Footer.tsx`: uses semantic links and a compact editorial layout.
- Modify `src/components/CarbonCalculator.tsx`: removes gradient-heavy styling and adds explicit input association and estimate context.

### Task 1: Tested post normalization and fallback boundary

**Files:**
- Create: `src/lib/posts.ts`
- Create: `src/lib/posts.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `BlogPost`, `FALLBACK_POSTS`, `normalizePosts(rawPosts: unknown): BlogPost[]`, and `getPostsOrFallback(rawPosts: unknown): BlogPost[]`.
- `BlogPost` fields: `id: number`, `title: string`, `date: string`, `preview: string`, `image: string`, `mediumLink: string`.

- [ ] **Step 1: Add the test runner and write failing normalization tests**

Add `"test": "vitest run"` under `scripts` and `"vitest": "^2.1.8"` under `devDependencies`. Create `src/lib/posts.test.ts` with tests that assert:

```ts
import { describe, expect, it } from 'vitest';
import { FALLBACK_POSTS, getPostsOrFallback, normalizePosts } from './posts';

describe('normalizePosts', () => {
  it('normalizes feed fields without changing an external article URL', () => {
    const posts = normalizePosts([{
      title: 'A climate story',
      date: '2026-07-01T00:00:00.000Z',
      summary: 'A human-scale account.',
      image: '/img/slide2.png',
      external_url: 'https://medium.com/example/story',
    }]);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: 1,
      title: 'A climate story',
      preview: 'A human-scale account.',
      image: '/img/slide2.png',
      mediumLink: 'https://medium.com/example/story',
    });
    expect(posts[0].date).toContain('2026');
  });

  it('removes incomplete entries and caps the homepage feed at six stories', () => {
    const raw = Array.from({ length: 8 }, (_, index) => ({
      title: index === 0 ? '' : `Story ${index}`,
      date: '2026-07-01',
      permalink: `/stories/${index}`,
    }));

    expect(normalizePosts(raw)).toHaveLength(6);
    expect(normalizePosts(raw)[0].title).toBe('Story 1');
  });
});

describe('getPostsOrFallback', () => {
  it('returns local fallback stories for invalid or empty feed data', () => {
    expect(getPostsOrFallback(undefined)).toEqual(FALLBACK_POSTS);
    expect(getPostsOrFallback([])).toEqual(FALLBACK_POSTS);
  });
});
```

- [ ] **Step 2: Install dependencies and verify the tests fail for the missing module**

Run: `npm install`

Run: `npm test -- src/lib/posts.test.ts`

Expected: FAIL because `./posts` does not exist.

- [ ] **Step 3: Implement the pure post module**

Create `src/lib/posts.ts` with explicit raw-record guards, safe string selection, `Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' })`, local `/img/slideN.png` image fallbacks, a six-item cap, and two local fallback records. Return `FALLBACK_POSTS` when normalization produces no usable records.

- [ ] **Step 4: Verify the focused tests and full test command pass**

Run: `npm test -- src/lib/posts.test.ts`

Expected: 3 tests pass.

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit the feed boundary**

```bash
git add package.json package-lock.json src/lib/posts.ts src/lib/posts.test.ts
git commit -m "test: add resilient homepage post normalization"
```

### Task 2: Editorial visual system and accessible shared shell

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`
- Modify: `src/components/Navigation.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: existing React Router navigation, `SearchModal`, and `ThemeToggle`.
- Produces: `Navigation` with `#main-content` skip destination contract and `Footer` with semantic internal/external links.

- [ ] **Step 1: Add source-level shell assertions**

Create `src/components/editorial-shell.test.ts` that loads the component source as text through Vite's `?raw` import and asserts the navigation contains `Skip to content`, the footer does not contain clickable navigation `<span>`, and both components omit `bg-gradient-to` and logo rotation.

- [ ] **Step 2: Run the shell tests and verify they fail on the current template styling**

Run: `npm test -- src/components/editorial-shell.test.ts`

Expected: FAIL on missing skip link and retained gradient/rotation/clickable-span patterns.

- [ ] **Step 3: Implement the editorial tokens and global interaction treatment**

Update `src/index.css` to define warm light and ink-dark theme variables, serif `.font-editorial`, `.editorial-kicker`, `.editorial-rule`, global `focus-visible` outlines, skip-link positioning, body antialiasing, and restrained selection colours. Remove unused glass, glass-card, gradient-mesh, shimmer, and decorative animation utilities.

Update `tailwind.config.js` only where needed to expose the serif font family and named editorial colours through existing CSS variables.

- [ ] **Step 4: Rebuild navigation and footer semantics**

In `Navigation.tsx`, add `<a href="#main-content" className="skip-link">Skip to content</a>`, keep a compact sticky header, label `/` as `Stories`, use `Link` or `NavLink` for destinations, retain search/theme/mobile menu buttons, and remove entrance/logo-spin animations.

In `Footer.tsx`, replace clickable spans with `Link` and safe external anchors, use a simple border-top paper surface, retain social destinations and copyright, and keep one quiet back-to-top button.

- [ ] **Step 5: Verify shell tests and type-aware build**

Run: `npm test -- src/components/editorial-shell.test.ts`

Expected: all shell assertions pass.

Run: `npm run build`

Expected: TypeScript and Vite complete with exit code 0.

- [ ] **Step 6: Commit the shared editorial shell**

```bash
git add src/index.css tailwind.config.js src/components/Navigation.tsx src/components/Footer.tsx src/components/editorial-shell.test.ts
git commit -m "feat: establish editorial site shell"
```

### Task 3: Story-first homepage composition

**Files:**
- Modify: `src/components/ClimateHomepage.tsx`
- Modify: `src/components/SkeletonCard.tsx`

**Interfaces:**
- Consumes: `getPostsOrFallback(rawPosts)`, `FALLBACK_POSTS`, and `BlogPost` from `src/lib/posts.ts`.
- Produces: a `main#main-content` containing featured story, latest stories, editorial promise, calculator, support prompt, and footer in that order.

- [ ] **Step 1: Write failing homepage structure assertions**

Create `src/components/ClimateHomepage.test.ts` using a `?raw` import and assert the source contains `id="main-content"`, `Read featured story`, `Latest stories`, and `A quick estimate`; assert `Latest stories` occurs before `CarbonCalculator`, `CarbonCalculator` occurs before `BuyMeACoffee`, and the source omits `carouselImages`, `currentSlide`, `bg-gradient-to`, duplicated `<span>{post.date}</span>`, Twitter sharing, and LinkedIn sharing.

- [ ] **Step 2: Run the homepage assertions and verify failure**

Run: `npm test -- src/components/ClimateHomepage.test.ts`

Expected: FAIL because the carousel, decorative gradients, sharing controls, and old order remain.

- [ ] **Step 3: Recompose the homepage**

Rewrite `ClimateHomepage.tsx` around a single `main#main-content`. Fetch `./posts.json`, pass the response through `getPostsOrFallback`, and use `FALLBACK_POSTS` after fetch failure. Use `posts[0]` as featured and `posts.slice(1)` as latest. Build:

- a two-column featured-story hero with kicker, proposition, metadata, excerpt, safe anchor, and stable image;
- a latest-story section immediately below it with left-aligned header and responsive cards;
- a concise editorial-promise section;
- a quiet calculator section labelled `A quick estimate`;
- one support banner after the calculator.

Use local `/img/slide1.png` as every image-error fallback, remove the carousel and sharing handlers, and limit Framer Motion to one subtle entrance per major section.

- [ ] **Step 4: Simplify story skeletons**

Update `SkeletonCard.tsx` to match the new stable editorial card ratio and metadata/title/excerpt rhythm without shimmer gradients.

- [ ] **Step 5: Verify homepage tests and build**

Run: `npm test -- src/components/ClimateHomepage.test.ts`

Expected: all homepage assertions pass.

Run: `npm run build`

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 6: Commit the homepage composition**

```bash
git add src/components/ClimateHomepage.tsx src/components/ClimateHomepage.test.ts src/components/SkeletonCard.tsx
git commit -m "feat: make homepage story first"
```

### Task 4: Quiet utility and support surfaces

**Files:**
- Modify: `src/components/CarbonCalculator.tsx`
- Modify: `src/components/BuyMeACoffee.tsx`

**Interfaces:**
- Preserves: existing calculator categories, factors, input state, calculate/reset/recalculate actions, and Buy Me a Coffee destination.
- Produces: explicitly associated calculator labels/inputs and a responsive support banner without dominant gradients.

- [ ] **Step 1: Write failing utility-surface assertions**

Create `src/components/utility-surfaces.test.ts` with `?raw` imports. Assert the calculator input includes an `id` derived from `category.id`, its label has a matching `htmlFor`, the calculator includes `broad estimate`, the support banner can stack with `flex-col sm:flex-row`, and neither source contains `bg-gradient-to` or `hover:scale`.

- [ ] **Step 2: Run assertions and verify expected failure**

Run: `npm test -- src/components/utility-surfaces.test.ts`

Expected: FAIL on input association, disclosure copy, layout, and gradient/scale patterns.

- [ ] **Step 3: Restyle without changing behaviour**

In `CarbonCalculator.tsx`, use restrained borders/surfaces, add `id={`carbon-${category.id}`}` and matching `htmlFor`, include concise copy explaining that results are broad estimates based on averages, and retain all calculations and actions.

In `BuyMeACoffee.tsx`, remove orange/yellow gradients, heavy shadows, hearts as decoration, and scaling. Make the banner stack on mobile and use the forest accent for its one action.

- [ ] **Step 4: Verify utility tests and complete suite**

Run: `npm test -- src/components/utility-surfaces.test.ts`

Expected: all utility assertions pass.

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit utility polish**

```bash
git add src/components/CarbonCalculator.tsx src/components/BuyMeACoffee.tsx src/components/utility-surfaces.test.ts
git commit -m "feat: clarify climate utility surfaces"
```

### Task 5: Final responsive and production verification

**Files:**
- Modify only files required by defects found during verification.

**Interfaces:**
- Verifies the complete changed experience; introduces no new feature contract.

- [ ] **Step 1: Run static verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit code 0. If the repository's ESLint 9 command lacks a compatible flat configuration, record the exact configuration failure rather than treating it as a product-code failure.

Run: `npm run build`

Expected: TypeScript and Vite exit with code 0.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 2: Start the production preview**

Run: `npm run preview -- --host 127.0.0.1`

Expected: Vite prints a working local preview URL.

- [ ] **Step 3: Complete desktop and mobile visual QA**

At approximately 1440×900 and 390×844, verify: first viewport communicates publication purpose and featured story; navigation/mobile menu/search/theme work; story titles and metadata wrap; no horizontal overflow; latest stories precede calculator/support; calculator actions and results work; support banner stacks; focus is visible; image fallback does not collapse layout; About/Contact remain readable with inherited tokens.

- [ ] **Step 4: Correct discovered defects and repeat all affected checks**

For each defect, write or tighten the nearest source assertion first, run it to confirm failure, apply the smallest fix, then rerun the focused test and `npm run build`.

- [ ] **Step 5: Commit final QA corrections**

```bash
git add src package.json package-lock.json tailwind.config.js
git commit -m "fix: complete responsive editorial QA"
```

## Plan self-review

- Every design-spec requirement maps to Tasks 1–5.
- Feed normalization types and function names are consistent across producer and consumer tasks.
- The plan contains no deferred feature, remote font, new runtime dependency, or About/Contact structural redesign.
- Test-first steps precede every behavioural or structural implementation batch.
