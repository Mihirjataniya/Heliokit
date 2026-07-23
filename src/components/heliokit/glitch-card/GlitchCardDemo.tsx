import GlitchCard from './GlitchCard'

const glitchImages = [
  {
    url: 'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/demo/glitch/1.jpg',
    title: '⚡ Glitch Nova ⚡',
    caption: 'Now glitching beyond boundaries!',
  },
  {
    url: 'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/demo/glitch/2.jpg',
    title: '🌌 Digital Distortion 🌌',
    caption: 'A journey through shattered pixels.',
  },
  {
    url: 'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/demo/glitch/3.jpg',
    title: '🚀 Pixel Surge 🚀',
    caption: 'Igniting visual storms!',
  },
  // Add more as you like
]

export default function GlitchDemo() {
  return <GlitchCard images={glitchImages} interval={5000} />
}
