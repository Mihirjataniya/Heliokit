

export const componentMap: Record<string, () => Promise<any>> = {
  'accordion': () => import('@/datamodules/accordion.data'),
  'toasts': () => import('@/datamodules/toast.data'),
  'counter': () => import('@/datamodules/counter.data'),
  'image-marquee': () => import('@/datamodules/image-marquee.data'),
  'product-card': () => import('@/datamodules/product-card.data')
}
