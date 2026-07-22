import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setInstallationSteps, setPropsData, setCurrentComponentData } from '@/store/slices/componentSlice'
import { useParams } from 'react-router-dom'
import { CodeandPreview } from '@/components/ui/CodeandPreview'
import InstallationGuide from '@/components/ui/InstallationGuide'
import PropsDescription from '@/components/ui/PropsDescription'
import { componentMap } from '@/componentMap'
import ComponentHeading from './ComponentHeading'
import kebabToPascal from '@/utils/Kebabtopascal'
import Seo from '@/seo/Seo'

const ComponentPreview: React.FC = () => {

  const { componentName } = useParams<{ componentName: string }>()


  const dispatch = useDispatch()
  const [PreviewComponent, setPreviewComponent] = useState<React.FC | null>(null)

  useEffect(() => {
    if (!componentName) return

    const loadData = async () => {
      try {
        const dataModule = await componentMap[componentName]()
        dispatch(setInstallationSteps({ cli: dataModule.cliSteps, manual: dataModule.manualSteps }))
        dispatch(setPropsData(dataModule.propsData))
        dispatch(setCurrentComponentData({
          componentName: kebabToPascal(componentName),
          description: dataModule.description,
          code: dataModule.code,
        }))
        setPreviewComponent(() => dataModule.PreviewComponent)
      } catch (error) {
        console.error(`Failed to load data for ${componentName}`, error)
      }
    }

    loadData()
  }, [componentName, dispatch])

  const label = componentName ? kebabToPascal(componentName) : 'Component'

  return (
    <div className='text-text-primary font-primary'>
      {componentName && (
        <Seo
          path={`/components/${componentName}`}
          title={label}
          description={`${label} — an animated, themeable HelioKit React component. Copy-paste the source or install it with one command. Props, code and live preview.`}
        />
      )}
      <ComponentHeading />
      <div className='my-4'>
        <CodeandPreview PreviewComponent={PreviewComponent} />
      </div>
      <div className='my-12'>
        <InstallationGuide />
      </div>
      <div className='my-12'>
        <PropsDescription />
      </div>
    </div>
  )
}

export default ComponentPreview
