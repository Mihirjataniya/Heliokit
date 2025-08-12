// import { useState, useEffect } from "react"
// import { motion, AnimatePresence, useAnimationControls, type AnimationControls } from "framer-motion"

// // Dummy components for step content
// const BusinessTypeForm = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Business Type</h3>
//     <p className="text-sm text-neutral-400 mb-6">Please select the type of business you operate.</p>
//     <div className="space-y-4">
//       <label className="flex items-center space-x-3 cursor-pointer group">
//         <input
//           type="radio"
//           name="businessType"
//           value="soleProprietor"
//           className="h-5 w-5 text-neutral-100 bg-neutral-800 border-neutral-600 focus:ring-neutral-100 focus:ring-2 checked:bg-neutral-100 checked:border-neutral-100"
//         />
//         <span className="text-sm sm:text-base group-hover:text-neutral-100 transition-colors">Sole Proprietorship</span>
//       </label>
//       <label className="flex items-center space-x-3 cursor-pointer group">
//         <input
//           type="radio"
//           name="businessType"
//           value="llc"
//           className="h-5 w-5 text-neutral-100 bg-neutral-800 border-neutral-600 focus:ring-neutral-100 focus:ring-2 checked:bg-neutral-100 checked:border-neutral-100"
//         />
//         <span className="text-sm sm:text-base group-hover:text-neutral-100 transition-colors">Limited Liability Company (LLC)</span>
//       </label>
//       <label className="flex items-center space-x-3 cursor-pointer group">
//         <input
//           type="radio"
//           name="businessType"
//           value="corporation"
//           className="h-5 w-5 text-neutral-100 bg-neutral-800 border-neutral-600 focus:ring-neutral-100 focus:ring-2 checked:bg-neutral-100 checked:border-neutral-100"
//         />
//         <span className="text-sm sm:text-base group-hover:text-neutral-100 transition-colors">Corporation</span>
//       </label>
//     </div>
//   </div>
// )
// const BusinessTypePreview = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Business Type</h3>
//     <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700">
//       <p className="text-sm text-neutral-400 mb-2">Selected Business Type:</p>
//       <p className="text-base text-neutral-200 font-medium">Sole Proprietorship</p>
//     </div>
//   </div>
// )

// const BusinessDetailForm = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Business Details</h3>
//     <p className="text-sm text-neutral-400 mb-6">Provide details about your business operations.</p>
//     <div className="space-y-4 sm:space-y-5">
//       <div>
//         <label htmlFor="businessName" className="block text-sm font-medium text-neutral-300 mb-2">
//           Business Name
//         </label>
//         <input
//           type="text"
//           id="businessName"
//           className="block w-full rounded-lg bg-neutral-800/50 border border-neutral-600 text-neutral-100 shadow-sm focus:border-neutral-100 focus:ring-neutral-100 focus:ring-2 text-sm p-3 transition-all placeholder-neutral-400"
//           placeholder="e.g., Acme Corp"
//         />
//       </div>
//       <div>
//         <label htmlFor="industry" className="block text-sm font-medium text-neutral-300 mb-2">
//           Industry
//         </label>
//         <input
//           type="text"
//           id="industry"
//           className="block w-full rounded-lg bg-neutral-800/50 border border-neutral-600 text-neutral-100 shadow-sm focus:border-neutral-100 focus:ring-neutral-100 focus:ring-2 text-sm p-3 transition-all placeholder-neutral-400"
//           placeholder="e.g., Software Development"
//         />
//       </div>
//     </div>
//   </div>
// )
// const BusinessDetailPreview = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Business Details</h3>
//     <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700 space-y-3">
//       <div>
//         <p className="text-sm text-neutral-400 mb-1">Business Name:</p>
//         <p className="text-base text-neutral-200 font-medium">Acme Corp</p>
//       </div>
//       <div>
//         <p className="text-sm text-neutral-400 mb-1">Industry:</p>
//         <p className="text-base text-neutral-200 font-medium">Software Development</p>
//       </div>
//     </div>
//   </div>
// )

