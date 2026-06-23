import React from 'react'
import { DocPage, H2, P, Code, UL, LI, Callout, CommandBlock, CodeBlock, Steps, Step, DocNav } from '@/components/ui/docs/DocKit'

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`

const cssImport = `@import "tailwindcss";`

const themeTokens = `@theme {
  --color-background-primary: #010101;
  --color-text-primary: #e0e0e0;
  --color-border-primary: #414040;
}`

const Installation: React.FC = () => (
    <DocPage
        eyebrow="Getting started"
        title="Installation"
        lead="HelioKit components are plain React + Tailwind v4. Set Tailwind up once, then add any component. The CLI can scaffold Tailwind for you, or you can wire it manually."
    >
        <H2>Prerequisites</H2>
        <UL>
            <LI>A React project (Vite or Next.js) with React 18 or 19.</LI>
            <LI>Node.js 18+.</LI>
            <LI>Tailwind CSS v4 (set up below).</LI>
        </UL>

        <H2>Automatic setup</H2>
        <P>
            The fastest path. <Code>heliokit init</Code> installs Tailwind v4 plus the runtime deps and wires the config
            for your framework.
        </P>
        <CommandBlock command="npx heliokit@latest init" />
        <P>
            It asks whether you're on Vite or Next.js, then installs <Code>tailwindcss</Code> (with{' '}
            <Code>@tailwindcss/vite</Code> or <Code>@tailwindcss/postcss</Code>), <Code>framer-motion</Code>, and{' '}
            <Code>lucide-react</Code>, and adds the <Code>@import "tailwindcss";</Code> line to your stylesheet.
        </P>

        <H2>Manual setup</H2>
        <P>Prefer to do it yourself? Three steps.</P>
        <Steps>
            <Step title="Install Tailwind v4 and runtime deps">
                <P>Vite:</P>
                <CodeBlock language="bash" code="npm install -D tailwindcss @tailwindcss/vite\nnpm install framer-motion lucide-react" />
                <P>Next.js:</P>
                <CodeBlock language="bash" code="npm install -D tailwindcss @tailwindcss/postcss postcss\nnpm install framer-motion lucide-react" />
            </Step>
            <Step title="Register the Tailwind plugin">
                <P>
                    On Vite, add the plugin to <Code>vite.config.ts</Code>:
                </P>
                <CodeBlock filename="vite.config.ts" code={viteConfig} />
            </Step>
            <Step title="Import Tailwind in your CSS">
                <P>
                    Add this to your global stylesheet (e.g. <Code>src/index.css</Code>):
                </P>
                <CodeBlock filename="src/index.css" language="css" code={cssImport} />
            </Step>
        </Steps>

        <H2>Theme tokens</H2>
        <P>
            HelioKit components are monochrome and read three CSS variables. Define them in your stylesheet inside a{' '}
            <Code>@theme</Code> block so Tailwind generates the <Code>*-primary</Code> utilities the components use:
        </P>
        <CodeBlock filename="src/index.css" language="css" code={themeTokens} />
        <Callout type="note" title="Light mode">
            Override the same tokens under a <Code>.light</Code> class to support light mode — toggling the class on{' '}
            <Code>&lt;html&gt;</Code> flips every component at once. A full theming guide is coming.
        </Callout>

        <H2>Add your first component</H2>
        <CommandBlock command="npx heliokit@latest add accordion" />
        <P>
            The file lands in your components folder. Import and use it — see the{' '}
            <a className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary" href="/docs/cli">
                CLI reference
            </a>{' '}
            for paths and options.
        </P>

        <DocNav
            prev={{ to: '/docs', title: 'Introduction' }}
            next={{ to: '/docs/cli', title: 'CLI Usage' }}
        />
    </DocPage>
)

export default Installation
