import FocusHighlightDemo from "@/components/heliokit/focus-highlight/FocusHighlightDemo";

// docs/focus-highlight.doc.tsx

// --- JSX Demo used in the docs code export ---
const focusHighlightJSXDemo = `
<div className="min-h-[60vh] w-full bg-neutral-950 text-neutral-100 p-8" >
  <h2 className="text-2xl font-bold mb-6" >FocusHighlight — 3-up Demo< /h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
    {/* 1) Uncontrolled (click + focus) */}
    <FocusHighlight.Root
      className="rounded-xl p-6 bg-neutral-900/80 ring-1 ring-white/10"
      accentColor="#60A5FA"
      borderColor="rgba(96,165,250,0.9)"
      glowColor="rgba(96,165,250,0.25)"
      triggerOnClick
      triggerOnFocus
      ariaLabel="Uncontrolled highlight"
    >
      <div className="space-y-1" >
        <div className="text-lg font-semibold" >Uncontrolled< /div>
        <p className="text-sm text-neutral-300" >
          Click or focus to activate.
        </p>
      <div>
    </FocusHighlight.Root>
</div>
`.replace(/< /g, "</").trim();

const focusHighlightImport = `import { FocusHighlight } from '@/components/heliokit/focus-highlight'`;

// --- Your actual demo used in the docs preview ---
export const PreviewComponent = FocusHighlightDemo;

// --- The "code" block shown to users (import + JSX) ---
export const code = `${focusHighlightImport}

export function FocusHighlightDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="min-h-[60vh] w-full bg-neutral-950 text-neutral-100 p-8">
      <h2 className="text-2xl font-bold mb-6">FocusHighlight</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1) Uncontrolled (click + focus) */}
        <FocusHighlight.Root
          className="rounded-xl p-6 bg-neutral-900/80 ring-1 ring-white/10"
          accentColor="#60A5FA"
          borderColor="rgba(96,165,250,0.9)"
          glowColor="rgba(96,165,250,0.25)"
          triggerOnClick
          triggerOnFocus
          ariaLabel="Uncontrolled highlight"
        >
          <div className="space-y-1">
            <div className="text-lg font-semibold">Uncontrolled</div>
            <p className="text-sm text-neutral-300">Click or focus to activate.</p>
          </div>
        </FocusHighlight.Root>
    </div>
  );
}
`;

// --- Description shown in docs ---
export const description =
  "Animated focus/attention wrapper with glass border, glow, corner accents, and a guided cursor. Works in controlled/uncontrolled modes and supports click/focus/hover triggers with color tokens.";