// const YourDetailsForm = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Your Details</h3>
//     <p className="text-sm text-neutral-400 mb-6">Enter your personal contact information.</p>
//     <div className="space-y-4 sm:space-y-5">
//       <div>
//         <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-2">
//           Full Name
//         </label>
//         <input
//           type="text"
//           id="fullName"
//           className="block w-full rounded-lg bg-neutral-800/50 border border-neutral-600 text-neutral-100 shadow-sm focus:border-neutral-100 focus:ring-neutral-100 focus:ring-2 text-sm p-3 transition-all placeholder-neutral-400"
//           placeholder="John Doe"
//         />
//       </div>
//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
//           Email Address
//         </label>
//         <input
//           type="email"
//           id="email"
//           className="block w-full rounded-lg bg-neutral-800/50 border border-neutral-600 text-neutral-100 shadow-sm focus:border-neutral-100 focus:ring-neutral-100 focus:ring-2 text-sm p-3 transition-all placeholder-neutral-400"
//           placeholder="john.doe@example.com"
//         />
//       </div>
//     </div>
//   </div>
// )
// const YourDetailsPreview = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Your Details</h3>
//     <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700 space-y-3">
//       <div>
//         <p className="text-sm text-neutral-400 mb-1">Full Name:</p>
//         <p className="text-base text-neutral-200 font-medium">John Doe</p>
//       </div>
//       <div>
//         <p className="text-sm text-neutral-400 mb-1">Email Address:</p>
//         <p className="text-base text-neutral-200 font-medium">john.doe@example.com</p>
//       </div>
//     </div>
//   </div>
// )

// const VerificationForm = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Verification</h3>
//     <p className="text-sm text-neutral-400 mb-6">Please verify your information to complete the process.</p>
//     <div className="space-y-4 sm:space-y-5">
//       <div>
//         <label htmlFor="otp" className="block text-sm font-medium text-neutral-300 mb-2">
//           OTP Code
//         </label>
//         <input
//           type="text"
//           id="otp"
//           className="block w-full rounded-lg bg-neutral-800/50 border border-neutral-600 text-neutral-100 shadow-sm focus:border-neutral-100 focus:ring-neutral-100 focus:ring-2 text-sm p-3 transition-all placeholder-neutral-400"
//           placeholder="Enter 6-digit code"
//         />
//       </div>
//       <button className="inline-flex items-center px-4 sm:px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-neutral-900 bg-neutral-100 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-100 focus:ring-offset-neutral-900 transition-all duration-200">
//         Send OTP
//       </button>
//     </div>
//   </div>
// )
// const VerificationPreview = () => (
//   <div className="p-4 sm:p-6 text-neutral-300">
//     <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-neutral-100">Verification</h3>
//     <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700">
//       <p className="text-sm text-neutral-400 mb-2">Verification Status:</p>
//       <div className="flex items-center space-x-2">
//         <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
//         <p className="text-base text-neutral-200 font-medium">Pending Verification</p>
//       </div>
//     </div>
//   </div>
// )

// // Define the steps array
// const stepsData = [
//   {
//     id: "businessType",
//     title: "Business Type",
//     shortTitle: "Type",
//     supportingText: "Select your business type",
//     shortSupportingText: "Business type",
//     previewComponent: <BusinessTypePreview />,
//     activeComponent: <BusinessTypeForm />,
//     isEditable : true
//   },
//   {
//     id: "businessDetail",
//     title: "Business Detail",
//     shortTitle: "Details",
//     supportingText: "Provide business information",
//     shortSupportingText: "Business info",
//     previewComponent: <BusinessDetailPreview />,
//     activeComponent: <BusinessDetailForm />,
//     isEditable : true
//   },
//   {
//     id: "yourDetails",
//     title: "Your Details",
//     shortTitle: "Personal",
//     supportingText: "Enter your personal details",
//     shortSupportingText: "Personal info",
//     previewComponent: <YourDetailsPreview />,
//     activeComponent: <YourDetailsForm />,
//     isEditable : true
//   },
//   {
//     id: "verification",
//     title: "Verification",
//     shortTitle: "Verify",
//     supportingText: "Verify your information",
//     shortSupportingText: "Verification",
//     previewComponent: <VerificationPreview />,
//     activeComponent: <VerificationForm />,
//     isEditable : true
//   },
// ]

