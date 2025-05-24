const componentsData = [
    {
        componentName: "Button",
        props: [
            {
                propName: "variant",
                description: "The visual style variant of the button",
                type: "primary | secondary | danger",
                defaultValue: "primary",
            },
            {
                propName: "size",
                description: "Controls the size of the button",
                type: "small | medium | large",
                defaultValue: "medium",
            },
            {
                propName: "disabled",
                description: "Whether the button is disabled",
                type: "boolean",
                defaultValue: "false",
            },
            {
                propName: "onClick",
                description: "Function called when button is clicked",
                type: "() => void",
                defaultValue: "undefined",
            },
        ],
    },
    {
        componentName: "Input",
        props: [
            {
                propName: "placeholder",
                description: "Placeholder text for the input field",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "value",
                description: "Current value of the input",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "onChange",
                description: "Function called when input value changes",
                type: "(value: string) => void",
                defaultValue: "undefined",
            },
            {
                propName: "type",
                description: "HTML input type",
                type: "text | email | password | number",
                defaultValue: "text",
            },
            {
                propName: "required",
                description: "Whether the input is required",
                type: "boolean",
                defaultValue: "false",
            },
        ],
    },
    {
        componentName: "Modal",
        props: [
            {
                propName: "isOpen",
                description: "Controls whether the modal is visible",
                type: "boolean",
                defaultValue: "false",
            },
            {
                propName: "onClose",
                description: "Function called when modal should close",
                type: "() => void",
                defaultValue: "undefined",
            },
            {
                propName: "title",
                description: "Title text displayed in modal header",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "size",
                description: "Size of the modal dialog",
                type: "small | medium | large | fullscreen",
                defaultValue: "medium",
            },
        ],
    },
    {
        componentName: "Card",
        props: [
            {
                propName: "title",
                description: "Title text for the card",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "subtitle",
                description: "Subtitle text below the title",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "image",
                description: "Image URL to display in card",
                type: "string",
                defaultValue: "undefined",
            },
            {
                propName: "elevation",
                description: "Shadow depth of the card",
                type: "none | low | medium | high",
                defaultValue: "medium",
            },
            {
                propName: "clickable",
                description: "Whether the card responds to clicks",
                type: "boolean",
                defaultValue: "false",
            },
        ],
    },
]

export default function PropsDescription() {
    return (
        <div className="bg-background-primary font-primary">
            {componentsData.map((component, componentIndex) => (
                <div key={componentIndex} className="mb-8">
                    {/* Responsive table wrapper */}
                    <div className="overflow-x-auto rounded-md">
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
