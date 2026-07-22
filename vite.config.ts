import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
   resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Site build goes to dist-site/ so it never collides with the CLI bundle
  // that `npm run build` emits into dist/ for the published npm package.
  build: {
    outDir: 'dist-site',
  },
  // vite-react-ssg: pre-render each static route to its own index.html.
  // Dynamic routes (:slug, :componentName, /full previews) have no
  // getStaticPaths, so they stay client-rendered — the marketing/index
  // pages that matter for SEO are the ones emitted as static HTML.
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
  },
})