// interface StepTabProps {
//   index: number
//   totalSteps: number
//   title: string
//   shortTitle: string
//   supportingText: string
//   shortSupportingText: string
//   isActive: boolean
//   isCompleted: boolean
//   onStepClick: (index: number) => void
//   controls: AnimationControls
//   isMobile: boolean
//   isVisited: boolean
// }
// const StepTab = ({
//   index,
//   totalSteps,
//   title,
//   shortTitle,
//   supportingText,
//   shortSupportingText,
//   isActive,
//   isCompleted,
//   isVisited,
//   onStepClick,
//   controls,
//   isMobile,
// }: StepTabProps) => {
//   const arrowPointDepth = 20
//   const arrowPointDepthInside = 15
//   const isFirst = index === 0
//   const isLast = index === totalSteps - 1

//   // Define clip-path for desktop only
//   const getClipPath = () => {
//     if (isMobile) {
//       return "none"
//     }

//     if (isLast) {
//       return `polygon(${arrowPointDepthInside}px 50%, 0 0, 100% 0, 100% 100%, 0 100%, ${arrowPointDepthInside}px 50%)`
//     } else {
//       return `polygon(${arrowPointDepthInside}px 50%, 0 0, calc(100% - ${arrowPointDepth}px) 0, 100% 50%, calc(100% - ${arrowPointDepth}px) 100%, 0 100%, ${arrowPointDepthInside}px 50%)`
//     }
//   }

//   // Mobile layout
//   if (isMobile) {
//     return (
//       <div className="relative">
//         <button
//           type="button"
//           role="tab"
//           aria-selected={isActive}
//           aria-controls={`step-panel-${index}`}
//           onClick={() => onStepClick(index)}
//           className="w-full relative overflow-hidden rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-900"
//         >
//           {/* Animated light background for active state */}
//           <motion.div
//             className="absolute inset-0 z-0 rounded-xl bg-neutral-100"
//             initial={{ x: "-101%" }}
//             animate={controls}
//           />

//           {/* Completed/Visited step background */}
//           {(isCompleted || isVisited) && !isActive && (
//             <div className="absolute inset-0 bg-neutral-800 rounded-xl z-0" />
//           )}

//           {/* Step content */}
//           <div className="flex flex-col items-center p-4 relative z-10">
//             <motion.div
//               className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-3 transition-all duration-300 ${
//                 isActive
//                   ? "bg-neutral-900 text-neutral-100 shadow-lg"
//                   : isCompleted
//                   ? "bg-neutral-600 text-neutral-100"
//                   : isVisited
//                   ? "bg-neutral-700 text-neutral-100"
//                   : "bg-transparent text-neutral-400 border-2 border-neutral-600"
//               }`}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {isCompleted && !isActive ? "✓" : isVisited && !isActive ? "◯" : index + 1}
//             </motion.div>

//             <div
//               className={`text-xs font-medium text-center leading-tight transition-colors duration-300 ${
//                 isActive ? "text-neutral-900" : (isCompleted || isVisited) ? "text-neutral-200" : "text-neutral-400"
//               }`}
//             >
//               {shortTitle}
//             </div>
//           </div>
//         </button>
//       </div>
//     )
//   }

//   // Desktop version
//   const baseClasses = `relative flex-1 h-16 flex flex-col justify-center px-4 lg:px-6 py-4 text-sm cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-900 overflow-hidden`

