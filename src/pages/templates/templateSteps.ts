import type { TemplateEntry } from '@/templates/registry'

/**
 * Integration steps for a template, generated from its registry metadata so a
 * new template needs data only. Two flows: CLI (init → add-template → add
 * components → render) and Manual (copy the page file → add components →
 * render). Shape mirrors the component-docs steps for a consistent renderer.
 */

export type CodeSnippet = { filename: string; language: string; code: string }
export type TemplateStep = { id: number; title: string; commands?: string[]; codeSnippets?: CodeSnippet[] }
export type TemplateSteps = { cli: TemplateStep[]; manual: TemplateStep[] }

export function buildTemplateSteps(entry: TemplateEntry): TemplateSteps {
    const base = entry.fileName.replace(/\.tsx$/, '')
    const usage = `import ${base} from '@/pages/templates/${base}'

export default function Page() {
  return <${base} />
}`

    const addComponents = entry.componentsUsed.length
        ? [`npx heliokit@latest add ${entry.componentsUsed.join(' ')}`]
        : []

    const cli: TemplateStep[] = []
    let id = 1
    if (!entry.selfContained) cli.push({ id: id++, title: 'Set up Tailwind', commands: ['npx heliokit@latest init'] })
    // add-template copies the page AND every component it uses in one go.
    cli.push({
        id: id++,
        title: entry.componentsUsed.length ? 'Add the template (pulls in its components too)' : 'Add the template',
        commands: [`npx heliokit@latest add-template ${entry.slug}`],
    })
    if (!entry.selfContained) cli.push({ id: id++, title: 'Install dependencies', commands: ['npm install framer-motion lucide-react'] })
    cli.push({ id: id++, title: 'Render the page', codeSnippets: [{ filename: `src/pages/${base}.tsx`, language: 'tsx', code: usage }] })

    const manual: TemplateStep[] = []
    let m = 1
    manual.push({ id: m++, title: 'Create the page file', codeSnippets: [{ filename: `src/pages/templates/${entry.fileName}`, language: 'tsx', code: entry.rawCode }] })
    if (addComponents.length) manual.push({ id: m++, title: 'Add the components it imports', commands: addComponents })
    manual.push({ id: m++, title: 'Render the page', codeSnippets: [{ filename: `src/pages/${base}.tsx`, language: 'tsx', code: usage }] })

    return { cli, manual }
}
