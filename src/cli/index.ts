#!/usr/bin/env node
import { program } from "commander"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import inquirer from "inquirer"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import chalk from "chalk"


const templatesPath = path.join(__dirname, "../src/components/heliokit")
const pageTemplatesPath = path.join(__dirname, "../src/pages/templates")

// Full-page templates the CLI can copy. `file` is the source under
// src/pages/templates; `components` are HelioKit component slugs the page
// imports and that the user must add separately.
const TEMPLATE_MANIFEST: Record<string, { file: string; components: string[] }> = {
  "saas-landing-page": {
    file: "SaasLanding.tsx",
    components: ["meteor-shower", "crystal-text", "text-reflection", "focus-highlight", "accordion", "brutal-pricing"],
  },
  "financial-overview": {
    file: "FinancialOverview.tsx",
    components: [],
  },
  "kanban-board": {
    file: "KanbanBoard.tsx",
    components: [],
  },
}

const configPath = path.join(process.cwd(), ".heliokitrc")

async function saveUserConfig(config: { framework: string; defaultPath: string }) {
  await fs.writeJson(configPath, config, { spaces: 2 })
}

async function getUserConfig(): Promise<{ framework?: string; defaultPath?: string }> {
  try {
    return await fs.readJson(configPath)
  } catch {
    return {}
  }
}

// Resolve (and remember) where components should be copied. Prompts only the
// first time; later runs reuse .heliokitrc.
async function resolveDestRoot(): Promise<string> {
  const savedConfig = await getUserConfig();
  let framework: string = savedConfig.framework ?? "";
  let destRoot: string = savedConfig.defaultPath ?? "";

  if (destRoot) return destRoot;

  if (!framework) {
    const result = await inquirer.prompt([
      {
        type: "list",
        name: "framework",
        message: "What framework are you using?",
        choices: ["Vite", "Next.js", "Custom"],
      },
    ]);
    framework = result.framework;
  }

  if (framework === "Vite" || (framework === "Next.js" && await fs.pathExists("src"))) {
    destRoot = "src/components";
  } else if (framework === "Next.js") {
    console.log(chalk.yellow("⚠️ No 'src/' folder found. Creating 'components/' in project root."));
    destRoot = "components";
  } else {
    const { customPath } = await inquirer.prompt([
      {
        type: "input",
        name: "customPath",
        message: "Enter custom path (relative to project root):",
        default: "src/components",
      },
    ]);
    destRoot = customPath;
  }

  const { remember } = await inquirer.prompt([
    {
      type: "confirm",
      name: "remember",
      message: "💾 Do you want to remember this setup for future commands?",
      default: true,
    },
  ]);
  if (remember) await saveUserConfig({ framework, defaultPath: destRoot });

  return destRoot;
}

// Copy a set of component folders into destRoot.
async function copyComponents(components: string[], destRoot: string) {
  for (const component of components) {
    const src = path.join(templatesPath, component);
    const dest = path.join(process.cwd(), destRoot, component);

    if (!(await fs.pathExists(src))) {
      console.error(chalk.red(`❌ Component "${component}" not found.`));
      continue;
    }

    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
    console.log(chalk.green(`✅ "${component}" copied to ${path.join(destRoot, component)}`));
  }
}

program
  .command("add <components...>")
  .description("Add one or more components from HelioKit")
  .action(async (components: string[]) => {
    const destRoot = await resolveDestRoot();
    await copyComponents(components, destRoot);
  });

program
  .command("add-template <template>")
  .description("Add a full-page template from HelioKit")
  .action(async (template) => {
    const entry = TEMPLATE_MANIFEST[template];
    if (!entry) {
      console.error(chalk.red(`❌ Template "${template}" not found.`));
      console.log(chalk.gray("Available: ") + Object.keys(TEMPLATE_MANIFEST).join(", "));
      process.exit(1);
    }

    const src = path.join(pageTemplatesPath, entry.file);
    if (!(await fs.pathExists(src))) {
      console.error(chalk.red(`❌ Template source "${entry.file}" missing from package.`));
      process.exit(1);
    }

    const destDir = path.join(process.cwd(), "src/pages/templates");
    const dest = path.join(destDir, entry.file);
    await fs.ensureDir(destDir);
    await fs.copy(src, dest);
    console.log(chalk.green(`✅ "${template}" copied to ${path.join("src/pages/templates", entry.file)}`));

    // Pull in the HelioKit components the template imports, so the page works
    // without a second command.
    if (entry.components.length) {
      console.log(chalk.yellow(`\n📦 Adding ${entry.components.length} component(s) this template uses…`));
      const destRoot = await resolveDestRoot();
      await copyComponents(entry.components, destRoot);
      console.log(chalk.gray("\nThis template uses the HelioKit Tailwind theme tokens — run ") + chalk.cyan("npx heliokit@latest init") + chalk.gray(" if you haven't."));
    }
  });

