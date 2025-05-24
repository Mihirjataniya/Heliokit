import { CodeandPreview } from '@/components/ui/CodeandPreview'
import InstallationGuide from '@/components/ui/InstallationGuide'
import PropsDescription from '@/components/ui/PropsDescription'
import React from 'react'

const Components: React.FC = () => {

    return (
        <div className='text-text-primary font-primary'>
            <h1 className='mt-4 font-heading text-3xl font-bold'>Accordion</h1>
            <p className='mt-2 text-base text-text-primary/70 tracking-wide'>Interactive headings that toggle the display of their content panels. Useful for showing related information without overwhelming the interface.</p>
            <div className='my-4'>
                <CodeandPreview />
            </div>
            <div className='my-12'>
                <div className="mb-6">
                    <h1 className='mt-4 font-heading text-3xl font-bold'>Installation</h1>
                    <p className='mt-2 text-base text-text-primary/70 tracking-wide'>Follow these steps to integrate HelioKit components into your project</p>
                </div>
                <InstallationGuide />
            </div>
            <div className='my-12'>
                <div className="mb-6">
                    <h1 className='mt-4 font-heading text-3xl font-bold'>Props</h1>
                    <p className='mt-2 text-base text-text-primary/70 tracking-wide'>Add these props to each component</p>
                </div>
                <PropsDescription />
            </div>
        </div>
    )
}

export default Components
