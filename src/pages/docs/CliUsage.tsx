import React from 'react'
import { DocPage, H2, H3, P, Code, UL, LI, Callout, CommandBlock, CodeBlock, DocNav } from '@/components/ui/docs/DocKit'

const rcExample = `{
  "framework": "Vite",
  "defaultPath": "src/components"
}`

const CliUsage: React.FC = () => (
    <DocPage
        eyebrow="Reference"
        title="CLI Usage"
        lead="The heliokit CLI copies components into your project and sets Tailwind up. Run it with npx — no global install needed."
    >
        <P>
            Every command runs through <Code>npx heliokit@latest</Code>, so you always get the current version. The three
            commands are <Code>init</Code>, <Code>add</Code>, and <Code>list</Code>.
        </P>

        <H2>init</H2>
        <P>Sets up Tailwind CSS v4 and installs the runtime dependencies for your framework.</P>
        <CommandBlock command="npx heliokit@latest init" />
        <P>It prompts for your framework (Vite or Next.js), then:</P>
        <UL>
            <LI>
                Installs <Code>tailwindcss</Code> with <Code>@tailwindcss/vite</Code> (Vite) or{' '}
                <Code>@tailwindcss/postcss</Code> + <Code>postcss</Code> (Next.js).
            </LI>
            <LI>
                Installs <Code>framer-motion</Code> and <Code>lucide-react</Code>.
            </LI>
            <LI>
                On Vite, adds the plugin to <Code>vite.config.ts</Code>. On Next.js, creates{' '}
                <Code>postcss.config.mjs</Code>.
            </LI>
            <LI>
                Adds <Code>@import "tailwindcss";</Code> to your stylesheet if it's missing.
            </LI>
        </UL>

        <H2>add</H2>
        <P>Copies a component into your project.</P>
        <CommandBlock command="npx heliokit@latest add <component>" />
        <P>For example:</P>
        <CommandBlock command="npx heliokit@latest add accordion" />
        <P>
            On first run it asks for your framework and destination folder, then offers to remember the choice. The
            component folder is copied to your destination root (default <Code>src/components</Code>).
        </P>
        <Callout type="warning" title="Use the component id">
            Pass the component's id as shown on its page — e.g. <Code>card-stack-3d</Code>, <Code>pixel-spotlight</Code>.
            An unknown name exits with <Code>Component "&lt;name&gt;" not found</Code>.
        </Callout>

        <H3>Destination resolution</H3>
        <UL>
            <LI>
                <strong className="text-text-primary">Vite</strong> → <Code>src/components</Code>.
            </LI>
            <LI>
                <strong className="text-text-primary">Next.js</strong> → <Code>src/components</Code> if a <Code>src/</Code>{' '}
                folder exists, otherwise <Code>components/</Code> at the project root.
            </LI>
            <LI>
                <strong className="text-text-primary">Custom</strong> → whatever path you enter (relative to the project
                root).
            </LI>
        </UL>

        <H2>list</H2>
        <P>Prints every component available to add.</P>
        <CommandBlock command="npx heliokit@latest list" />

        <H2>Configuration — .heliokitrc</H2>
        <P>
            When you let <Code>add</Code> remember your setup, it writes a <Code>.heliokitrc</Code> file to your project
            root. Later commands read it and skip the prompts.
        </P>
        <CodeBlock filename=".heliokitrc" language="json" code={rcExample} />
        <UL>
            <LI>
                <Code>framework</Code> — <Code>"Vite"</Code>, <Code>"Next.js"</Code>, or <Code>"Custom"</Code>.
            </LI>
            <LI>
                <Code>defaultPath</Code> — destination root for copied components.
            </LI>
        </UL>
        <Callout type="tip" title="Reset your setup">
            Delete <Code>.heliokitrc</Code> to be prompted again on the next <Code>add</Code>.
        </Callout>

        <DocNav prev={{ to: '/docs/installation', title: 'Installation' }} />
    </DocPage>
)

export default CliUsage
