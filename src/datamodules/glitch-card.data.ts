import GlitchCardDemo from "@/components/heliokit/glitch-card/GlitchCardDemo";

const glitchCardJSXDemo = `
        <GlitchCard
            images={[
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
                ]}
        />
`;

const glitchCardImport = `import { GlitchCard } from '@/components/GlitchCard'`;

const manualGlitchCardCode = `import React, { useState, useEffect } from 'react';

export const GlitchCard = ({ images, interval = 4000, className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 200);
      setTimeout(() => {
        setIsGlitching(false);
      }, 900);
    }, interval);
    return () => clearInterval(int);
  }, [images.length, interval]);

  const { url, title, caption } = images[currentImageIndex];

  return (
    <div className={\`flex items-center justify-center min-h-screen bg-black overflow-visible p-4 \${className}\`}>
      <div className="relative w-80 h-96 rounded-lg overflow-visible shadow-[0_0_80px_#ff00ff20]">
        <div className="relative w-full h-full rounded-xl z-0">
          <img
            src={url}
            alt="Main"
            className={\`w-full h-full object-cover transition-transform duration-300 rounded-xl \${isGlitching ? 'scale-105 blur-sm' : ''}\`}
          />
          {isGlitching && (
            <>
              <img
                src={url}
                className="absolute top-[-20px] left-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover mix-blend-screen z-20 pointer-events-none"
                style={{ filter: 'brightness(1.4) hue-rotate(0deg) saturate(2)', transform: 'translate(-6px, 4px) scale(1.1)', animation: 'glitch-clip-1 0.6s infinite linear' }}
              />
              <img
                src={url}
                className="absolute top-[-20px] left-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover mix-blend-screen z-10 pointer-events-none"
                style={{ filter: 'brightness(1.4) hue-rotate(180deg) saturate(2)', transform: 'translate(5px, -3px) scale(1.1)', animation: 'glitch-clip-2 0.6s infinite linear' }}
              />
              <div className="absolute inset-[-20px] bg-white/5 z-30 pointer-events-none" style={{ animation: 'glitch-noise 0.15s infinite' }} />
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
          <h3 className={\`text-white text-2xl font-extrabold relative glitch-text \${isGlitching ? 'glitching-text' : ''}\`} data-text={title}>
            {title}
          </h3>
          <p className="text-gray-400 text-xs">{caption}</p>
        </div>
      </div>
    </div>
  );
};
`;

export const PreviewComponent = GlitchCardDemo;

export const code = `${glitchCardImport}

export function GlitchCardDemo() {
  return (${glitchCardJSXDemo});
}
`;

export const description = 'Visually striking image card with glitch animations and caption overlays. Useful for showcasing visual projects, art pieces, or dynamic transitions.';

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add glitch-card"],
  },
  {
    id: 2,
    title: "Import the component",
    codeSnippets: [
      {
        filename: "components/ExampleGlitchCard.tsx",
        language: "tsx",
        code: glitchCardImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the GlitchCard component",
    codeSnippets: [
      {
        filename: "components/ExampleGlitchCard.tsx",
        language: "tsx",
        code: glitchCardJSXDemo,
      },
    ],
  },
];

export const manualSteps = [
  {
    id: 1,
    title: "Install required dependencies",
    commands: [],
  },
  {
    id: 2,
    title: "Create GlitchCard component manually",
    codeSnippets: [
      {
        filename: "src/components/GlitchCard.tsx",
        language: "tsx",
        code: manualGlitchCardCode,
      },
    ],
  },
  {
    id: 3,
    title: "Use the GlitchCard component in your project",
    codeSnippets: [
      {
        filename: "src/components/ExampleGlitchCard.tsx",
        language: "tsx",
        code: glitchCardJSXDemo,
      },
    ],
  },
];

export const propsData = [
  {
    componentName: "GlitchCard",
    props: [
      {
        propName: "images",
        description: "Array of images with title and caption to cycle through",
        type: `{ url: string; title: string; caption: string }[]`,
        defaultValue: "[]",
      },
      {
        propName: "interval",
        description: "Time in milliseconds between each image switch",
        type: "number",
        defaultValue: "4000",
      },
      {
        propName: "className",
        description: "Optional CSS classes for styling the outer wrapper",
        type: "string",
        defaultValue: `""`,
      },
    ],
  },
];
