// docs/FlipForm.doc.ts
import FlipFormDemo from "@/components/heliokit/flip-form/FlipFormDemo"

const flipFormImport = `import { 
  FlipForm, FlipFormFront, FlipFormBack, FlipFormForm, 
  FlipFormHeader, FlipFormField, FlipFormButton, FlipFormLink, useFlipForm 
} from '@/components/FlipForm'`

const flipFormJSXDemo = `
function AuthExample() {
  const [form, setForm] = React.useState({
    email: "", password: "", name: "", confirmPassword: ""
  })
  const update = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="min-h-[80vh] bg-black flex items-center justify-center p-6">
      <FlipForm initialSide="front" className="mt-6">
        <FlipFormFront>
          <FlipFormForm>
            <FlipFormHeader variant="cyan">Welcome Back</FlipFormHeader>

            <div className="space-y-4">
              <FlipFormField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                variant="cyan"
                placeholder="name@example.com"
              />
              <FlipFormField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                variant="cyan"
                placeholder="••••••••"
              />
              {/* Add unlimited fields — same style */}
            </div>

            <div className="mt-6">
              <FlipFormButton variant="cyan" onClick={() => console.log("Sign In", form)}>
                Initialize Connection
              </FlipFormButton>
            </div>

            <div className="mt-6 text-center text-slate-400">
              New to the system?{" "}
              <FlipFormLink variant="cyan" flipTo="back">Create Account</FlipFormLink>
            </div>
          </FlipFormForm>
        </FlipFormFront>

        <FlipFormBack>
          <FlipFormForm>
            <FlipFormHeader variant="purple">Join the Network</FlipFormHeader>

            <div className="space-y-4">
              <FlipFormField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={update}
                variant="purple"
                placeholder="Jane Doe"
              />
              <FlipFormField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                variant="purple"
                placeholder="name@example.com"
              />
              <FlipFormField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                variant="purple"
                placeholder="••••••••"
              />
              <FlipFormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={update}
                variant="purple"
                placeholder="••••••••"
              />
              {/* Add unlimited fields — same style */}
            </div>

            <div className="mt-6">
              <FlipFormButton variant="purple" onClick={() => console.log("Sign Up", form)}>
                Establish Connection
              </FlipFormButton>
            </div>

            <div className="mt-6 text-center text-slate-400">
              Already connected?{" "}
              <FlipFormLink variant="purple" flipTo="front">Sign In</FlipFormLink>
            </div>
          </FlipFormForm>
        </FlipFormBack>
      </FlipForm>
    </div>
  )
}
`

export const PreviewComponent = FlipFormDemo
export const code = `${flipFormImport}\n\nexport function FlipFormDemo() {\n  return (${flipFormJSXDemo})\n}`
export const description = "A flipping sign-in/sign-up card with preserved styling and animations. Supports unlimited fields and external flip control for seamless integration in auth flows."


