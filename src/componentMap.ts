
export const componentMap: Record<string, () => Promise<any>> = {
  Accordion: () => import('@/datamodules/Accordion.data'),
}
