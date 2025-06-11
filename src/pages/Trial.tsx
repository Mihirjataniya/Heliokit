import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const accordionData = [
  {
    id: 1,
    title: "Advanced Security Features",
    content:
      "Our platform implements enterprise-grade security measures including end-to-end encryption, multi-factor authentication, and real-time threat detection. Your data is protected with military-grade security protocols and compliance with international standards like SOC 2 and ISO 27001.",
  },
  {
    id: 2,
    title: "Lightning Fast Performance",
    content:
      "Experience blazing-fast load times with our optimized infrastructure. Built on cutting-edge technology stack with global CDN distribution, edge computing, and intelligent caching mechanisms that deliver content in milliseconds worldwide.",
  },
  {
    id: 3,
    title: "Scalable Architecture",
    content:
      "Our cloud-native architecture automatically scales to meet your demands. Whether you're serving hundreds or millions of users, our platform adapts seamlessly with auto-scaling capabilities, load balancing, and distributed computing resources.",
  },
  {
    id: 4,
    title: "Premium Support",
    content:
      "Get 24/7 dedicated support from our expert team. We provide comprehensive documentation, video tutorials, live chat support, and personalized onboarding to ensure your success with our platform.",
  },
  {
    id: 5,
    title: "Global Reach",
    content:
      "Expand your reach with our worldwide infrastructure. Our platform supports multiple languages, currencies, and regional compliance requirements, making it easy to scale your business globally with localized experiences.",
  },
]

const Trial = () => {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [animatingItems, setAnimatingItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    const isCurrentlyOpen = openItems.includes(id)

    if (isCurrentlyOpen) {
      setOpenItems(openItems.filter((item) => item !== id))
    } else {
      setOpenItems([...openItems, id])
      // Trigger beam animation
      setAnimatingItems([...animatingItems, id])
      setTimeout(() => {
        setAnimatingItems((prev) => prev.filter((item) => item !== id))
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Premium Features</h1>
          <p className="text-gray-300">Discover what makes our platform exceptional</p>
        </div>

        <div className="space-y-3">
          {accordionData.map((item) => {
            const isOpen = openItems.includes(item.id)
            const isAnimating = animatingItems.includes(item.id)

            return (
              <motion.div
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)", // for Safari support
                }}
                key={item.id}
                className="relative w-full overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>
                {/* Beam Animation Overlay */}
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <svg className="absolute  inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`beam-gradient-${item.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="rgba(168, 168, 168, 0.6)" />   {/* Dark silver */}
                            <stop offset="25%" stopColor="rgba(192, 192, 192, 0.7)" />  {/* Standard silver */}
                            <stop offset="50%" stopColor="rgba(211, 211, 211, 0.8)" />  {/* Light silver */}
                            <stop offset="75%" stopColor="rgba(192, 192, 192, 0.7)" />  {/* Back to mid */}
                            <stop offset="100%" stopColor="rgba(168, 168, 168, 0.6)" /> {/* End dark silver */}
                          </linearGradient>



                          <filter id={`glow-${item.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Left beam path - continuous from bottom center to top left */}
                        <motion.path
                          d="M 50 100 L 0 100 L 0 0 L 50 0"
                          fill="none"
                          stroke={`url(#beam-gradient-${item.id})`}
                          strokeWidth="1"
                          filter={`url(#glow-${item.id})`}
                          strokeDasharray="400"
                          strokeDashoffset="400"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Right beam path - continuous from bottom center to top right */}
                        <motion.path
                          d="M 50 100 L 100 100 L 100 0 L 50 0"
                          fill="none"
                          stroke={`url(#beam-gradient-${item.id})`}
                          strokeWidth="1"
                          filter={`url(#glow-${item.id})`}
                          strokeDasharray="400"
                          strokeDashoffset="400"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <motion.button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between group focus:outline-none rounded-xl bg-transparent relative z-20"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-300 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-gray-300 group-hover:text-white transition-colors duration-300"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2, delay: isOpen ? 0.1 : 0 },
                      }}
                      className="overflow-hidden relative z-20"
                    >
                      <div className="px-6 pb-6">
                        <div className="pl-0">
                          <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-gray-300 leading-relaxed"
                          >
                            {item.content}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">Click on any section to explore our features</p>
        </div>
      </div>
    </div>
  )
}

export default Trial