//   const conditionalClasses = [
//     isFirst ? "rounded-l-lg" : "",
//     isLast ? "rounded-r-lg" : "",
//     (isCompleted || isVisited) && !isActive ? "bg-neutral-800" : "bg-transparent",
//     isActive ? "shadow-[0_0_0_2px_theme(colors.neutral.100)]" : "",
//     isActive ? "z-30" : (isCompleted || isVisited) ? "z-20" : "z-10"
//   ].filter(Boolean).join(" ")

//   const buttonClassName = `${baseClasses} ${conditionalClasses}`.trim()

//   return (
//     <button
//       type="button"
//       role="tab"
//       aria-selected={isActive}
//       aria-controls={`step-panel-${index}`}
//       onClick={() => onStepClick(index)}
//       className={buttonClassName}
//       style={{ clipPath: getClipPath() }}
//     >
//       {/* Animated light background for active state */}
//       <motion.div
//         className="absolute inset-0 z-0 bg-neutral-100"
//         initial={{ x: "-100%" }}
//         animate={controls}
//       />

//       {/* Step Content */}
//       <div className="relative z-10 text-left transition-colors duration-300 min-w-0">
//         <div
//           className={`font-semibold text-sm transition-colors duration-300 truncate ${
//             isActive ? "text-neutral-900" : (isCompleted || isVisited) ? "text-neutral-200" : "text-neutral-400"
//           }`}
//         >
//           {title}
//         </div>
//         <div
//           className={`text-xs mt-1 transition-colors duration-300 truncate ${
//             isActive ? "text-neutral-900/70" : (isCompleted || isVisited) ? "text-neutral-300" : "text-neutral-500"
//           }`}
//         >
//           {supportingText}
//         </div>
//       </div>
//     </button>
//   )
// }

// export default function MultiStepForm() {
//   const [currentStepIndex, setCurrentStepIndex] = useState(0)
//   const [completedSteps, setCompletedSteps] = useState(new Set()) // Steps that have been completed (moved away from)
//   const [editingSteps, setEditingSteps] = useState(new Set()) // Track which steps are in edit mode
//   const [isMobile, setIsMobile] = useState(false)
//   const controlsArray = Array.from({ length: 4 }, () => useAnimationControls())

//   // Check if mobile on mount and window resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)

//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   useEffect(() => {
//     const firstStepControls = controlsArray[0]
//     if (firstStepControls) {
//       firstStepControls.start({ x: "0%" }, { duration: 0.35, ease: "easeInOut" })
//     }
//   }, [])

//   useEffect(() => {
//     controlsArray.forEach((controls, index) => {
//       if (index !== currentStepIndex) {
//         controls.set({ x: "-100%" })
//       }
//     })
//   }, [currentStepIndex])

//   const handleStepClick = async (newIndex: number) => {
//     if (newIndex === currentStepIndex) return

//     const oldIndex = currentStepIndex
//     const oldControls = controlsArray[oldIndex]
//     const newControls = controlsArray[newIndex]

//     const newDirection = newIndex > oldIndex ? "forward" : "backward"

//     if (oldControls) {
//       await oldControls.start(
//         { x: newDirection === "forward" ? "100%" : "-100%" },
//         { duration: 0.35, ease: "easeInOut" },
//       )
//     }

//     setCurrentStepIndex(newIndex)

//     // Clear edit mode when navigating to a different step
//     if (editingSteps.has(newIndex)) {
//       setEditingSteps(prev => {
//         const newSet = new Set(prev)
//         newSet.delete(newIndex)
//         return newSet
//       })
//     }

//     if (newControls) {
//       newControls.set({ x: newDirection === "forward" ? "-100%" : "100%" })
//       await newControls.start({ x: "0%" }, { duration: 0.35, ease: "easeInOut" })
//     }
//   }

