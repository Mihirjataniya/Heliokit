import React from 'react'
import { DocPage, H2, P, Code, UL, LI, Callout, DocNav } from '@/components/ui/docs/DocKit'

const Introduction: React.FC = () => (
    <DocPage
        eyebrow="Getting started"
        title="Introduction"
        lead="HelioKit is a set of copy-paste React + Tailwind components — animated, accessible, and monochrome by default. No install, no lock-in: paste the file and ship."
    >
        <H2>What it is</H2>
        <P>
            HelioKit is not a dependency you import — it is source you own. Every component ships as a single,
            self-contained file you drop into your project. Add it with the CLI or copy the code by hand. Once it lands
            in your repo, it is yours to restyle, fork, or delete.
        </P>

        <H2>Why copy-paste</H2>
        <UL>
            <LI>
                <strong className="text-text-primary">No version lock.</strong> The component lives in your codebase, not
                in <Code>node_modules</Code>. Upgrades never break you.
            </LI>
            <LI>
                <strong className="text-text-primary">Plain Tailwind + props.</strong> Restyle by editing classes — no
                theme layer to fight.
            </LI>
            <LI>
                <strong className="text-text-primary">Monochrome by default.</strong> Components read from CSS tokens
                (<Code>text-primary</Code>, <Code>background-primary</Code>, <Code>border-primary</Code>), so they adapt
                to your palette and light/dark.
            </LI>
            <LI>
                <strong className="text-text-primary">Animated &amp; accessible.</strong> Motion via Framer Motion, with
                sensible keyboard and ARIA behaviour baked in.
            </LI>
        </UL>

        <H2>What's inside</H2>
        <P>
            The library spans layout, cards, text effects, backgrounds, forms, feedback, and navigation — from an{' '}
            <Code>Accordion</Code> to a <Code>Meteor Shower</Code> backdrop. Browse them all on the{' '}
            <a className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary" href="/components">
                Components
            </a>{' '}
            page; each has a live preview, install steps, and a props table.
        </P>

        <Callout type="tip" title="Two ways to add a component">
            Use the CLI (<Code>npx heliokit@latest add &lt;name&gt;</Code>) to copy a component into your project, or
            open any component page and copy the source manually. Both paths give you the same file.
        </Callout>

        <H2>Requirements</H2>
        <UL>
            <LI>React 18 or 19</LI>
            <LI>Tailwind CSS v4</LI>
            <LI>
                Most components use <Code>framer-motion</Code> and <Code>lucide-react</Code> — the CLI installs these for
                you.
            </LI>
        </UL>

        <DocNav next={{ to: '/docs/installation', title: 'Installation' }} />
    </DocPage>
)

export default Introduction
