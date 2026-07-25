# HelioKit

Animated React components you copy into your own repo, plus the CLI that copies them and the docs site that shows them off.

There is no runtime package to depend on. `npx heliokit add <name>` drops plain `.tsx` files into your project and gets out of the way — you own the code from the first paste.

- **Stack:** React 19, TypeScript, Tailwind CSS v4, framer-motion, lucide-react
- **npm package:** [`heliokit`](https://www.npmjs.com/package/heliokit) (CLI only)
- **Site:** built with `vite-react-ssg`, deployed on Vercel

---

## Using the components in your project

```bash
# One-time: install Tailwind v4 + framer-motion + lucide-react and wire up the config
npx heliokit@latest init

# Add components
npx heliokit@latest add calendar accordion meteor-shower

# See what's available
npx heliokit@latest list
```

`init` asks whether you're on Vite or Next.js, installs the dependencies, patches `vite.config.ts` (or writes `postcss.config.mjs`), and makes sure `@import "tailwindcss";` is in your CSS entry.

`add` asks once where components should live and remembers the answer in `.heliokitrc`, then copies each component folder there.

### Full-page templates

```bash
npx heliokit@latest list-templates
npx heliokit@latest add-template saas-landing-page
```

Templates copy into `src/pages/templates/` and pull in the components they import automatically.

| Template | Components it uses |
| --- | --- |
| `saas-landing-page` | meteor-shower, crystal-text, text-reflection, focus-highlight, accordion, brutal-pricing |
| `financial-overview` | — |
| `kanban-board` | — |

---

## Components

24 components live in `src/components/heliokit/`:

`accordion` · `box-flip-text` · `brutal-pricing` · `calendar` · `card-stack` · `card-stack-3d` · `counter` · `crystal-text` · `flashlight` · `flip-form` · `focus-highlight` · `glitch-card` · `glossy-dock` · `glossy-script` · `image-reveal-marquee` · `liquid-plasma` · `meteor-shower` · `nebula-background` · `pixel-spotlight` · `product-card` · `social-grid` · `text-loader` · `text-reflection` · `toast`

Most folders hold the component plus a `*Demo.tsx` that the docs preview renders — `flashlight` and `glossy-script` are installable but have no docs page yet. Components are self-contained: framer-motion and lucide-react are the only imports beyond React, and colours come from theme tokens rather than hard-coded values.

---

## Running this repo

```bash
npm install
npm run dev          # docs site on http://localhost:5173 (--host, so LAN devices can reach it)
npm run lint
npm run build:site   # static site -> dist-site/
npm run preview      # serve dist-site/
npm run build        # CLI bundle -> dist/ (tsup)
```

Deployment is driven by `vercel.json`: `npm run build:site` into `dist-site`, with a catch-all rewrite so client-side routes resolve.

Publishing the CLI: `npm run release` (patch version bump → `tsup` build → `npm publish --access public`).

### Layout

```
src/
  cli/index.ts              CLI: add, add-template, list, list-templates, init
  components/
    heliokit/<slug>/        the components themselves — this is what the CLI copies
    ui/                     docs-site chrome (Navbar, Sidebar, ComponentPreview, …)
  datamodules/<slug>.data   per-component docs payload: preview, code, install steps, props
  componentMap.ts           slug -> lazy import of the data module
  pages/                    Home, Components, docs/, templates/, Themes, Trial
  templates/registry.tsx    template metadata + raw source via ?raw
  docs/registry.tsx         doc pages (/docs, /docs/installation, /docs/cli)
  routes/                   vite-react-ssg route tree
  store/                    Redux Toolkit slice backing the docs preview
  index.css                 Tailwind v4 @theme tokens
public/previews/            component thumbnails (see the README in there)
```

`@/` is aliased to `src/`.

### Theming

Everything reads CSS variables declared in `src/index.css`:

```css
@theme {
  --color-background-primary: #010101;
  --color-text-primary: #e0e0e0;
  --color-border-primary: #414040;
  /* fonts: --font-logo, --font-navbar, --font-heading, --font-primary */
}
```

A `.light` class overrides the three colours. Components should use `bg-background-primary`, `text-text-primary` and `border-border-primary` so both themes work without a `dark:` variant anywhere.

Site chrome reserves `z-50` for the navbar — keep component overlays and modals below it.

---

## Adding a component

The CLI finds components by directory name, so copying is automatic. The docs site needs five registrations:

1. `src/components/heliokit/<slug>/<Name>.tsx` and `<Name>Demo.tsx`
2. `src/datamodules/<slug>.data.ts` exporting `PreviewComponent`, `code`, `description`, `cliSteps`, `manualSteps`, `propsData`
3. `src/componentMap.ts` — slug → `() => import('@/datamodules/<slug>.data')`
4. `src/components/ui/Siebar.tsx` — sidebar entry (alphabetical)
5. `src/pages/Components.tsx` — grid entry with blurb + tag

Optionally add the slug to the `COMPONENTS` ticker in `src/pages/Home.tsx`, and upload a thumbnail for the components grid (it falls back to a monogram tile if none exists).

For the manual-install snippet, import the component source with `?raw` instead of pasting it into a template literal:

```ts
import calendarSource from '@/components/heliokit/calendar/Calendar.tsx?raw'
```

That keeps the docs from drifting out of sync with the component.

---

## License

MIT © Mihir Jataniya
