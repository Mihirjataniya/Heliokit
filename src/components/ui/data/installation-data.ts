export interface InstallationStep {
  id: number
  title: string
  commands?: string[]
  codeSnippets?: {
    filename: string
    language: string
    code: string
  }[]
}

export const cliSteps: InstallationStep[] = [
  {
    id: 1,
    title: "Install the package",
    commands: ["npm install @myui/components"],
  },
  {
    id: 2,
    title: "Add the CSS import",
    codeSnippets: [
      {
        filename: "app/globals.css",
        language: "css",
        code: `@import "@myui/components/styles.css";

/* Your existing styles */
body {
  margin: 0;
  padding: 0;
}`,
      },
    ],
  },
  {
    id: 3,
    title: "Start using components",
    codeSnippets: [
      {
        filename: "components/example.tsx",
        language: "tsx",
        code: `import { Button, Card } from "@myui/components";

export default function Example() {
  return (
    <Card>
      <Button variant="primary">
        Click me
      </Button>
    </Card>
  );
}`,
      },
    ],
  },
]

export const manualSteps: InstallationStep[] = [
  {
    id: 1,
    title: "Install dependencies",
    commands: ["npm install clsx tailwind-merge class-variance-authority"],
  },
  {
    id: 2,
    title: "Create the utils file",
    codeSnippets: [
      {
        filename: "lib/utils.ts",
        language: "typescript",
        code: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  },
  {
    id: 3,
    title: "Configure Tailwind CSS",
    codeSnippets: [
      {
        filename: "tailwind.config.js",
        language: "javascript",
        code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
};`,
      },
    ],
  },
  {
    id: 4,
    title: "Add component files",
    codeSnippets: [
      {
        filename: "components/ui/button.tsx",
        language: "tsx",
        code: `import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}`,
      },
    ],
  },
]