//   const nextStep = () => {
//     if (currentStepIndex < stepsData.length - 1) {
//       // Mark current step as completed when moving to next
//       setCompletedSteps(prev => new Set([...prev, currentStepIndex]))

//       // Clear edit mode for current step
//       setEditingSteps(prev => {
//         const newSet = new Set(prev)
//         newSet.delete(currentStepIndex)
//         return newSet
//       })

//       const nextIndex = currentStepIndex + 1
//       handleStepClick(nextIndex)
//     }
//   }

//   const prevStep = () => {
//     if (currentStepIndex > 0) {
//       handleStepClick(currentStepIndex - 1)
//     }
//   }

//   const handleEdit = (stepIndex: number) => {
//     setEditingSteps(prev => new Set([...prev, stepIndex]))
//   }

//   const handleSaveEdit = (stepIndex: number) => {
//     setEditingSteps(prev => {
//       const newSet = new Set(prev)
//       newSet.delete(stepIndex)
//       return newSet
//     })
//   }

//   const contentToDisplay = stepsData[currentStepIndex]

//   // Fixed logic:
//   // 1. If step is completed and not in edit mode -> show preview
//   // 2. If step is in edit mode -> show active component
//   // 3. If step is not completed (first time or current) -> show active component
//   const isCompleted = completedSteps.has(currentStepIndex)
//   const isInEditMode = editingSteps.has(currentStepIndex)
//   const isEditable = contentToDisplay.isEditable !== false

//   const shouldShowPreview = isCompleted && !isInEditMode
//   const shouldShowEditButton = shouldShowPreview && isEditable

//   let renderedContent
//   if (shouldShowPreview) {
//     renderedContent = contentToDisplay.previewComponent
//   } else {
//     renderedContent = contentToDisplay.activeComponent
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-black p-2 sm:p-4">
//       <div className="w-full max-w-3xl bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-800 p-1 text-neutral-100 rounded-2xl shadow-2xl overflow-hidden">
//         {/* Stepper */}
//         <div className="rounded-2xl bg-neutral-900/90 backdrop-blur-sm">
//           <div className="p-4 lg:p-6 relative z-10">
//             {isMobile ? (
//               <>
//                 {/* Progress bar for mobile */}
//                 <div className="flex justify-center space-x-2 mb-6">
//                   {stepsData.map((_, index) => (
//                     <div
//                       key={index}
//                       className={`h-2 flex-1 rounded-full transition-all duration-500 ${
//                         index < currentStepIndex 
//                           ? 'bg-neutral-100' 
//                           : index === currentStepIndex
//                           ? 'bg-neutral-300'
//                           : 'bg-neutral-700'
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 {/* Mobile steps layout */}
//                 <div className="grid grid-cols-4 gap-3">
//                   {stepsData.map((step, index) => {
//                     const controls = controlsArray[index]

//                     return (
//                       <StepTab
//                         key={step.id}
//                         index={index}
//                         totalSteps={stepsData.length}
//                         title={step.title}
//                         shortTitle={step.shortTitle}
//                         supportingText={step.supportingText}
//                         shortSupportingText={step.shortSupportingText}
//                         isActive={index === currentStepIndex}
//                         isCompleted={completedSteps.has(index)}
//                         isVisited={completedSteps.has(index) && index !== currentStepIndex}
//                         onStepClick={handleStepClick}
//                         controls={controls}
//                         isMobile={isMobile}
//                       />
//                     )
//                   })}
//                 </div>
//               </>
//             ) : (
//               /* Desktop layout */
//               <div className="flex items-center justify-between gap-x-2 overflow-x-auto">
//                 {stepsData.map((step, index) => {
//                   const controls = controlsArray[index]