export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add flip-form"],
    },
    {
        id: 2,
        title: "Import required modules",
        codeSnippets: [
            {
                filename: "components/ExampleFlipForm.tsx",
                language: "tsx",
                code: flipFormImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the FlipForm component",
        codeSnippets: [
            {
                filename: "components/ExampleFlipForm.tsx",
                language: "tsx",
                code: flipFormJSXDemo,
            },
        ],
    },
]


export const manualSteps = [
    {
        id: 1,
        title: "Create the FlipForm component",
        codeSnippets: [
            {
                filename: "src/components/FlipForm.tsx",
                language: "tsx",
                code: `import React, { createContext, useContext, useState, type ReactNode } from "react";
import './FlipForm.css';

const FlipFormContext = createContext<{
  isFlipped: boolean;
  flipToFront: () => void;
  flipToBack: () => void;
  toggleFlip: () => void;
}>({
  isFlipped: false,
  flipToFront: () => {},
  flipToBack: () => {},
  toggleFlip: () => {},
});

interface FlipFormProps {
  children: ReactNode;
  initialSide?: "front" | "back";
  className?: string;
  isFlipped?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
}

export const FlipForm = ({
  children,
  initialSide = "front",
  className,
  isFlipped: externalFlipped,
  onFlipChange,
}: FlipFormProps) => {
  const [internalFlipped, setInternalFlipped] = useState(initialSide === "back");
  const isFlipped = externalFlipped !== undefined ? externalFlipped : internalFlipped;

  const flipToFront = () => {
    if (externalFlipped !== undefined) onFlipChange?.(false);
    else setInternalFlipped(false);
  };

  const flipToBack = () => {
    if (externalFlipped !== undefined) onFlipChange?.(true);
    else setInternalFlipped(true);
  };

  const toggleFlip = () => {
    if (externalFlipped !== undefined) onFlipChange?.(!externalFlipped);
    else setInternalFlipped(prev => !prev);
  };

  return (
    <FlipFormContext.Provider value={{ isFlipped, flipToFront, flipToBack, toggleFlip }}>
      <div className={\`w-full max-w-[460px] min-h-[600px] mx-auto px-4 sm:px-0 perspective-distant \${className || ""}\`}>
        <div className={\`flip-card relative w-full h-auto \${isFlipped ? "flipped" : ""}\`}>
          {children}
        </div>
      </div>
    </FlipFormContext.Provider>
  );
};

export const FlipFormFront = ({ children }: { children: ReactNode }) => (
  <div className="flip-card-front absolute w-full h-auto">
    <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 opacity-20"><div className="grid-pattern"></div></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
      {children}
    </div>
  </div>
);

export const FlipFormBack = ({ children }: { children: ReactNode }) => (
  <div className="flip-card-back absolute w-full h-auto">
    <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 opacity-20"><div className="grid-pattern"></div></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
      {children}
    </div>
  </div>
);

export const FlipFormForm = ({ children }: { children: ReactNode }) => (
  <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center">{children}</div>
);

export const FlipFormHeader = ({ children, icon, variant = "cyan" }: {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "cyan" | "purple";
}) => {
  const iconGradient = variant === "cyan"
    ? "bg-gradient-to-r from-cyan-500 to-purple-500"
    : "bg-gradient-to-r from-purple-500 to-cyan-500";
  const shadowColor = variant === "cyan" ? "shadow-cyan-500/25" : "shadow-purple-500/25";

  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className={\`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 \${iconGradient} rounded-2xl mb-4 sm:mb-6 shadow-lg \${shadowColor}\`}>
        {icon || <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white rounded-lg"></div>}
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
        {children}
      </h2>
    </div>
  );
};

export const FlipFormField = ({ label, type = "text", name, value, onChange, placeholder, variant = "cyan" }: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: "cyan" | "purple";
}) => {
  const focusRing = variant === "cyan" ? "focus:ring-cyan-400/50" : "focus:ring-purple-400/50";
  const hoverGradient = variant === "cyan" ? "from-cyan-400/5 to-purple-400/5" : "from-purple-400/5 to-cyan-400/5";

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium text-slate-300 ml-1">{label}</label>
      <div className="relative group">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={\`w-full px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 \${focusRing} focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50 text-sm sm:text-base\`}
          style={{ boxShadow: "inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)" }}
          required
        />
        <div className={\`absolute inset-0 rounded-2xl bg-gradient-to-r \${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none\`}></div>
      </div>
    </div>
  );
};

export const FlipFormButton = ({ children, onClick, variant = "cyan" }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "purple";
}) => {
  const styles = variant === "cyan"
    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:ring-cyan-400/50"
    : "bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 shadow-purple-500/25 hover:shadow-purple-500/40 focus:ring-purple-400/50";

  return (
    <button
      onClick={onClick}
      className={\`w-full py-3 px-4 sm:py-4 sm:px-6 \${styles} text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 text-sm sm:text-base\`}
    >
      <span className="flex items-center justify-center space-x-2">
        <span>{children}</span>
      </span>
    </button>
  );
};

export const FlipFormLink = ({ children, onClick, variant = "cyan", flipTo }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "purple";
  flipTo?: "front" | "back";
}) => {
  const { flipToFront, flipToBack } = useContext(FlipFormContext);
  const gradientColors = variant === "cyan"
    ? "from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300"
    : "from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300";

  const handleClick = () => {
    onClick?.();
    if (flipTo === "front") flipToFront();
    else if (flipTo === "back") flipToBack();
  };

  return (
    <button
      onClick={handleClick}
      className={\`text-transparent bg-gradient-to-r \${gradientColors} bg-clip-text font-semibold transition-all duration-300 hover:scale-105 inline-block text-sm sm:text-base\`}
    >
      {children}
    </button>
  );
};

export const useFlipForm = () => useContext(FlipFormContext);
`,
            },
        ],
    },
    {
        id: 2,
        title: "Add required CSS for flipping",
        codeSnippets: [
            {
                filename: "src/components/FlipForm.css",
                language: "css",
                code: `
.perspective-distant { perspective: 1200px; }
.flip-card { transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.flip-card.flipped { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.flip-card-back { transform: rotateY(180deg); }

/* Grid aura from your original */
.grid-pattern {
  background-image:
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1.2px, transparent 1.2px),
    linear-gradient(0deg, rgba(255,255,255,0.1) 0%, transparent 50%),
    linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 50%);
  background-size: 40px 40px, 100% 2px, 2px 100%;
  background-position: 0 0, 0 0, 0 0;
  width: 100%; height: 100%; position: relative;
}
.grid-pattern::before {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
.grid-pattern::after {
  content: ""; position: absolute; top: 50%; left: 50%;
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: .3; transform: translate(-50%,-50%) scale(1); }
  50%     { opacity: .6; transform: translate(-50%,-50%) scale(1.1); }
}
`,
            },
        ],
    },
    {
        id: 3,
        title: "Use the FlipForm in your app",
        codeSnippets: [
            {
                filename: "src/components/ExampleFlipForm.tsx",
                language: "tsx",
                code: flipFormJSXDemo,
            },
        ],
    },
]


export const propsData = [
  {
    componentName: "FlipForm",
    props: [
      {
        propName: "children",
        description: "The content of the FlipForm, typically FlipFormFront and FlipFormBack components",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "initialSide",
        description: "The side to display initially",
        type: `"front" | "back"`,
        defaultValue: `"front"`,
      },
      {
        propName: "className",
        description: "Optional CSS classes for styling the outer FlipForm container",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "isFlipped",
        description: "If provided, enables controlled mode where this value decides which side is shown",
        type: "boolean",
        defaultValue: `"false"`,
      },
      {
        propName: "onFlipChange",
        description: "Callback fired when the flip state changes (used in controlled mode)",
        type: "(isFlipped: boolean) => void",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "FlipFormFront",
    props: [
      {
        propName: "children",
        description: "The content to render on the front side of the FlipForm",
        type: "ReactNode",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "FlipFormBack",
    props: [
      {
        propName: "children",
        description: "The content to render on the back side of the FlipForm",
        type: "ReactNode",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "FlipFormForm",
    props: [
      {
        propName: "children",
        description: "The form content to be placed inside either the front or back side",
        type: "ReactNode",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "FlipFormHeader",
    props: [
      {
        propName: "children",
        description: "The header text content",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "icon",
        description: "Optional icon element to display above the header",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "variant",
        description: "Color gradient variant for the header",
        type: `"cyan" | "purple"`,
        defaultValue: `"cyan"`,
      },
    ],
  },
  {
    componentName: "FlipFormField",
    props: [
      {
        propName: "label",
        description: "Label text for the input field",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "type",
        description: "HTML input type",
        type: "string",
        defaultValue: `"text"`,
      },
      {
        propName: "name",
        description: "The input's name attribute",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "value",
        description: "The current value of the input",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "onChange",
        description: "Handler called when the input value changes",
        type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
        defaultValue: `""`,
      },
      {
        propName: "placeholder",
        description: "Optional placeholder text",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "variant",
        description: "Color gradient variant for focus/hover styles",
        type: `"cyan" | "purple"`,
        defaultValue: `"cyan"`,
      },
    ],
  },
  {
    componentName: "FlipFormButton",
    props: [
      {
        propName: "children",
        description: "The button text or elements",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "onClick",
        description: "Click handler for the button",
        type: "() => void",
        defaultValue: `""`,
      },
      {
        propName: "variant",
        description: "Color gradient variant for the button",
        type: `"cyan" | "purple"`,
        defaultValue: `"cyan"`,
      },
    ],
  },
  {
    componentName: "FlipFormLink",
    props: [
      {
        propName: "children",
        description: "The link text or elements",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "onClick",
        description: "Optional click handler",
        type: "() => void",
        defaultValue: `""`,
      },
      {
        propName: "variant",
        description: "Color gradient variant for the link text",
        type: `"cyan" | "purple"`,
        defaultValue: `"cyan"`,
      },
      {
        propName: "flipTo",
        description: "Flips the card to a specific side when clicked",
        type: `"front" | "back"`,
        defaultValue: `""`,
      },
    ],
  },
]
