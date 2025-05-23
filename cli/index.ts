#!/usr/bin/env node
import { program } from "commander"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import inquirer from "inquirer"
import { execSync } from "child_process"
// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import chalk from "chalk"


const templatesPath = path.join(__dirname, "../src/components/heliokit")

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

program
  .command("add <component>")
  .description("Add a component from HelioKit")
  .action(async (component) => {
    const savedConfig = await getUserConfig()

    let framework = savedConfig.framework
    let destRoot = savedConfig.defaultPath

    if (!framework) {
      const result = await inquirer.prompt([
        {
          type: "list",
          name: "framework",
          message: "What framework are you using?",
          choices: ["Vite", "Next.js", "Custom"],
        },
      ])
      framework = result.framework
    }

    if (!destRoot) {
      if (framework === "Vite" || (framework === "Next.js" && await fs.pathExists("src"))) {
        destRoot = "src/components"
      } else if (framework === "Next.js") {
        console.log(chalk.yellow("⚠️ No 'src/' folder found. Creating 'components/' in project root."))
        destRoot = "components"
      } else {
        const { customPath } = await inquirer.prompt([
          {
            type: "input",
            name: "customPath",
            message: "Enter custom path (relative to project root):",
            default: "src/components",
          },
        ])
        destRoot = customPath
      }

      const { remember } = await inquirer.prompt([
        {
          type: "confirm",
          name: "remember",
          message: "💾 Do you want to remember this setup for future commands?",
          default: true,
        },
      ])

      if (remember) {
        await saveUserConfig({ framework, defaultPath: destRoot })
      }
    }

    const src = path.join(templatesPath, component)
    const dest = path.join(process.cwd(), destRoot, component)

    if (!(await fs.pathExists(src))) {
      console.error(chalk.red(`❌ Component "${component}" not found.`))
      process.exit(1)
    }

    await fs.ensureDir(path.dirname(dest))
    await fs.copy(src, dest)

    console.log(chalk.green(`✅ "${component}" copied to ${path.join(destRoot, component)}`))
  })


program
    .command("list")
    .description("List all available components from HelioKit")
    .action(async () => {
        const components = await fs.readdir(templatesPath)

        console.log(chalk.blue("---> Available components:\n"))
        components.forEach((comp) => {
            console.log("  " + chalk.cyan(`- ${comp}`))
        })
    })


    
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
        console.log(chalk.cyan("🚀 Starting ") + chalk.bold("Tailwind CSS setup...") + "\n")

        const { framework } = await inquirer.prompt([
            {
                type: "list",
                name: "framework",
                message: "What framework are you using?",
                choices: ["Vite", "Next.js"],
            },
        ])

        if (framework === "Vite") {
            console.log(chalk.yellow("📦 Installing ") + chalk.magenta("@tailwindcss/vite"))
            execSync(`npm install -D tailwindcss @tailwindcss/vite`, { stdio: "inherit" })

            const viteConfigPath = path.join(process.cwd(), "vite.config.ts")
            if (await fs.pathExists(viteConfigPath)) {
                let viteContent = await fs.readFile(viteConfigPath, "utf8")
                if (!viteContent.includes("@tailwindcss/vite")) {
                    viteContent = `import tailwindcss from "@tailwindcss/vite"\n` + viteContent
                    viteContent = viteContent.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ")
                    await fs.writeFile(viteConfigPath, viteContent, "utf8")
                    console.log(chalk.green("✅ Updated ") + chalk.cyan("vite.config.ts"))
                }
            }

            await ensureTailwindCssImport(path.join(process.cwd(), "src/index.css"))

        }

        if (framework === "Next.js") {
            console.log(chalk.yellow("📦 Installing ") + chalk.magenta("@tailwindcss/postcss") + chalk.gray(" + postcss"))
            execSync(`npm install -D tailwindcss @tailwindcss/postcss postcss`, { stdio: "inherit" })

            const postcssPath = path.join(process.cwd(), "postcss.config.mjs")
            if (!(await fs.pathExists(postcssPath))) {
                await fs.outputFile(postcssPath, `const config = {\n  plugins: {\n    "@tailwindcss/postcss": {},\n  },\n};\n\nexport default config;\n`)
                console.log("✅ Created postcss.config.mjs")
            }

            await ensureTailwindCssImport(path.join(process.cwd(), "src/app/globals.css"))
            await ensureTailwindCssImport(path.join(process.cwd(), "src/index.css"))

        }

        console.log(chalk.green("\n🎉 Tailwind CSS setup complete!"))
    })
program.parse()
