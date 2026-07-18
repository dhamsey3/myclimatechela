# Editorial Homepage Redesign

## Objective

Reposition My Climate Definition from a generic sustainability landing page into a calm, credible editorial publication about how climate affects everyday life. The redesign must foreground stories, improve trust, simplify the visual system, and preserve the existing React/Vite architecture and content feed.

## Audience and primary task

The primary audience is a curious general reader who wants relatable climate stories without specialist language. Their primary task is to understand the publication's perspective, identify an interesting story, and begin reading. Supporting tasks are learning about the mission, searching the archive, using the carbon calculator, contacting the team, and supporting the work.

The homepage must communicate within its first viewport:

- this is an independent climate publication;
- it connects climate issues to ordinary life;
- there is a specific featured story worth reading now;
- more recent stories are immediately available.

## Scope

This implementation batch covers:

- the shared colour, typography, focus, spacing, and surface system;
- desktop and mobile navigation;
- homepage information architecture and presentation;
- featured and latest-story cards;
- the placement and visual treatment of the calculator and support prompt;
- a simplified shared footer;
- loading and feed-error presentation for the homepage;
- responsive and keyboard-accessibility QA for changed surfaces.

The About and Contact page content and functionality remain intact. They inherit the shared visual tokens and navigation/footer but will not be structurally redesigned in this batch. Search behaviour, Medium feed ingestion, contact submission, routing, and calculator formulae remain functionally unchanged.

## Editorial direction

### Visual character

The experience should feel considered, human, and editorial rather than technological or campaign-like. The visual system uses warm off-white paper, dark ink, muted forest green, and a restrained clay accent. Gradients, glass effects, decorative background orbs, rotating icons, large coloured shadows, and excessive hover scaling are removed from the primary experience.

Headlines use a system serif stack to create editorial character without adding a network font dependency. Interface controls and body copy retain a clean system sans-serif stack. Type sizes remain fixed by breakpoint rather than scaling with the viewport.

### Imagery

Existing story images remain available, but images are presented as editorial assets tied to an article rather than as an uncaptioned carousel. Stable aspect ratios prevent layout shift. Alt text derives from the story title when the image represents the story.

## Homepage information architecture

1. Compact sticky navigation
2. Editorial hero with publication label, clear proposition, featured story, and featured image
3. Latest stories grid
4. Publication purpose statement / editorial promise
5. Carbon calculator in a quieter utility section
6. Single support prompt after readers have received value
7. Compact footer

The original four-image carousel remains, but it moves below the latest stories so it no longer delays access to reading. It uses a restrained editorial treatment, visible controls, slide-position dots, automatic advancement, pause on user interaction, and reduced-motion support. The support prompt moves below stories and the calculator so it follows delivered value.

## Components

### Navigation

- Keep the logo and publication name.
- Replace `Home` with `Stories` in the visible navigation while retaining the `/` route.
- Retain About, Contact, search, theme toggle, and the mobile menu.
- Use semantic navigation controls with visible active and focus states.
- Remove logo spinning and entrance choreography.

### Featured story

- Use the first successfully loaded feed item as the featured story.
- Present its image, date, title, excerpt, and one explicit `Read featured story` action.
- If no item is available, use the existing fallback story data rather than rendering an empty hero.
- External story links open safely in a new tab.

### Latest stories

- Present the remaining feed items in a responsive editorial grid.
- Each card has a stable image ratio, one date, title, short excerpt, and clear read action.
- The full card title/image area is keyboard-accessible through a semantic anchor.
- Social-sharing buttons are removed from cards; they distract from the primary reading action and are better placed on an article page.
- Loading uses restrained skeletons. A feed failure uses fallback content and does not expose a technical error.

### Editorial promise

A short, left-aligned section explains that the publication uses personal stories, definitions, and practical experiments to make climate change tangible. It must avoid broad claims about building a community unless supported by visible community features.

### Carbon calculator

The calculator remains on the homepage but appears after the stories. Its section clearly labels it as a quick estimate and notes that results use broad assumptions. This batch restyles its surrounding section; the underlying methodology is not changed.

### Support prompt

Use one homepage support prompt after the calculator. It should be quiet, text-led, and honest about what a contribution supports. The footer may link to support but should not repeat a second visually dominant donation button.

### Footer

- Use semantic links instead of clickable spans.
- Retain About, Contact, Medium, and social destinations.
- Reduce the gradient-heavy background and duplicated promotional language.
- Keep copyright and a compact back-to-top control.

## Interaction and motion

Motion is limited to subtle content entrance and state changes. No continuously moving hero decorations, image zoom overlays, rotating logos, or button scaling. Hover states use colour, underline, border, or small positional changes that do not cause layout instability. Reduced-motion preferences remain respected.

## Responsive behaviour

- Mobile navigation keeps search, theme, and menu controls as usable touch targets.
- The featured story stacks image above copy on narrow screens.
- Story grids collapse to one column without clipped titles or horizontal overflow.
- Metadata and actions wrap deliberately.
- The support prompt stacks vertically on narrow screens.
- No essential control is revealed only on hover.

## Accessibility

- Preserve semantic `header`, `nav`, `main`, `section`, and `footer` landmarks.
- Provide a visible skip-to-content link.
- Use anchors for destinations and buttons for actions.
- Ensure visible `:focus-visible` treatment across controls.
- Use meaningful image alt text and empty alt text only for decorative images.
- Do not rely on colour alone for active or selected states.
- Carousel controls remain visible and keyboard reachable, slide changes are labelled, and reduced-motion users do not receive automatic advancement.

## Data and failure handling

The homepage continues to fetch `./posts.json` on mount. Feed items are normalized once into the existing `BlogPost` shape. The first item becomes featured and the next items become latest stories. A failed or empty response uses the local fallback stories. Image failures use a local bundled image rather than a remote third-party URL.

## Verification

- Run TypeScript and the production Vite build.
- Run lint if the configured ESLint command is operational.
- Verify the homepage at desktop and mobile widths in a browser once dependencies are available.
- Check navigation, featured/latest story links, search opening, theme toggle, calculator input/results/reset, support link, and mobile menu.
- Check keyboard order, visible focus, long titles, image failures, loading state, and fallback feed state.

## Success criteria

- A visitor can identify the site as an editorial climate publication and choose a story within the first viewport.
- Latest stories appear before the calculator and donation prompt.
- The homepage contains no oversized decorative carousel before the stories, animated background orbs, gradient headline, duplicated publication dates, or hover-only reading affordance.
- The visual system uses a restrained editorial palette and consistent surfaces.
- Changed components remain responsive, semantic, keyboard accessible, and build successfully.
