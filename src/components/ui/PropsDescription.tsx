import type { RootState } from '@/store'
import { useSelector } from "react-redux"

export default function PropsDescription() {
    const componentsData = useSelector((state: RootState) => state.component.propsData)

    if (!componentsData || componentsData.length === 0) {
        return null 
    }

    return (
        <div className="bg-background-primary font-primary">
            <div className="mb-6">
                <h1 className='mt-4 font-heading text-3xl font-bold'>Props</h1>
                <p className='mt-2 text-base text-text-primary/70 tracking-wide'>Add these props to each component</p>
            </div>
            {componentsData.map((component, componentIndex) => (
                <div key={componentIndex} className="mb-8">
                    {/* Responsive table wrapper */}
                    <div className="overflow-x-auto syntax-scroll rounded-md">
                        <table className="w-full border-collapse border border-border-primary text-sm md:text-base">
                            <thead>
                                <tr className="bg-background-primary">
                                    <th
                                        colSpan={4}
                                        className="border border-border-primary px-4 py-3 text-left text-text-primary font-bold text-base md:text-lg"
                                    >
                                        {component.componentName} Component
                                    </th>
                                </tr>
                                <tr className="bg-background-primary">
                                    <th className="border border-border-primary px-2 py-2 text-left text-text-primary font-semibold w-1/4 whitespace-nowrap">
                                        Prop Name
                                    </th>
                                    <th className="border border-border-primary px-2 py-2 text-left text-text-primary font-semibold w-2/4 whitespace-nowrap">
                                        Description
                                    </th>
                                    <th className="border border-border-primary px-2 py-2 text-left text-text-primary font-semibold w-1/6 whitespace-nowrap">
                                        Type
                                    </th>
                                    <th className="border border-border-primary px-2 py-2 text-left text-text-primary font-semibold w-1/6 whitespace-nowrap">
                                        Default Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {component.props.map((prop, propIndex) => (
                                    <tr key={propIndex} className="bg-background-primary hover:bg-gray-750">
                                        <td className="border border-border-primary px-2 py-2 text-text-primary/60 font-mono text-xs md:text-sm whitespace-nowrap">
                                            {prop.propName}
                                        </td>
                                        <td className="border border-border-primary px-2 py-2 text-text-primary/60 text-xs md:text-sm">
                                            {prop.description}
                                        </td>
                                        <td className="border border-border-primary px-2 py-2 text-text-primary/60 font-mono text-xs md:text-sm whitespace-nowrap">
                                            {prop.type}
                                        </td>
                                        <td className="border border-border-primary px-2 py-2 text-text-primary/60 font-mono text-xs md:text-sm whitespace-nowrap">
                                            {prop.defaultValue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>

    )
}
