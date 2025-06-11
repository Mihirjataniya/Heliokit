  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";


  export function AccordionDemo() {
    return (
      <Accordion type="single" className="w-full max-w-2xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>What makes HelioKit flexible?</AccordionTrigger>
          <AccordionContent>
            HelioKit provides composable UI primitives with consistent styling and seamless animations. Ideal for scalable design systems.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is customization easy?</AccordionTrigger>
          <AccordionContent>
            Absolutely! Every component supports theming, style overrides, and responsive variants, empowering developers to shape the UI to their needs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Does it integrate with Tailwind CSS?</AccordionTrigger>
          <AccordionContent>
            Yes, HelioKit is built to work natively with Tailwind CSS. Enjoy rapid styling with utility-first classes, fully compatible with your workflow.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How does HelioKit ensure performance?</AccordionTrigger>
          <AccordionContent>
            HelioKit components are optimized for minimal bundle size and efficient rendering. Lazy loading and fine-grained control ensure snappy interactions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Is HelioKit accessible out of the box?</AccordionTrigger>
          <AccordionContent>
            Definitely. All components follow accessibility best practices with proper ARIA attributes and keyboard support, ensuring inclusivity by design.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    )
  }