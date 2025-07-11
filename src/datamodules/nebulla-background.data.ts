import NebulaBackgroundDemo from "@/components/heliokit/nebula-background/NebullaBackgroundDemo"

const nebulaJSXDemo = `<div className="relative h-[600px] w-full overflow-hidden">
      <NebullaBackGround exclusionRadius={250} particleCount={200} />
    </div>`

const nebulaImport = `import { NebulaBackground } from "@/components/heliokit/background/NebulaBackground"`

const manualNebulaCode = `import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
}

interface NebullaBackGroundProps {
  exclusionRadius: number
  particleCount: number
}

export const NebullaBackGround = ({ exclusionRadius = 250, particleCount = 200 }: NebullaBackGroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2

    const initParticles = () => {
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        let x: number, y: number
        let attempts = 0
        do {
          x = Math.random() * dimensions.width
          y = Math.random() * dimensions.height
          attempts++
        } while (
          Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < exclusionRadius &&
          attempts < 50
        )

        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          hue: Math.random() * 60 + 200,
        })
      }
    }

    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      particles.forEach((particle, index) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150
          particle.vx += (dx / distance) * force * 0.5
          particle.vy += (dy / distance) * force * 0.5
        }

        const dcx = centerX - particle.x
        const dcy = centerY - particle.y
        const distanceToCenter = Math.sqrt(dcx * dcx + dcy * dcy)

        if (distanceToCenter < exclusionRadius && distanceToCenter > 0) {
          const repulsionForce = (exclusionRadius - distanceToCenter) / exclusionRadius
          particle.vx -= (dcx / distanceToCenter) * repulsionForce * 2
          particle.vy -= (dcy / distanceToCenter) * repulsionForce * 2
        }

        particle.vx += (Math.random() - 0.5) * 0.05
        particle.vy += (Math.random() - 0.5) * 0.05

        particle.vx *= 0.995
        particle.vy *= 0.995

        const minVelocity = 0.1
        const velocityMagnitude = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
        if (velocityMagnitude < minVelocity) {
          const angle = Math.random() * Math.PI * 2
          particle.vx = Math.cos(angle) * minVelocity
          particle.vy = Math.sin(angle) * minVelocity
        }

        const maxVelocity = 5
        if (velocityMagnitude > maxVelocity) {
          particle.vx = (particle.vx / velocityMagnitude) * maxVelocity
          particle.vy = (particle.vy / velocityMagnitude) * maxVelocity
        }

        particle.x += particle.vx
        particle.y += particle.vy

        const margin = 10
        if (particle.x < margin) {
          particle.x = margin
          particle.vx = Math.abs(particle.vx) * 0.8
        } else if (particle.x > dimensions.width - margin) {
          particle.x = dimensions.width - margin
          particle.vx = -Math.abs(particle.vx) * 0.8
        }

        if (particle.y < margin) {
          particle.y = margin
          particle.vy = Math.abs(particle.vy) * 0.8
        } else if (particle.y > dimensions.height - margin) {
          particle.y = dimensions.height - margin
          particle.vy = -Math.abs(particle.vy) * 0.8
        }

        const currentDistanceToCenter = Math.sqrt(
          (particle.x - centerX) ** 2 + (particle.y - centerY) ** 2
        )
        if (currentDistanceToCenter < exclusionRadius) {
          const angle = Math.atan2(particle.y - centerY, particle.x - centerX)
          particle.x = centerX + Math.cos(angle) * (exclusionRadius + 10)
          particle.y = centerY + Math.sin(angle) * (exclusionRadius + 10)
          particle.vx = Math.cos(angle) * 2
          particle.vy = Math.sin(angle) * 2
        }

        particle.hue = (particle.hue + 0.5) % 360

        ctx.save()
        ctx.globalCompositeOperation = 'screen'

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        )
        gradient.addColorStop(0, "hsla({particle.hue}, 80%, 70%, {particle.opacity})")
        gradient.addColorStop(0.5, "hsla({particle.hue + 30}, 70%, 60%, {particle.opacity * 0.5})")
        gradient.addColorStop(1, "hsla({particle.hue}, 60%, 50%, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.save()
            ctx.globalCompositeOperation = 'screen'
            const opacity = ((120 - distance) / 120) * 0.3

            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              otherParticle.x,
              otherParticle.y
            )
            gradient.addColorStop(0, "hsla({particle.hue}, 70%, 60%,{opacity})")
            gradient.addColorStop(1, "hsla({otherParticle.hue}, 70%, 60%, {opacity})")
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, exclusionRadius, particleCount])

  return (
   <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-black" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
    </div>
  )
}
`

export const PreviewComponent = NebulaBackgroundDemo
export const code = `${nebulaImport}

export function NebulaBackgroundDemo() {
  return (
    ${nebulaJSXDemo}
  )
}`

export const description = "A mesmerizing, interactive particle background with glowing trails and center exclusion. Perfect for hero sections, tech dashboards, and immersive designs."

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add nebula-background"],
    },
    {
        id: 2,
        title: "Import the module",
        codeSnippets: [
            {
                filename: "components/NebulaDemo.tsx",
                language: "tsx",
                code: nebulaImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the component",
        codeSnippets: [
            {
                filename: "components/NebulaDemo.tsx",
                language: "tsx",
                code: nebulaJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Install dependencies",
        commands: [
            "npx heliokit@latest init",
        ],
    },
    {
        id: 2,
        title: "Create the NebulaBackground component",
        codeSnippets: [
            {
                filename: "components/NebulaBackground.tsx",
                language: "tsx",
                code: manualNebulaCode,
            },
        ],
    },
    {
        id: 3,
        title: "Use it in your app",
        codeSnippets: [
            {
                filename: "pages/index.tsx",
                language: "tsx",
                code: nebulaJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: "NebulaBackground",
        props: [
            {
                propName: "exclusionRadius",
                description: "Pixel radius of the circular center zone where particles are not placed and are repelled from",
                type: "number",
                defaultValue: "250",
            },
            {
                propName: "particleCount",
                description: "Number of particles to render across the canvas",
                type: "number",
                defaultValue: "60",
            },
        ],
    },
]
