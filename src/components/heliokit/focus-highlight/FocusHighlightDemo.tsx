import React from "react";
import { FocusHighlight } from "./FocusHighlight";

export default function FocusHighlightShowcase() {
  const [kbdActive, setKbdActive] = React.useState(true); // start focused to show effect

  return (
    <div className="min-h-[60vh] w-full bg-[#0A0F1C] text-white px-6 py-10 flex flex-col gap-8">
      {/* Row 1: Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Click to Focus */}
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <h3 className="text-lg font-semibold text-sky-200">Click to Focus</h3>
          </header>

          <FocusHighlight.Root
            className="rounded-2xl p-6 bg-white/5 backdrop-blur-md ring-1 ring-white/10"
            accentColor="#60A5FA"
            borderColor="rgba(96,165,250,0.9)"
            glowColor="rgba(96,165,250,0.25)"
            triggerOnClick
            triggerOnFocus
            ariaLabel="Interactive card – click to focus"
          >
            <div className="space-y-1">
              <div className="text-xl font-semibold">Interactive Card</div>
              <p className="text-sm text-white/80">
                Click me to see the glassmorphism focus effect!
              </p>
            </div>
          </FocusHighlight.Root>
        </section>

        {/* Keyboard Focus */}
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-lg font-semibold text-emerald-200">Keyboard Focus</h3>
          </header>

          <FocusHighlight.Root
            className="rounded-2xl p-6 bg-white/5 backdrop-blur-md ring-1 ring-white/10"
            accentColor="#34D399"
            borderColor="rgba(52,211,153,0.9)"
            glowColor="rgba(52,211,153,0.25)"
            active={kbdActive}
            onActiveChange={setKbdActive}
            triggerOnFocus
            ariaLabel="Focusable element – tab to focus"
          >
            <div className="space-y-1">
              <div className="text-xl font-semibold">Focusable Element</div>
              <p className="text-sm text-white/80">
                Tab to focus or click to see the effect!
              </p>
            </div>
          </FocusHighlight.Root>
        </section>
      </div>

      {/* Row 2: Hover */}
      <section className="space-y-3 max-w-[960px]">
        <header className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
          <h3 className="text-lg font-semibold text-fuchsia-200">Hover Effect</h3>
        </header>

        <FocusHighlight.Root
          className="rounded-2xl p-6 bg-white/5 backdrop-blur-md ring-1 ring-white/10"
          accentColor="#A78BFA"
          borderColor="rgba(167,139,250,0.9)"
          glowColor="rgba(167,139,250,0.25)"
          triggerOnHover
          ariaLabel="Hover card – hover to preview"
        >
          <div className="space-y-1">
            <div className="text-xl font-semibold">Hover Card</div>
            <p className="text-sm text-white/80">
              Hover over me to see the smooth effect!
            </p>
          </div>
        </FocusHighlight.Root>
      </section>
    </div>
  );
}
