# Six Latest Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show one featured story and six Latest Stories on the homepage when seven valid feed items are available.

**Architecture:** Keep the existing homepage split between the first featured item and the remaining latest items. Increase only the normalization cap so the homepage receives seven posts; the existing `posts.slice(1)` and responsive grid then render six latest cards without component restructuring.

**Tech Stack:** React, TypeScript, Vitest, Vite

## Global Constraints

- Preserve story order.
- Do not duplicate stories when fewer than seven valid items are available.
- Keep the carousel, About copy, and all other homepage sections unchanged.

---

### Task 1: Retain Seven Homepage Stories

**Files:**
- Modify: `src/lib/posts.ts:62`
- Test: `src/lib/posts.test.ts`

**Interfaces:**
- Consumes: `normalizePosts(rawPosts: unknown): Post[]`
- Produces: The same `Post[]` result, capped at seven valid items instead of six.

- [ ] **Step 1: Write the failing test**

Add this test inside the existing `normalizePosts` suite in `src/lib/posts.test.ts`:

```ts
it('retains seven valid posts for one featured and six latest stories', () => {
  const posts = Array.from({ length: 8 }, (_, index) => ({
    title: `Story ${index + 1}`,
    url: `https://example.com/story-${index + 1}`,
  }));

  const result = normalizePosts(posts);

  expect(result).toHaveLength(7);
  expect(result.map((post) => post.title)).toEqual([
    'Story 1',
    'Story 2',
    'Story 3',
    'Story 4',
    'Story 5',
    'Story 6',
    'Story 7',
  ]);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/lib/posts.test.ts`

Expected: FAIL because `normalizePosts` currently returns six items.

- [ ] **Step 3: Implement the minimal cap change**

In `src/lib/posts.ts`, change:

```ts
.slice(0, 6)
```

to:

```ts
.slice(0, 7)
```

- [ ] **Step 4: Run focused and full verification**

Run: `npm test -- src/lib/posts.test.ts`

Expected: PASS with four tests in `src/lib/posts.test.ts`.

Run: `npm test -- --run`

Expected: PASS with all test files and no failures.

Run: `npm run build`

Expected: exit code 0 and a completed Vite production build.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/lib/posts.ts src/lib/posts.test.ts
git commit -m "fix: balance latest stories grid"
```