program
  .command("list-templates")
  .description("List all available templates from HelioKit")
  .action(() => {
    console.log(chalk.blue("---> Available templates:\n"));
    Object.keys(TEMPLATE_MANIFEST).forEach((t) => console.log("  " + chalk.cyan(`- ${t}`)));
  });

program
  .command("list")
  .description("List all available components from HelioKit")
  .action(async () => {
    const components = await fs.readdir(templatesPath);

    console.log(chalk.blue("---> Available components:\n"));
    components.forEach((comp: string) => {
      console.log("  " + chalk.cyan(`- ${comp}`));
    });
  });


async function installDependencies(framework: string) {
  console.log(chalk.yellow("📦 Installing ") + chalk.magenta("tailwindcss") + (framework === "Vite" ? " + @tailwindcss/vite" : " + @tailwindcss/postcss + postcss"));
  if (framework === "Vite") {
    execSync(`npm install -D tailwindcss @tailwindcss/vite`, { stdio: "inherit" });
  } else {
    execSync(`npm install -D tailwindcss @tailwindcss/postcss postcss`, { stdio: "inherit" });
  }

  console.log(chalk.yellow("📦 Installing ") + chalk.magenta("framer-motion"));
  execSync(`npm install framer-motion`, { stdio: "inherit" });

  console.log(chalk.yellow("📦 Installing ") + chalk.magenta("lucide-react"));
  execSync(`npm install lucide-react`, { stdio: "inherit" });
}

async function ensureTailwindCssImport(cssPath: string) {
  const importStatement = `@import "tailwindcss";`

  if (!(await fs.pathExists(cssPath))) {
    await fs.outputFile(cssPath, `${importStatement}\n`)
    console.log(chalk.green("✅ Created ") + chalk.cyan(cssPath))
  } else {
    const content = await fs.readFile(cssPath, "utf8")
    if (!content.includes(importStatement)) {
      await fs.appendFile(cssPath, `\n${importStatement}\n`)
      console.log(chalk.green("🔧 Appended @import to ") + chalk.cyan(cssPath))
    } else {
      console.log(chalk.gray("✔️ Already present: ") + chalk.cyan(cssPath))
    }
  }
}

program
  .command("init")
  .description("Set up Tailwind CSS v4 for Vite or Next.js")
  .action(async () => {
    console.log(chalk.cyan("🚀 Starting ") + chalk.bold("Tailwind CSS setup...") + "\n");

    const { framework } = await inquirer.prompt([
      {
        type: "list",
        name: "framework",
        message: "What framework are you using?",
        choices: ["Vite", "Next.js"],
      },
    ]);

    await installDependencies(framework);

    if (framework === "Vite") {
      const viteConfigPath = path.join(process.cwd(), "vite.config.ts");
      if (await fs.pathExists(viteConfigPath)) {
        let viteContent = await fs.readFile(viteConfigPath, "utf8");
        if (!viteContent.includes("@tailwindcss/vite")) {
          viteContent = `import tailwindcss from "@tailwindcss/vite"\n` + viteContent;
          viteContent = viteContent.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
          await fs.writeFile(viteConfigPath, viteContent, "utf8");
          console.log(chalk.green("✅ Updated ") + chalk.cyan("vite.config.ts"));
        }
      }
      await ensureTailwindCssImport(path.join(process.cwd(), "src/index.css"));
    }

    if (framework === "Next.js") {
      const postcssPath = path.join(process.cwd(), "postcss.config.mjs");
      if (!(await fs.pathExists(postcssPath))) {
        await fs.outputFile(postcssPath, `const config = {\n  plugins: {\n    "@tailwindcss/postcss": {},\n  },\n};\n\nexport default config;\n`);
        console.log("✅ Created postcss.config.mjs");
      }
      await ensureTailwindCssImport(path.join(process.cwd(), "src/app/globals.css"));
      await ensureTailwindCssImport(path.join(process.cwd(), "src/index.css"));
    }

    console.log(chalk.green("\n🎉 Tailwind CSS setup complete!"));
  });
program.parse()
