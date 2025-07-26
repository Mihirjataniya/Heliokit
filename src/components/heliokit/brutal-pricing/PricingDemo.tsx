"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Zap, Crown, Rocket } from "lucide-react"
import { PricingCard } from "./Pricing"

const pricingCards = [
  {
    name: "STARTER",
    price: "$19",
    period: "/MONTH",
    description: "PERFECT FOR TESTING",
    features: [
      "5K REQUESTS/MONTH",
      "BASIC ANALYTICS",
      "EMAIL SUPPORT ONLY",
      "STANDARD API ACCESS",
      "99.5% UPTIME"
    ],
    cta: "START FREE TRIAL",
    icon: Zap,
    variant: "light" as const,
    hoverColor: "blue" as const
  },
  {
    name: "PRO",
    price: "$49",
    period: "/MONTH",
    description: "MOST POPULAR CHOICE",
    features: [
      "50K REQUESTS/MONTH",
      "ADVANCED ANALYTICS",
      "PRIORITY SUPPORT",
      "PREMIUM API ACCESS",
      "99.9% UPTIME"
    ],
    cta: "GET PRO NOW",
    icon: Crown,
    variant: "dark" as const,
    hoverColor: "green" as const,
    popular: true
  },
  {
    name: "ENTERPRISE",
    price: "$99",
    period: "/MONTH",
    description: "FOR POWER USERS",
    features: [
      "UNLIMITED REQUESTS",
      "CUSTOM ANALYTICS",
      "24/7 PHONE SUPPORT",
      "ENTERPRISE API",
      "99.99% UPTIME"
    ],
    cta: "CONTACT SALES",
    icon: Rocket,
    variant: "light" as const,
    hoverColor: "pink" as const
  }
]

export default function PricingCardDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % pricingCards.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + pricingCards.length) % pricingCards.length)
  }

  const currentCard = pricingCards[currentIndex]

  return (
    <div className="min-h-screen w-full py-16 px-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black text-white mb-12 tracking-wide text-center">
       CHOOSE YOUR WEAPON
      </h2>

  
      <div className="flex items-center gap-8 w-full max-w-5xl justify-center">

        <button
          onClick={prev}
          className="border-3 border-white text-white p-3 rounded-full shadow transition"
        >
          <ChevronLeft size={28} />
        </button>

       
        <div className="w-full max-w-lg transition-all duration-500 ease-in-out">
          <PricingCard {...currentCard} index={0} />
        </div>

        <button
          onClick={next}
          className="border-3 border-white text-white p-3 rounded-full shadow transition"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="flex gap-2 mt-12">
        {pricingCards.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
