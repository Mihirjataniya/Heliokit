import { CodeandPreview } from '@/components/ui/CodeandPreview'
import { ChevronRight } from 'lucide-react'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Components: React.FC = () => {

    return (
        <div className='text-text-primary font-primary'>
            <h1 className='mt-4 font-heading text-3xl font-bold'>Accordion</h1>
            <p className='mt-2 text-base text-text-primary/70 tracking-wide'>Interactive headings that toggle the display of their content panels. Useful for showing related information without overwhelming the interface.</p>
            <div className='my-4'>
                <CodeandPreview />
            </div>

        </div>
    )
}

export default Components
