import { CalendarDemo } from '@/components/heliokit/calendar/CalendarDemo'
/* Source is pulled straight from the component so the docs can never drift. */
import calendarSource from '@/components/heliokit/calendar/Calendar.tsx?raw'

const calendarImport = `import { Calendar } from '@/components/heliokit/calendar/Calendar'
import type { CalendarEvent } from '@/components/heliokit/calendar/Calendar'`

const calendarJSXDemo = `const events: CalendarEvent[] = [
  { id: '1', title: 'Design review', start: new Date(2026, 6, 27, 11, 0), end: new Date(2026, 6, 27, 12, 30), color: 'violet' },
  { id: '2', title: 'Standup', start: new Date(2026, 6, 28, 9, 30), end: new Date(2026, 6, 28, 10, 0), color: 'sky' },
]

<div className="h-[620px] w-full">
  <Calendar
    defaultEvents={events}
    slotMinutes={15}
    hourHeight={56}
    scrollToHour={9}
    onEventsChange={(next) => console.log(next)}
  />
</div>`

export const PreviewComponent = CalendarDemo
export const code = `${calendarImport}\n\nexport function CalendarDemo() {\n  return (\n${calendarJSXDemo
  .split('\n')
  .map((line) => (line ? `    ${line}` : line))
  .join('\n')}\n  )\n}`
export const description =
  'A week-view calendar with drag-to-select time slots, draggable and resizable events, overlap-aware layout and a spring-animated composer modal for creating or editing an entry.'

export const cliSteps = [
  {
    id: 1,
    title: 'Add the component',
    commands: ['npx heliokit@latest add calendar'],
  },
  {
    id: 2,
    title: 'Import required modules',
    codeSnippets: [
      {
        filename: 'components/ExampleCalendar.tsx',
        language: 'tsx',
        code: calendarImport,
      },
    ],
  },
  {
    id: 3,
    title: 'Use the Calendar component',
    codeSnippets: [
      {
        filename: 'components/ExampleCalendar.tsx',
        language: 'tsx',
        code: calendarJSXDemo,
      },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: 'Install required dependencies',
    commands: ['npm install framer-motion lucide-react'],
  },
  {
    id: 2,
    title: 'Create the Calendar component manually',
    codeSnippets: [
      {
        filename: 'src/components/Calendar.tsx',
        language: 'tsx',
        code: calendarSource,
      },
    ],
  },
  {
    id: 3,
    title: 'Use the Calendar component in your code',
    codeSnippets: [
      {
        filename: 'src/components/ExampleCalendar.tsx',
        language: 'tsx',
        code: calendarJSXDemo,
      },
    ],
  },
]

export const propsData = [
  {
    componentName: 'Calendar',
    props: [
      {
        propName: 'events',
        description: 'Controlled event list. Pass together with onEventsChange to own the state yourself',
        type: 'CalendarEvent[]',
        defaultValue: 'undefined',
      },
      {
        propName: 'defaultEvents',
        description: 'Starting events when the calendar manages its own state. Ignored if events is passed',
        type: 'CalendarEvent[]',
        defaultValue: '[]',
      },
      {
        propName: 'onEventsChange',
        description: 'Called with the full next list after any create, edit, delete, move or resize',
        type: '(events: CalendarEvent[]) => void',
        defaultValue: 'undefined',
      },
      {
        propName: 'initialDate',
        description: 'Any date inside the week that should be shown first',
        type: 'Date',
        defaultValue: 'new Date()',
      },
      {
        propName: 'startHour',
        description: 'First hour rendered in the grid (0–23)',
        type: 'number',
        defaultValue: '0',
      },
      {
        propName: 'endHour',
        description: 'Last hour rendered in the grid (1–24)',
        type: 'number',
        defaultValue: '24',
      },
      {
        propName: 'slotMinutes',
        description: 'Snapping granularity for drag-select, move and resize, in minutes',
        type: 'number',
        defaultValue: '15',
      },
      {
        propName: 'hourHeight',
        description: 'Pixel height of one hour row — drives the whole vertical scale',
        type: 'number',
        defaultValue: '56',
      },
      {
        propName: 'weekStartsOn',
        description: 'First column of the week: 0 for Sunday, 1 for Monday',
        type: '0 | 1',
        defaultValue: '1',
      },
      {
        propName: 'scrollToHour',
        description: 'Hour the grid is scrolled to on mount',
        type: 'number',
        defaultValue: '8',
      },
      {
        propName: 'className',
        description: 'Extra CSS classes for the calendar shell',
        type: 'string',
        defaultValue: '""',
      },
    ],
  },
  {
    componentName: 'CalendarEvent',
    props: [
      { propName: 'id', description: 'Unique identifier for the event', type: 'string', defaultValue: '—' },
      { propName: 'title', description: 'Label shown on the event block', type: 'string', defaultValue: '—' },
      { propName: 'start', description: 'Start date and time. The day of this value decides the column', type: 'Date', defaultValue: '—' },
      { propName: 'end', description: 'End date and time. Clipped to midnight when it crosses into the next day', type: 'Date', defaultValue: '—' },
      {
        propName: 'color',
        description: 'Chip colour of the block',
        type: `"violet" | "sky" | "emerald" | "amber" | "rose"`,
        defaultValue: `"violet"`,
      },
      { propName: 'notes', description: 'Optional free text kept in the composer modal', type: 'string', defaultValue: 'undefined' },
    ],
  },
]
