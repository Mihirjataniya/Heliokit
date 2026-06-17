"use client"

import React from "react"
import { Zap, Crown, Rocket } from "lucide-react"
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
  return (
    <div className="w-full py-12 px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-10 tracking-wide text-center">
        CHOOSE YOUR WEAPON
      </h2>

      <div className="grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pricingCards.map((card, i) => (
          <PricingCard key={card.name} {...card} size="sm" index={i} />
        ))}
      </div>
    </div>
  )
}
