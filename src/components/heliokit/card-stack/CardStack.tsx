
"use client"

import React from "react"

export interface CardData {
  id: number
  content: React.ReactNode
}

interface CardStackProps {
  cards: CardData[]
}

export default function CardStack({ cards }: CardStackProps) {
  return (
    <div className="h-screen overflow-y-scroll no-scrollbar">
      <div className="relative my-20 sm:my-32 md:my-40" style={{ perspective: "1000px" }}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="sticky flex items-center justify-center px-4 sm:px-6 md:px-8"
            style={{
              top: `${80 + index * 20}px`,
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
                transform: `
                  rotateX(${12 - index * 2}deg)
                  translateZ(${index * 20}px)
                  translateY(${index * 4}px)
                `,
                transformStyle: "preserve-3d",
                transition: "transform 0.3s ease",
              }}
            >
              {card.content}
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          @media (min-width: 640px) {
            .sticky {
              top: ${cards.map((_, index) => `${100 + index * 25}px`).join(', ')};
            }
          }
          
          @media (min-width: 768px) {
            .sticky {
              top: ${cards.map((_, index) => `${120 + index * 30}px`).join(', ')};
            }
          }
          
          @media (min-width: 1024px) {
            .sticky {
              top: ${cards.map((_, index) => `${140 + index * 40}px`).join(', ')};
            }
          }
        `}
      </style>
    </div>
  )
}