# Editorial Secondary Pages Refinement

## Objective

Bring the About and Contact pages into the homepage's credible editorial system, preserve the original About wording, remove overly formal “journal” terminology, and replace generic symbolic stock imagery with locally stored, openly licensed documentary photographs.

## Terminology

- Replace “journal” with “publication,” “stories,” or “work” according to context.
- Use “publication” when referring to My Climate Definition as an organization or platform.
- Use “stories” when referring to its editorial output.
- Use “work” in support and contribution language.
- Do not introduce academic, newsroom, magazine, or journal positioning that the brand does not claim.

## Photography

Use real photographs from Pexels that are marked free to use. Download selected files into `public/img/editorial/` so production does not depend on third-party image delivery.

### About page

Use a documentary photograph showing people participating in collective climate action. The image should support the page's community, justice, and action themes without relying on forests, seedlings, globes, or staged eco props.

### Contact page

Use a candid photograph of people in conversation. The image should reinforce listening and exchange rather than depict generic email, technology, or hands holding a plant.

Each image includes a short visible credit beneath it with the photographer's name and a link to the original Pexels page. Credits open safely in a new tab.

## About page layout

- Use the shared navigation, paper surface, serif headings, kicker, restrained borders, and footer.
- Keep the original About introduction, description, vision, mission, value titles, value descriptions, and closing invitation verbatim; only layout and presentation may change.
- Keep the existing contact route.
- Replace the gradient hero and floating icon with a left-aligned editorial introduction and documentary image.
- Replace the large nested-card composition with open sections separated by rules.
- Present vision and mission as two simple columns.
- Present values as a numbered or icon-supported grid without card shadows, thick borders, or hover scaling.
- Keep one clear contact action near the end.
- Retain a single support card after the primary page value.

## Contact page layout

- Use the shared editorial shell and a compact introduction beside the conversation photograph.
- Replace the “ways to connect” card row with a simple bordered list of X, Medium, and direct-message paths.
- Keep the existing form fields, FormSubmit endpoint, loading state, and success state.
- Use a two-column desktop layout with contact paths beside the form; stack on mobile.
- Add an inline error state for non-success HTTP responses as well as network errors.
- Remove the secondary support prompt from Contact so the page has one purpose.

## Accessibility and responsiveness

- Use meaningful photo alt text and visible linked credits.
- Keep semantic headings, sections, links, form labels, and status messaging.
- Preserve visible focus styles and keyboard access.
- Images use stable aspect ratios, local paths, and deliberate cropping.
- Content stacks without clipping or horizontal overflow at narrow widths.

## Verification

- Add source assertions for removed gradients/remote image URLs and required local images/credits.
- Test contact failure state logic where practical.
- Run the full Vitest suite and production build.
- Capture and inspect About and Contact at desktop and narrow widths.

## Success criteria

- No user-facing “journal” terminology remains.
- About and Contact contain no remote hero image URLs, decorative background orbs, gradient headlines, or floating hero icons.
- Both pages use real locally stored photographs with visible source credits.
- About reads as a concise statement of purpose; Contact prioritizes reaching the team and completing the form.
- Existing navigation, form submission, success behaviour, and routes remain functional.
