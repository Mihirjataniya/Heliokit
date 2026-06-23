import GlitchCard from './GlitchCard'

const glitchImages = [
  {
    url: '/demo/glitch/1.jpg',
    title: '⚡ Glitch Nova ⚡',
    caption: 'Now glitching beyond boundaries!',
  },
  {
    url: '/demo/glitch/2.jpg',
    title: '🌌 Digital Distortion 🌌',
    caption: 'A journey through shattered pixels.',
  },
  {
    url: '/demo/glitch/3.jpg',
    title: '🚀 Pixel Surge 🚀',
    caption: 'Igniting visual storms!',
  },
  // Add more as you like
]

export default function GlitchDemo() {
  return <GlitchCard images={glitchImages} interval={5000} />
}