//                   return (
//                     <StepTab
//                       key={step.id}
//                       index={index}
//                       totalSteps={stepsData.length}
//                       title={step.title}
//                       shortTitle={step.shortTitle}
//                       supportingText={step.supportingText}
//                       shortSupportingText={step.shortSupportingText}
//                       isActive={index === currentStepIndex}
//                       isCompleted={completedSteps.has(index)}
//                       isVisited={completedSteps.has(index) && index !== currentStepIndex}
//                       onStepClick={handleStepClick}
//                       controls={controls}
//                       isMobile={isMobile}
//                     />
//                   )
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Content Area */}
//           <div className="relative p-2 sm:p-4 lg:p-6">
//             <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-800 relative overflow-hidden">
//               {/* Professional Edit Button */}
//               {shouldShowEditButton && (
//                 <div className="absolute top-4 right-4 z-10">
//                   <motion.button
//                     onClick={() => handleEdit(currentStepIndex)}
//                     className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800/80 backdrop-blur-sm border border-neutral-600/50 rounded-lg hover:bg-neutral-700/80 hover:text-neutral-100 hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-200 shadow-lg hover:shadow-xl"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <svg
//                       className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                       />
//                     </svg>
//                     Edit
//                   </motion.button>
//                 </div>
//               )}

//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={`${contentToDisplay.id}-${isInEditMode ? 'edit' : shouldShowPreview ? 'preview' : 'active'}`}
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -30 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="min-h-[200px] sm:min-h-[280px] flex flex-col justify-center"
//                 >
//                   {renderedContent}
//                 </motion.div>
//               </AnimatePresence>

//               {/* Save button for edit mode */}
//               {isInEditMode && (
//                 <div className="absolute bottom-4 right-4 z-10">
//                   <motion.button
//                     onClick={() => handleSaveEdit(currentStepIndex)}
//                     className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-neutral-900 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <svg
//                       className="w-4 h-4 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     Save Changes
//                   </motion.button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 p-4 sm:p-4 lg:p-6 border-t border-neutral-800">
//             <button
//               onClick={prevStep}
//               disabled={currentStepIndex === 0}
//               className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg border border-neutral-700 order-2 sm:order-1"
//             >
//               Previous
//             </button>
//             <button
//               onClick={nextStep}
//               disabled={currentStepIndex === stepsData.length - 1}
//               className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg order-1 sm:order-2"
//             >
//               {currentStepIndex === stepsData.length - 1 ? "Finish" : "Next"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState } from "react"

// export default function FlipAuthCard() {
//   const [isFlipped, setIsFlipped] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//   })

//   const handleInputChange = (e: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const handleSignIn = (e: any) => {
//     e.preventDefault()
//     console.log("Sign in:", { email: formData.email, password: formData.password })
//   }

//   const handleSignUp = (e: any) => {
//     e.preventDefault()
//     console.log("Sign up:", formData)
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black p-4">
//       <div className=" w-[400px] min-h-[600px] perspective-distant">
//         <div className={`flip-card relative w-full h-auto ${isFlipped ? "flipped" : ""}`}>
//           {/* Sign In Side */}
//           <div className="flip-card-front absolute w-full h-auto">
//             <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
//               {/* Enhanced Grid Background */}
//               <div className="absolute inset-0 opacity-20">
//                 <div className="grid-pattern"></div>
//               </div>

//               {/* Glowing orb */}
//               <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
//               <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl"></div>

//               <div className="relative z-10 p-8 h-full flex flex-col justify-center">
//                 <div className="text-center mb-10">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl mb-6 shadow-lg shadow-cyan-500/25">
//                     <div className="w-8 h-8 border-2 border-white rounded-lg"></div>
//                   </div>
//                   <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
//                     Welcome Back
//                   </h2>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-slate-300 ml-1">Email Address</label>
//                     <div className="relative group">
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-4 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50"
//                         style={{
//                           boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)'
//                         }}
//                         required
//                       />
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-slate-300 ml-1">Password</label>
//                     <div className="relative group">
//                       <input
//                         type="password"
//                         name="password"
//                         placeholder="Enter your password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-4 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50"
//                         style={{
//                           boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)'
//                         }}
//                         required
//                       />
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleSignIn}
//                     className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
//                   >
//                     <span className="flex items-center justify-center space-x-2">
//                       <span>Initialize Connection</span>
//                     </span>
//                   </button>
//                 </div>

