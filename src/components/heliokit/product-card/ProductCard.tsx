import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react'
import React, { useState, useEffect, useRef, type MouseEvent } from 'react'

interface ProductCardProps {
    title: string
    subtitle: string
    images: string[]
    price: number
    originalPrice: number
    rating: number
    reviewCount: number
    size: string
    stockText?: string
    shippingText?: string
    textColorClass?: string
}

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    subtitle,
    images,
    price,
    originalPrice,
    rating,
    reviewCount,
    size,
    stockText = 'In Stock',
    shippingText = 'Free Shipping',
    textColorClass = "text-white"
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const cardRef = useRef<HTMLDivElement | null>(null)
    const x = useRef(0)
    const y = useRef(0)

    const changeImage = (direction: number, e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + direction + images.length) % images.length
        )
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        x.current = ((e.clientX - rect.left - centerX) / centerX) * 13
        y.current = ((e.clientY - rect.top - centerY) / centerY) * 13
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
        setIsHovered(false)
        x.current = 0
        y.current = 0
    }

    useEffect(() => {
        const card = cardRef.current
        let rafId: number

        const animate = () => {
            if (card) {
                card.style.transform = `rotateX(${-y.current}deg) rotateY(${x.current}deg) scale(${isHovered ? 1.05 : 1
                    })`
            }
            rafId = requestAnimationFrame(animate)
        }

        animate()
        return () => cancelAnimationFrame(rafId)
    }, [isHovered])

    useEffect(() => {
        images.forEach((src) => {
            const img = new Image()
            img.src = src
        })
    }, [])

    return (
        <div
            className=""
            style={{ perspective: '1000px' }}
        >
            <div
                ref={cardRef}
                className="w-96 h-[520px] rounded-3xl overflow-hidden relative shadow-2xl transition-transform duration-300 ease-linear cursor-pointer group will-change-transform"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className={`absolute top-7 left-7 width-full z-20 flex items-center ${textColorClass} justify-between`}>
                    <div className="text-left">
                        <div className="text-xs opacity-50 font-light uppercase tracking-wider mb-1">
                            {stockText}
                        </div>
                        <div className="text-xs opacity-50">{shippingText}</div>
                    </div>
                </div>

                {/* Image */}
                <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
                    <img
                        src={images[currentImageIndex]}
                        alt={title}
                        className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-3xl pointer-events-none" />
                </div>

                {/* Carousel Buttons */}
                <button
                    onClick={(e) => changeImage(-1, e)}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center ${textColorClass} text-sm opacity-0 group-hover:opacity-100 transition hover:bg-black/50`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    onClick={(e) => changeImage(1, e)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center ${textColorClass} text-sm opacity-0 group-hover:opacity-100 transition hover:bg-black/50`}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Gradient overlays */}
                <div className="absolute bottom-0 left-0 right-0 h-96 z-10 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none rounded-b-3xl" />
                <div className="absolute top-0 left-0 right-0 h-16 z-10 bg-gradient-to-b from-black/20 via-black/10 to-transparent pointer-events-none rounded-t-3xl" />

                {/* Content */}
                <div className={`absolute bottom-0 left-0 right-0 p-7 z-20 ${textColorClass}`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h2 className="text-2xl font-medium mb-1 leading-tight tracking-tight">{title}</h2>
                            <p className="text-sm opacity-60 font-light">{subtitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`${textColorClass} text-sm opacity-90`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm opacity-70 font-light">{rating}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-60 font-light">{reviewCount} reviews</div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-extralight tracking-wider">${price}</span>
                            <span className="text-base line-through opacity-50 font-light">${originalPrice}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-50 font-light uppercase tracking-wider mb-1">Size</div>
                            <div className="text-sm opacity-80">{size}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 h-12 rounded-md">
                        <button className={`flex-1 h-full bg-white/25 backdrop-blur-xl border border-white/20 ${textColorClass} text-sm font-normal tracking-widest cursor-pointer transition-all duration-500 uppercase hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 rounded-md flex items-center justify-center gap-2`}>
                            <ShoppingCart /> Add to Cart
                        </button>

                        <button
                            className={`w-12 h-full bg-white/25 backdrop-blur-xl border border-white/20 ${textColorClass} text-sm font-normal tracking-widest cursor-pointer transition-all duration-500 uppercase hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 flex items-center justify-center rounded-md`}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsLiked(!isLiked)
                            }}
                        >
                            <Heart
                                className={`w-4 h-4 ${isLiked ? `${textColorClass}` : ''}`}
                            />

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
