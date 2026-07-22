import React from 'react'
import { Head } from 'vite-react-ssg'
import { SITE, absUrl } from './site'

export interface SeoProps {
  /** Page title, without the site suffix. Omit on the home page. */
  title?: string
  description?: string
  /** Site-relative path for the canonical/OG url, e.g. "/components". */
  path: string
  /** Site-relative OG image path. Falls back to the site default. */
  image?: string
  /** Set true on pages that shouldn't be indexed (e.g. trial/sandbox). */
  noindex?: boolean
  /** Extra JSON-LD structured data injected into <head>. */
  jsonLd?: Record<string, unknown>
}

/**
 * Per-route <head> tags. Rendered through vite-react-ssg's <Head>, so the
 * output is baked into the pre-rendered HTML (not just applied client-side).
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description = SITE.description,
  path,
  image,
  noindex,
  jsonLd,
}) => {
  const fullTitle = title
    ? SITE.titleTemplate.replace('%s', title)
    : SITE.defaultTitle
  const canonical = absUrl(path)
  const ogImage = absUrl(image ?? SITE.ogImage)

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={SITE.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Head>
  )
}

export default Seo