// --- CLI Steps (if you ship a generator) ---
export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add focus-highlight"],
  },
  {
    id: 2,
    title: "Import the module",
    codeSnippets: [
      {
        filename: "components/ExampleFocusHighlight.tsx",
        language: "tsx",
        code: focusHighlightImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the component",
    codeSnippets: [
      {
        filename: "components/ExampleFocusHighlight.tsx",
        language: "tsx",
        code: focusHighlightJSXDemo,
      },
    ],
  },
];

// --- Manual Steps (for users not using CLI) ---
const manualFocusHighlightCode = `import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

function cn(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

type FocusCtx = {
  id: string;
  isActive: boolean;
  setActive: (next: boolean | ((p: boolean) => boolean)) => void;
  animationDuration: number;
  dimensions: { width: number; height: number };
  setDimensions: (wh: { width: number; height: number }) => void;
  tokens: {
    accent: string;
    border: string;
    glow: string;
  };
  triggers: {
    click: boolean;
    focus: boolean;
    hover: boolean;
  };
};

const FocusContext = createContext<FocusCtx | undefined>(undefined);
function useFocusCtx() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error("FocusHighlight.* must be used within <FocusHighlight.Root />");
  return ctx;
}

export type FocusHighlightRootProps = {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  defaultActive?: boolean;
  onActiveChange?: (next: boolean) => void;
  accentColor?: string;
  borderColor?: string;
  glowColor?: string;
  triggerOnClick?: boolean;
  triggerOnFocus?: boolean;
  triggerOnHover?: boolean;
  animationDuration?: number;
  role?: string;
  ariaLabel?: string;
} & HTMLMotionProps<"div">;

function useControlledBoolean(
  value: boolean | undefined,
  defaultValue: boolean | undefined,
  onChange?: (v: boolean) => void
) {
  const [internal, setInternal] = useState<boolean>(defaultValue ?? false);
  const isControlled = value !== undefined;

  const set = useCallback(
    (next: boolean | ((p: boolean) => boolean)) => {
      if (isControlled) {
        const final = typeof next === "function" ? (next as (p: boolean) => boolean)(value!) : next;
        onChange?.(final);
      } else {
        setInternal(next as boolean);
        onChange?.(typeof next === "function" ? (next as (p: boolean) => boolean)(internal) : (next as boolean));
      }
    },
    [isControlled, value, onChange, internal]
  );

  return [isControlled ? (value as boolean) : internal, set] as const;
}

export const FocusHighlightRoot = forwardRef<HTMLDivElement, FocusHighlightRootProps>(
  (
    {
      children,
      className,
      active,
      defaultActive,
      onActiveChange,
      accentColor = "#60A5FA",
      borderColor = "rgba(96,165,250,0.9)",
      glowColor = "rgba(96,165,250,0.25)",
      triggerOnClick = true,
      triggerOnFocus = true,
      triggerOnHover = false,
      animationDuration = 0.6,
      role = "button",
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();
    const [isActive, setIsActive] = useControlledBoolean(active, defaultActive, onActiveChange);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    /* measure */
    useEffect(() => {
      if (!containerRef.current) return;
      const update = () => {
        const rect = containerRef.current!.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, []);

    /* handlers */
    const handleClick = useCallback(() => {
      if (triggerOnClick) setIsActive((p) => !p);
    }, [triggerOnClick, setIsActive]);

    const handleFocus = useCallback(() => {
      if (triggerOnFocus) setIsActive(true);
    }, [triggerOnFocus, setIsActive]);

    const handleBlur = useCallback(() => {
      if (triggerOnFocus) setIsActive(false);
    }, [triggerOnFocus, setIsActive]);

    const handleMouseEnter = useCallback(() => {
      if (triggerOnHover) setIsActive(true);
    }, [triggerOnHover, setIsActive]);

    const handleMouseLeave = useCallback(() => {
      if (triggerOnHover) setIsActive(false);
    }, [triggerOnHover, setIsActive]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
        if (e.key === "Escape") setIsActive(false);
      },
      [handleClick, setIsActive]
    );

    const id = useId();
    const ctx: FocusCtx = useMemo(
      () => ({
        id,
        isActive,
        setActive: setIsActive,
        animationDuration: reduceMotion ? 0 : animationDuration,
        dimensions,
        setDimensions,
        tokens: { accent: accentColor, border: borderColor, glow: glowColor },
        triggers: { click: triggerOnClick, focus: triggerOnFocus, hover: triggerOnHover },
      }),
      [
        id,
        isActive,
        setIsActive,
        dimensions,
        animationDuration,
        reduceMotion,
        accentColor,
        borderColor,
        glowColor,
        triggerOnClick,
        triggerOnFocus,
        triggerOnHover,
      ]
    );

    const styleVars: CSSProperties = {
      ["--accent" as any]: ctx.tokens.accent,
      ["--border" as any]: ctx.tokens.border,
      ["--glow" as any]: ctx.tokens.glow,
    };

    return (
      <FocusContext.Provider value={ctx}>
        <motion.div
          ref={mergedRef}
          className={cn(
            "relative inline-block select-none focus:outline-none cursor-pointer",
            className
          )}
          style={styleVars}
          tabIndex={0}
          role={role}
          aria-pressed={isActive}
          aria-label={ariaLabel}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          initial={{ scale: 1 }}
          animate={{ scale: isActive ? 1.02 : 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.2,
          }}
          {...rest}
        >
          {children}
          <AnimatePresence>
            {ctx.isActive && ctx.dimensions.width > 0 && ctx.dimensions.height > 0 && (
              <Overlay />
            )}
          </AnimatePresence>
        </motion.div>
      </FocusContext.Provider>
    );
  }
);
FocusHighlightRoot.displayName = "FocusHighlight.Root";

/* ------------------------------ Overlay (public) ---------------------------- */
export type FocusHighlightOverlayProps = {
  className?: string;
  style?: CSSProperties;
};

export const Overlay = ({ className, style }: FocusHighlightOverlayProps) => {
  const { animationDuration } = useFocusCtx();

  return (
    <motion.div
      className={cn("absolute inset-0 pointer-events-none z-10", className)}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animationDuration * 0.3 }}
    >
      {/* Glass Layer */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, duration: animationDuration * 0.8 }}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}
      />

      {/* Border + Glow */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: animationDuration * 0.3 },
        }}
        style={{
          border: "2px solid var(--border)",
          boxShadow: "
            inset 0 0 20px rgba(255,255,255,0.1),
            inset 0 0 40px rgba(255,255,255,0.05),
            0 0 30px var(--glow),
            0 0 60px var(--glow)
          ",
        }}
      />

      <Corners />
      <Cursor />
    </motion.div>
  );
};
Overlay.displayName = "FocusHighlight.Overlay";

/* ------------------------------ Corners ---------------------------- */
export type FocusHighlightCornersProps = {
  className?: string;
};

export const Corners = ({ className }: FocusHighlightCornersProps) => {
  const { animationDuration } = useFocusCtx();

  const Corner: React.FC<{ pos: "tl" | "tr" | "bl" | "br"; delay: number }> = ({ pos, delay }) => {
    const base = "absolute w-5 h-5";
    const posCls =
      pos === "tl"
        ? "-top-1 -left-1"
        : pos === "tr"
          ? "-top-1 -right-1"
          : pos === "bl"
            ? "-bottom-1 -left-1"
            : "-bottom-1 -right-1";

    const lines =
      pos === "tl" ? (
        <>
          <div className="absolute top-0 left-0 w-4 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
          <div className="absolute top-0 left-0 w-0.5 h-4 rounded-full" style={{ background: "var(--accent)" }} />
        </>
      ) : pos === "tr" ? (
        <>
          <div className="absolute top-0 right-0 w-4 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
          <div className="absolute top-0 right-0 w-0.5 h-4 rounded-full" style={{ background: "var(--accent)" }} />
        </>
      ) : pos === "bl" ? (
        <>
          <div className="absolute bottom-0 left-0 w-4 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
          <div className="absolute bottom-0 left-0 w-0.5 h-4 rounded-full" style={{ background: "var(--accent)" }} />
        </>
      ) : (
        <>
          <div className="absolute bottom-0 right-0 w-4 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
          <div className="absolute bottom-0 right-0 w-0.5 h-4 rounded-full" style={{ background: "var(--accent)" }} />
        </>
      );

    return (
      <motion.div
        className={cn(base, posCls)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: delay * animationDuration * 0.1 }}
      >
        {lines}
      </motion.div>
    );
  };

  return (
    <div className={className}>
      <Corner pos="tl" delay={1} />
      <Corner pos="tr" delay={1.5} />
      <Corner pos="bl" delay={2.5} />
      <Corner pos="br" delay={2} />
    </div>
  );
};
Corners.displayName = "FocusHighlight.Corners";


export type FocusHighlightCursorProps = {
  className?: string;
};

export const Cursor = ({ className }: FocusHighlightCursorProps) => {
  const { dimensions, animationDuration } = useFocusCtx();
  const { width, height } = dimensions;


  const getResponsivePosition = () => {
    const baseOffset = Math.min(width, height) * 0.1; // 10% of smaller dimension
    const minOffset = 8; // minimum offset for very small components
    const maxOffset = 24; // maximum offset for very large components
    
    const offset = Math.max(minOffset, Math.min(maxOffset, baseOffset));
    
    return {
      finalX: width + offset,
      finalY: height + offset,
    };
  };

  const { finalX, finalY } = getResponsivePosition();

  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      initial={{ x: width / 2, y: height / 2, scale: 0, rotate: -45, opacity: 0 }}
      animate={{ x: finalX, y: finalY, scale: 1, rotate: -90, opacity: 1 }}
      exit={{ x: width / 2, y: height / 2, scale: 0, rotate: -45, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: animationDuration * 0.3 }}
      aria-hidden="true"
    >
      {/* pointer glow */}
      <motion.div
        className="absolute inset-0 blur-md opacity-60"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <PointerIcon className="w-7 h-7 drop-shadow-lg" style={{ color: "var(--accent)" }} />
      </motion.div>

      {/* main pointer */}
      <PointerIcon className="relative w-7 h-7 drop-shadow-xl" style={{ color: "var(--accent)" }} />

      {/* trail */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      >
        <PointerIcon className="w-7 h-7" style={{ color: "var(--accent)" }} />
      </motion.div>
    </motion.div>
  );
};
Cursor.displayName = "FocusHighlight.Cursor";


const PointerIcon: React.FC<{ className?: string; style?: CSSProperties }> = ({ className, style }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" style={style}>
    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
  </svg>
);

export const FocusHighlight = {
  Root: FocusHighlightRoot,
  Overlay,
  Corners,
  Cursor,
};`;

export const manualSteps = [
  {
    id: 1,
    title: "Install dependencies",
    commands: ["npm install framer-motion"],
  },
  {
    id: 2,
    title: "Create FocusHighlight component manually",
    codeSnippets: [
      {
        filename: "src/components/heliokit/focus-highlight/index.tsx",
        language: "tsx",
        code: manualFocusHighlightCode,
      },
    ],
  },
  {
    id: 3,
    title: "Use FocusHighlight in your code",
    codeSnippets: [
      {
        filename: "src/components/ExampleFocusHighlight.tsx",
        language: "tsx",
        code: `${focusHighlightImport}

export function ExampleFocusHighlight() {
  return (
    ${focusHighlightJSXDemo}
  );
}`,
      },
    ],
  },
];

// --- Props table (Root / Overlay / Corners / Cursor) ---
export const propsData = [
  {
    componentName: "FocusHighlight.Root",
    props: [
      {
        propName: "children",
        description: "Content to wrap with the focus highlight.",
        type: "ReactNode",
        defaultValue: "—",
      },
      {
        propName: "className",
        description: "Optional Tailwind/CSS classes for the wrapper.",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "active",
        description: "Controlled active state.",
        type: "boolean",
        defaultValue: "undefined",
      },
      {
        propName: "defaultActive",
        description: "Initial state for uncontrolled mode.",
        type: "boolean",
        defaultValue: "false",
      },
      {
        propName: "onActiveChange",
        description: "Callback when active state should change (controlled).",
        type: "(next: boolean) => void",
        defaultValue: "undefined",
      },
      {
        propName: "accentColor",
        description: "Accent color token (CSS color). Used for cursor and accents.",
        type: "string",
        defaultValue: `"#60A5FA"`,
      },
      {
        propName: "borderColor",
        description: "Border color token (CSS color).",
        type: "string",
        defaultValue: `"rgba(96,165,250,0.9)"`,
      },
      {
        propName: "glowColor",
        description: "Outer glow color token (CSS color).",
        type: "string",
        defaultValue: `"rgba(96,165,250,0.25)"`,
      },
      {
        propName: "triggerOnClick",
        description: "Toggle on click.",
        type: "boolean",
        defaultValue: "true",
      },
      {
        propName: "triggerOnFocus",
        description: "Activate on focus; deactivate on blur.",
        type: "boolean",
        defaultValue: "true",
      },
      {
        propName: "triggerOnHover",
        description: "Activate on hover; deactivate on mouse leave.",
        type: "boolean",
        defaultValue: "false",
      },
      {
        propName: "animationDuration",
        description: "Base animation duration in seconds.",
        type: "number",
        defaultValue: "0.6",
      },
      {
        propName: "role",
        description: "ARIA role applied to the wrapper (defaults to 'button').",
        type: "string",
        defaultValue: `"button"`,
      },
      {
        propName: "ariaLabel",
        description: "Accessible label when used as an interactive control.",
        type: "string",
        defaultValue: "undefined",
      },
      {
        propName: "...motionDivProps",
        description: "All other Framer Motion `<motion.div>` props.",
        type: "HTMLMotionProps<'div'>",
        defaultValue: "—",
      },
    ],
  },
  {
    componentName: "FocusHighlight.Overlay",
    props: [
      {
        propName: "className",
        description: "Extra classes for the overlay container.",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "style",
        description: "Inline styles for the overlay container.",
        type: "CSSProperties",
        defaultValue: "undefined",
      },
    ],
  },
  {
    componentName: "FocusHighlight.Corners",
    props: [
      {
        propName: "className",
        description: "Extra classes for the corners wrapper.",
        type: "string",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "FocusHighlight.Cursor",
    props: [
      {
        propName: "className",
        description: "Extra classes for the cursor container.",
        type: "string",
        defaultValue: `""`,
      },
    ],
  },
];
