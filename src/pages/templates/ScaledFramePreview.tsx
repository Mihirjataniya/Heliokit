import React, { useEffect, useRef, useState } from 'react'

/**
 * Renders a full-page template inside an iframe, scaled down to fit the doc
 * column. The iframe isolates the template's styles (its own dark theme, fonts,
 * fixed widths) from the site chrome and vice-versa, so the preview shows the
 * real page without CSS bleed. Width is measured live; height follows scale.
 */
const DESIGN_W = 1440
const FRAME_H = 900

const ScaledFramePreview: React.FC<{ src: string; title: string }> = ({ src, title }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const update = () => setScale(el.clientWidth / DESIGN_W)
        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className="relative w-full overflow-hidden rounded-xl border border-border-primary bg-black"
            style={{ height: scale ? FRAME_H * scale : FRAME_H * 0.6 }}
        >
            {scale > 0 && (
                <iframe
                    src={src}
                    title={title}
                    loading="lazy"
                    style={{ width: DESIGN_W, height: FRAME_H, border: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}
                />
            )}
        </div>
    )
}

export default ScaledFramePreview