//                 <div className="mt-8 text-center">
//                   <p className="text-slate-400">
//                     New to the system?{" "}
//                     <button
//                       onClick={() => setIsFlipped(true)}
//                       className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text hover:from-cyan-300 hover:to-purple-300 font-semibold transition-all duration-300 hover:scale-105 inline-block"
//                     >
//                       Create Account
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sign Up Side */}
//           <div className="flip-card-back absolute w-full h-auto">
//             <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
//               {/* Enhanced Grid Background */}
//               <div className="absolute inset-0 opacity-20">
//                 <div className="grid-pattern"></div>
//               </div>

//               {/* Glowing orbs */}
//               <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
//               <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>

//               <div className="relative z-10 p-8 h-full flex flex-col justify-center">
//                 <div className="text-center mb-8">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/25">
//                     <div className="w-8 h-8 border-2 border-white rounded-lg rotate-45"></div>
//                   </div>
//                   <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
//                     Join the Network
//                   </h2>
//                 </div>

//                 <div className="space-y-5">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-slate-300 ml-1">Full Name</label>
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Enter your full name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50"
//                         style={{
//                           boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)'
//                         }}
//                         required
//                       />
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-slate-300 ml-1">Full Name</label>
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Enter your full name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50"
//                         style={{
//                           boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)'
//                         }}
//                         required
//                       />
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-slate-300 ml-1">Full Name</label>
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         name="name"
//                         placeholder="Enter your full name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50"
//                         style={{
//                           boxShadow: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)'
//                         }}
//                         required
//                       />
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleSignUp}
//                     className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
//                   >
//                     <span className="flex items-center justify-center space-x-2">
//                       <span>Establish Connection</span>
//                     </span>
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <p className="text-slate-400">
//                     Already connected?{" "}
//                     <button
//                       onClick={() => setIsFlipped(false)}
//                       className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text hover:from-purple-300 hover:to-cyan-300 font-semibold transition-all duration-300 hover:scale-105 inline-block"
//                     >
//                       Sign In
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style>{`
//           .flip-card {
//             transform-style: preserve-3d;
//             transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//           }
//           .flip-card.flipped {
//             transform: rotateY(180deg);
//           }
//           .flip-card-front,
//           .flip-card-back {
//             backface-visibility: hidden;
//           }
//           .flip-card-back {
//             transform: rotateY(180deg);
//           }
//           .grid-pattern {
//               background-image: 
//                 radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 1.2px, transparent 1.2px),
//                 linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
//                 linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
//               background-size: 40px 40px, 100% 2px, 2px 100%;
//               background-position: 0 0, 0 0, 0 0;
//               width: 100%;
//                         height: 100%;
//                         position: relative;
//           }

//           .grid-pattern::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-image: 
//               linear-gradient(45deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
//               linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
//             background-size: 20px 20px;
//           }

//           .grid-pattern::after {
//             content: '';
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             width: 200px;
//             height: 200px;
//             background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
//             transform: translate(-50%, -50%);
//             border-radius: 50%;
//             animation: pulse 4s ease-in-out infinite;
//           }

//           @keyframes pulse {
//             0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//             50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
//           }


//           @keyframes pulse {
//             0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
//             50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
//           }

//           @media (max-width: 480px) {
//             .flip-card-container {
//               width: 350px;
//               height: 600px;
//             }
//           }
//         `}</style>
//       </div>
//     </div>
//   )
// }


import FlipFormDemo from '@/components/heliokit/flip-form/FlipFormDemo'


const Trial = () => {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-black p-4`}>
      <FlipFormDemo />
    </div>
  )
}

export default Trial
