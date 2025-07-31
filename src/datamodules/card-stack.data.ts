import CardStackDemo from "@/components/heliokit/card-stack/CardStackDemo";

const cardStackJSXDemo = `
<CardStack
  cards={[
    { id: 1, content: <Children1 /> },
    { id: 2, content: <Children2 /> },
    { id: 3, content: <Children3 /> },
    { id: 4, content: <Children4 /> },
    { id: 5, content: <Children5 /> },
  ]}
/>
`;

const cardStackImport = `import { CardStack } from '@/components/CardStack'`;

const manualCardStackCode = `import React from "react";

export interface CardData {
  id: number;
  content: React.ReactNode;
}

interface CardStackProps {
  cards: CardData[];
}

export const CardStack: React.FC<CardStackProps> = ({ cards }) => {
  return (
    <div className="h-screen overflow-y-scroll no-scrollbar">
      <div className="relative my-20 sm:my-32 md:my-40" style={{ perspective: "1000px" }}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="sticky flex items-center justify-center px-4 sm:px-6 md:px-8"
            style={{
              top: \`\${80 + index * 20}px\`,
              zIndex: index + 1,
            }}
          >
            <div
              className="relative w-full max-w-[340px] h-[400px] 
                sm:max-w-[480px] sm:h-[420px]
                md:max-w-[640px] md:h-[450px]
                lg:max-w-[800px] lg:h-[500px]
                rounded-[20px] sm:rounded-[25px] md:rounded-[30px] 
                p-4 sm:p-5 md:p-6
                bg-[#0e0e0e] 
                border border-[#1c1c1c] overflow-hidden          
                before:absolute before:inset-0 
                before:rounded-[20px] sm:before:rounded-[25px] md:before:rounded-[30px]
                before:shadow-[inset_4px_4px_8px_#0a0a0a,inset_-4px_-4px_8px_#1c1c1c]
                sm:before:shadow-[inset_5px_5px_10px_#0a0a0a,inset_-5px_-5px_10px_#1c1c1c]
                md:before:shadow-[inset_6px_6px_12px_#0a0a0a,inset_-6px_-6px_12px_#1c1c1c]
                before:opacity-60 before:pointer-events-none before:z-0"
              style={{
                transform: \`
                  rotateX(\${12 - index * 2}deg)
                  translateZ(\${index * 20}px)
                  translateY(\${index * 4}px)
                \`,
                transformStyle: "preserve-3d",
                transition: "transform 0.3s ease",
              }}
            >
              {card.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

export const PreviewComponent = CardStackDemo;

export const code = `${cardStackImport}

export function CardStackDemo() {
  return (${cardStackJSXDemo});
}
`;

export const description = 'A 3D-styled vertical card stack layout that allows content layering, perspective scrolling, and beautiful stacking animations. Great for visual storytelling, feature showcases, and portfolios.';

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add card-stack"],
  },
  {
    id: 2,
    title: "Import the component",
    codeSnippets: [
      {
        filename: "components/ExampleCardStack.tsx",
        language: "tsx",
        code: cardStackImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the CardStack component",
    codeSnippets: [
      {
        filename: "components/ExampleCardStack.tsx",
        language: "tsx",
        code: cardStackJSXDemo,
      },
    ],
  },
];

export const manualSteps = [
  {
    id: 1,
    title: "Create CardStack component manually",
    codeSnippets: [
      {
        filename: "src/components/CardStack.tsx",
        language: "tsx",
        code: manualCardStackCode,
      },
    ],
  },
  {
    id: 2,
    title: "Use CardStack in your project",
    codeSnippets: [
      {
        filename: "src/components/ExampleCardStack.tsx",
        language: "tsx",
        code: cardStackJSXDemo,
      },
    ],
  },
];

export const propsData = [
  {
    componentName: "CardStack",
    props: [
      {
        propName: "cards",
        description: "An array of cards with unique `id` and JSX `content`.",
        type: `{ id: number; content: React.ReactNode }[]`,
        defaultValue: "[]",
      },
    ],
  },
];
