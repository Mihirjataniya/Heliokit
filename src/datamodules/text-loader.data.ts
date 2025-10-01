import TextLoaderDemo from "@/components/heliokit/text-loader/TextLoaderDemo"

const textLoaderImport = `import TextLoader from '@/components/TextLoader'`

const textLoaderJSXDemo = `
const letters = ['H','E','L','I','O','K','I','T']

<TextLoader letters={letters} />
`

const manualTextLoaderCode = `import React from 'react'

type TextLoaderProps = {
  letters: string[];
};

export default function TextLoader({ letters }: TextLoaderProps) {
  return (
    <>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
        
        .loader {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          background-color: transparent;
          mask: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 6px,
            black 7px,
            black 8px
          );
        }

        .loader::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 50%),
            radial-gradient(circle at 45% 45%, #00ffff 0%, transparent 45%),
            radial-gradient(circle at 55% 55%, #ff0077 0%, transparent 45%),
            radial-gradient(circle at 45% 55%, #00ff88 0%, transparent 45%),
            radial-gradient(circle at 55% 45%, #ffaa00 0%, transparent 45%);
          mask: radial-gradient(
            circle at 50% 50%,
            transparent 0%,
            transparent 10%,
            black 25%
          );
          animation:
            transform-animation 2s infinite alternate,
            opacity-animation 4s infinite;
          animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
        }

        @keyframes transform-animation {
          0% { transform: translate(-55%); }
          100% { transform: translate(55%); }
        }

        @keyframes opacity-animation {
          0%, 100% { opacity: 0; }
          15% { opacity: 1; }
          65% { opacity: 0; }
        }

        .loader-letter {
          display: inline-block;
          opacity: 0;
          animation: loader-letter-anim 4s infinite linear;
          z-index: 2;
        }

        .loader-letter:nth-child(1) { animation-delay: 0.1s; }
        .loader-letter:nth-child(2) { animation-delay: 0.205s; }
        .loader-letter:nth-child(3) { animation-delay: 0.31s; }
        .loader-letter:nth-child(4) { animation-delay: 0.415s; }
        .loader-letter:nth-child(5) { animation-delay: 0.521s; }
        .loader-letter:nth-child(6) { animation-delay: 0.626s; }
        .loader-letter:nth-child(7) { animation-delay: 0.731s; }
        .loader-letter:nth-child(8) { animation-delay: 0.837s; }
        .loader-letter:nth-child(9) { animation-delay: 0.942s; }
        .loader-letter:nth-child(10) { animation-delay: 1.047s; }

        @keyframes loader-letter-anim {
          0% { opacity: 0; }
          5% {
            opacity: 1;
            text-shadow: 0 0 4px #fff;
            transform: scale(1.1) translateY(-2px);
          }
          20% { opacity: 0.2; }
          100% { opacity: 0; }
        }
      \`}</style>
      <div className="relative flex items-center justify-center h-[120px] w-auto m-8 font-[Poppins] text-[1.6em] font-semibold select-none text-white scale-200">
        {letters.map((letter, index) => (
          <span key={index} className="loader-letter">{letter}</span>
        ))}
        <div className="loader"></div>
      </div>
    </>
  );
}
`

export const PreviewComponent = TextLoaderDemo
export const code = `${textLoaderImport}\n\nexport function ExampleTextLoader() {\n  return (${textLoaderJSXDemo})\n}`
export const description =
    "An animated text loader that reveals letters in sequence with colorful effects. Perfect for branding, splash screens, or transitions."

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add text-loader"],
    },
    {
        id: 2,
        title: "Import required modules",
        codeSnippets: [
            {
                filename: "components/ExampleTextLoader.tsx",
                language: "tsx",
                code: textLoaderImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the TextLoader component",
        codeSnippets: [
            {
                filename: "components/ExampleTextLoader.tsx",
                language: "tsx",
                code: textLoaderJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Create the TextLoader component manually",
        codeSnippets: [
            {
                filename: "src/components/TextLoader.tsx",
                language: "tsx",
                code: manualTextLoaderCode,
            },
        ],
    },
    {
        id: 2,
        title: "Use the TextLoader component in your app",
        codeSnippets: [
            {
                filename: "src/components/ExampleTextLoader.tsx",
                language: "tsx",
                code: textLoaderJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: "TextLoader",
        props: [
            {
                propName: "letters",
                description: "Array of characters to display in the loader animation",
                type: "string[]",
                defaultValue: `[]`,
            },
        ],
    },
]
