import { Calendar } from './Calendar'
import type { CalendarEvent } from './Calendar'

/** Monday of the current week, so the demo is always populated. */
const weekStart = (() => {
  const today = new Date()
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7))
  return day
})()

const at = (dayOffset: number, hour: number, minute = 0) => {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date
}

const seedEvents: CalendarEvent[] = [
  { id: 'seed-1', title: 'Standup', start: at(0, 9, 30), end: at(0, 10), color: 'sky' },
  { id: 'seed-2', title: 'Design review', start: at(0, 11), end: at(0, 12, 30), color: 'violet', notes: 'Calendar component walkthrough' },
  { id: 'seed-3', title: 'Pairing — beam border', start: at(1, 10), end: at(1, 12), color: 'emerald' },
  { id: 'seed-4', title: 'Lunch', start: at(1, 13), end: at(1, 14), color: 'amber' },
  { id: 'seed-5', title: 'Roadmap sync', start: at(2, 9), end: at(2, 10, 30), color: 'violet' },
  { id: 'seed-6', title: 'Docs pass', start: at(2, 10), end: at(2, 11, 30), color: 'sky' },
  { id: 'seed-7', title: 'Release cut', start: at(3, 15), end: at(3, 16), color: 'rose' },
  { id: 'seed-8', title: 'Retro', start: at(4, 16), end: at(4, 17), color: 'emerald' },
]

export function CalendarDemo() {
  return (
    <div className="h-[520px] w-full sm:h-[620px]">
      <Calendar defaultEvents={seedEvents} scrollToHour={9} />
    </div>
  )
}

export default CalendarDemo
