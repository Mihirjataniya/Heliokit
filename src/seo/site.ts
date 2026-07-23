/* ------------------------------------------------------------------ *
 * Central SEO / site config. Change SITE.url in ONE place when the
 * production domain is decided — every canonical, OG and sitemap URL
 * derives from it.
 * ------------------------------------------------------------------ */

export const SITE = {
  /** Production origin, no trailing slash. Swap when deployed. */
  url: 'https://heliokit.dev',
  name: 'HelioKit',
  /** Default <title> and the string appended to per-page titles. */
  defaultTitle: 'HelioKit — Animated, themeable React components you own',
  titleTemplate: '%s · HelioKit',
  description:
    'HelioKit is a CLI and copy-paste library of animated, themeable React components. Install with one command — the source drops straight into your repo. Zero runtime dependencies, Tailwind v4, React 19, MIT.',
  /** 1200×630 social card, served from /public. */
  ogImage: 'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/og-image.png',
  locale: 'en_US',
  author: 'Mihir Jataniya',
} as const

/** Absolute URL for a site-relative path. */
export const absUrl = (path = '/') =>
  `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
