import GlitchCard from './GlitchCard'

const glitchImages = [
  {
    url: 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?...',
    title: '⚡ Glitch Nova ⚡',
    caption: 'Now glitching beyond boundaries!',
  },
  {
    url: 'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?...',
    title: '🌌 Digital Distortion 🌌',
    caption: 'A journey through shattered pixels.',
  },
  {
    url: 'https://images.unsplash.com/photo-1670407621730-dbd147b78207?...',
    title: '🚀 Pixel Surge 🚀',
    caption: 'Igniting visual storms!',
  },
  // Add more as you like
]

export default function GlitchDemo() {
  return <GlitchCard images={glitchImages} interval={5000} />
}
