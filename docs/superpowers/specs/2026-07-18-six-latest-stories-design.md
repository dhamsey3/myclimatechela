# Six Latest Stories Design

## Goal

Keep the homepage story grid visually balanced by showing one featured story followed by six items in Latest Stories.

## Design

- Increase the normalized homepage feed limit from six to seven items.
- Continue using the first item as the featured story.
- Render the remaining six items in Latest Stories.
- Preserve the existing responsive grid: one column on mobile, two columns on medium screens, and three columns on large screens. This produces a balanced 3-by-2 desktop layout.
- Keep the existing story order, carousel, About copy, and all other homepage sections unchanged.

## Data and Edge Cases

- If the feed returns fewer than seven valid stories, show every available story after the featured item; do not duplicate content merely to fill the grid.
- Keep the existing empty state when no latest stories are available.

## Verification

- Add a test proving normalization retains up to seven valid posts.
- Run the complete test suite after implementation.
- Confirm the production build succeeds.
