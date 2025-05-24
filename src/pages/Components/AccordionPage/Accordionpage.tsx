import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setInstallationSteps, setPropsData, setCurrentComponentData } from '@/store/slices/componentSlice'
import { accordioncliSteps, accordionmanualSteps, accordionpropsData, accordioncode } from './Accordion.data'
import { AccordionDemo } from '@/components/heliokit/Accordion/Accordion'
import ComponentPreview from '@/components/ui/ComponentPreview'

const Accordionpage: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setInstallationSteps({ cli: accordioncliSteps, manual: accordionmanualSteps }))
    dispatch(setPropsData(accordionpropsData))
    dispatch(setCurrentComponentData({
      componentName: "Accordion",
      description: "Accordion component with customizable items and animation support.",
      code: accordioncode,
      preview: AccordionDemo, 
    }))
  }, [dispatch])

  return (
    <ComponentPreview />
  )
}

export default Accordionpage
