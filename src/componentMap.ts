

export const componentMap: Record<string, () => Promise<any>> = {
  'accordion': () => import('@/datamodules/accordion.data'),
  'toasts': () => import('@/datamodules/toast.data'),
  'counter': () => import('@/datamodules/counter.data'),
  'image-reveal-marquee': () => import('@/datamodules/image-reveal-marquee.data'),
  'product-card': () => import('@/datamodules/product-card.data'),
  'nebulla-background' : () => import('@/datamodules/nebulla-background.data'),
  'brutal-pricing' : () => import('@/datamodules/brutal-pricing.data'),
  'glitch-card' : () => import('@/datamodules/glitch-card.data'),
  'glossy-dock' : () => import ('@/datamodules/glossy-dock.data'),
  'text-reflection' : () => import('@/datamodules/text-reflection.data'),
  'card-stack' : () => import('@/datamodules/card-stack.data'),
  'card-stack-3d' : () => import('@/datamodules/card-stack-3d.data'),
  'pixel-spotlight' : () => import('@/datamodules/pixel-spotlight.data'),
  'flip-form' : () => import('@/datamodules/flip-form.data'),
  'focus-highlight' : () => import('@/datamodules/focus-highlight.data'),
  'social-grid' : () => import('@/datamodules/social-grid.data'),
  'text-loader' : () => import('@/datamodules/text-loader.data'),
  'crystal-text' : () => import('@/datamodules/crystal-text.data'),
  'box-flip-text' : () => import('@/datamodules/box-flip-text.data'),
  'meteor-shower' : () => import('@/datamodules/meteor-shower.data')
}
