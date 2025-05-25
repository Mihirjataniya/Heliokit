import React from 'react'
import type { RootState } from '@/store'
import { useSelector } from "react-redux"

const ComponentHeading = () => {
    const componentName = useSelector((state: RootState) => state.component.currentComponentData?.componentName)
    const componentDescription = useSelector((state: RootState) => state.component.currentComponentData?.description)
    return (
        <div>
            <h1 className='mt-4 font-heading text-3xl font-bold'>{componentName}</h1>
            <p className='mt-2 text-base text-text-primary/70 tracking-wide'>{componentDescription}</p>
        </div>
    )
}

export default ComponentHeading
