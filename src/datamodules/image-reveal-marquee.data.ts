import InfiniteMarqueeExample from "@/components/heliokit/image-reveal-marquee/MarqueeDemo";


const marqueeImport = `import { Marquee, MarqueeTrack, MarqueeWord } from "@/components/Marquee"`


const marqueeJSXDemo = `
export default function InfiniteMarqueeExample() {
  const words = [
    { word: "Mountain", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
    { word: "Ocean", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
    ...
  ]
  
  return (
    <div className="overflow-hidden flex flex-col items-center h-[80vh] justify-center">
      <Marquee direction="left" fontSize="text-8xl" speed={2}>
        <MarqueeTrack className="mt-12">
          {words.map((item, index) => (
            <MarqueeWord
              key={"{item.word}-{index}"}
              text={item.word}
              image={item.image}
              imageWidth={260}
              imageHeight={160}
            />
          ))}
        </MarqueeTrack>
      </Marquee>
      <Marquee direction="right" fontSize="text-8xl" speed={2}>
        <MarqueeTrack className="mt-12">
          {words.map((item, index) => (
            <MarqueeWord
                key={"{item.word}-{index}"}
              text={item.word}
              image={item.image}
              imageWidth={260}
              imageHeight={160}
            />
          ))}
        </MarqueeTrack>
      </Marquee>
    </div>
  )
}
`

const manualMarqueeCode = `import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from "framer-motion";

const MarqueeContext = createContext({
  direction: 'left',
  fontSize: 'text-8xl',
  speed: 4,
});

export const Marquee = ({ children, direction = 'left', fontSize = 'text-8xl', speed = 4, className }) => {
  return (
    <MarqueeContext.Provider value={{ direction, fontSize, speed }}>
      <div className={\`\${className}\`}>
        {children}
      </div>
    </MarqueeContext.Provider>
  );
};

export const MarqueeTrack = ({ children, className }) => {
  const { direction, speed } = useContext(MarqueeContext);
  const trackRef = useRef(null);
  const baseX = useMotionValue(0);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    if (trackRef.current) {
      let totalWidth = 0;
      for (let i = 0; i < childrenArray.length; i++) {
        const child = trackRef.current.children[i];
        if (child) totalWidth += child.offsetWidth;
      }
      setSingleSetWidth(totalWidth);
    }
  }, [childrenArray.length]);

  useAnimationFrame(() => {
    if (singleSetWidth > 0) {
      const directionMultiplier = direction === 'left' ? -1 : 1;
      baseX.set(baseX.get() + speed * directionMultiplier);
    }
  });

  const x = useTransform(baseX, (v) => {
    return direction === 'left' ? v % -singleSetWidth : v % singleSetWidth;
  });

  const duplicated = [...childrenArray, ...childrenArray, ...childrenArray];

  return (
    <div className={\`w-full border-b-2 border-white relative \${className}\`}>
      <motion.div ref={trackRef} className="flex whitespace-nowrap will-change-transform" style={{ x }}>
        {duplicated.map((child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { key: index })
            : child
        )}
      </motion.div>
    </div>
  );
};

export const MarqueeWord = ({ text, image, alt, imageWidth = 240, imageHeight = 150, offset = 10 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { fontSize } = useContext(MarqueeContext);

  return (
    <span className="relative inline-block">
      <span
        className={\`cursor-pointer text-white font-bold \${fontSize} uppercase mx-6 whitespace-nowrap hover:underline\`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-50 bg-white rounded-lg shadow-xl pointer-events-none"
            style={{
              left: "20%",
              bottom: \`\${offset - (-80)}px\`,
              transform: "translateX(-50%)",
              width: \`\${imageWidth}px\`
            }}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
          >
            <motion.img
              src={image}
              alt={alt}
              className="object-cover w-full rounded-lg"
              style={{ height: \`\${imageHeight}px\` }}
              loading="lazy"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};\``

export const PreviewComponent = InfiniteMarqueeExample;
export const code = marqueeJSXDemo
 

export const description = 'An infinite scrolling marquee where each word reveals a hoverable image. Ideal for eye-catching visual text loops in landing pages or creative portfolios.'

export const cliSteps = [
    {
        id: 1,
        title: "Install dependencies",
        commands: ["npx heliokit@latest add image-reveal-marquee"],
    },
    {
        id: 2,
        title: "Import the marquee components",
        codeSnippets: [
            {
                filename: "components/ExampleMarquee.tsx",
                language: "tsx",
                code: marqueeImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the Marquee component",
        codeSnippets: [
            {
                filename: "components/ExampleMarquee.tsx",
                language: "tsx",
                code: marqueeJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Install dependencies",
        commands: ["npm install framer-motion"],
    },
    {
        id: 2,
        title: "Create the Marquee component manually",
        codeSnippets: [
            {
                filename: "src/components/Marquee.tsx",
                language: "tsx",
                code: manualMarqueeCode,
            },
        ],
    },
    {
        id: 3,
        title: "Use the Marquee in your app",
        codeSnippets: [
            {
                filename: "src/components/ExampleMarquee.tsx",
                language: "tsx",
                code: marqueeJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: "Marquee",
        props: [
            {
                propName: "children",
                description: "Nested MarqueeTrack components or elements to animate",
                type: "ReactNode",
                defaultValue: "None",
            },
            {
                propName: "direction",
                description: "Scroll direction of the marquee",
                type: "'left' | 'right'",
                defaultValue: "'left'",
            },
            {
                propName: "fontSize",
                description: "Font size class applied to MarqueeWord text",
                type: "'text-4xl' | 'text-5xl' ... 'text-9xl'",
                defaultValue: "'text-8xl'",
            },
            {
                propName: "speed",
                description: "Speed of the marquee animation",
                type: "number",
                defaultValue: "4",
            },
            {
                propName: "className",
                description: "Optional Tailwind classes for container styling",
                type: "string",
                defaultValue: "None",
            },
        ],
    },
    {
        componentName: "MarqueeTrack",
        props: [
            {
                propName: "children",
                description: "MarqueeWord elements to animate",
                type: "ReactNode",
                defaultValue: "None",
            },
            {
                propName: "className",
                description: "Optional Tailwind classes for styling",
                type: "string",
                defaultValue: "None",
            },
        ],
    },
    {
        componentName: "MarqueeWord",
        props: [
            {
                propName: "text",
                description: "The text displayed in the marquee",
                type: "string",
                defaultValue: "None",
            },
            {
                propName: "image",
                description: "Image shown on hover",
                type: "string (URL)",
                defaultValue: "None",
            },
            {
                propName: "alt",
                description: "Alt text for the image",
                type: "string",
                defaultValue: "''",
            },
            {
                propName: "imageWidth",
                description: "Width of the hover image (px)",
                type: "number",
                defaultValue: "240",
            },
            {
                propName: "imageHeight",
                description: "Height of the hover image (px)",
                type: "number",
                defaultValue: "150",
            },
            {
                propName: "offset",
                description: "Vertical offset of the image from the word",
                type: "number",
                defaultValue: "10",
            },
        ],
    },
]
