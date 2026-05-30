# VietHay — UI Shell + Project Init (Hackathon)

## Scope
- Repo root becomes the Next.js app (Next.js 15 App Router, TypeScript, Tailwind, ESLint).
- shadcn/ui initialized and used for UI primitives.
- Implement a TRAE-inspired shell:
  - Warm Gradient logo with 2 antennas on the “V”
  - Minimal sidebar + main content area
  - Generation page with image upload
  - Video result page with large player + clear Download CTA
- Prepare for Vercel deployment (config + guidance).

## Non-Goals (This Phase)
- PixVerse integration (next phase).
- Auth, billing, real persistence, real analytics.

## Repo Structure
- Root Next.js app (single app):
  - `src/app` App Router
  - `src/components` for app components
  - `src/components/ui` for shadcn components
  - `src/lib` for utilities
- Legacy: rename existing `web/` to `web-legacy/` (reference only).
- Preserve existing root `README.md` (store Next template readme separately if needed).

## Branding
- Primary: warm orange-red gradient (friendly, premium, VN e-commerce fit).
- Surfaces: soft beige for “paper” feel.
- Text: deep ink for contrast.
- Dark mode: optional; if enabled, keep warm accent and switch surfaces to deep neutrals.

## Navigation
- Sidebar (minimal, TRAE-like):
  - Generate
  - Results
  - History
  - Templates
  - Settings
- Sidebar style:
  - Small icons, tight spacing, subtle borders
  - Strong active state highlight

## Pages
### Generate (`/generate`)
- Left: product assets + inputs
  - Image upload (dropzone, preview thumbnails)
  - Product name
  - Description
  - Style chips
- Right: live preview (placeholder for storyboard/prompt in this phase)
- Primary CTA: “Generate Video” (larger, high emphasis)

### Result (`/results/[id]`)
- Large video player (primary content)
- Primary CTA: “Download”
- Secondary actions: copy link, export captions
- Subtitles/timeline panel on the side

## Implementation Notes
- Use shadcn/ui tokens and Tailwind to express the warm palette (CSS variables for theme tokens).
- Keep files small and obvious; prioritize speed over abstraction.
- Avoid introducing services/DB until PixVerse phase.

## Acceptance Checks
- `npm run dev` works from repo root.
- Sidebar + routes render correctly.
- Generate page shows upload area + form + prominent CTA.
- Result page shows large player placeholder + clear Download button.
- Repo is deployable on Vercel with standard build settings.

