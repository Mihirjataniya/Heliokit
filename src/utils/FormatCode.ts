import prettier from "prettier/standalone"
import babelPlugin from "prettier/plugins/babel"
import estreePlugin from "prettier/plugins/estree"
import typescriptPlugin from "prettier/plugins/typescript"

const formatCode = async (code: string, language: "tsx" | "html" | "js" = "tsx") => {
  const parserMap = {
    tsx: "babel-ts",
    html: "html",
    js: "babel",
  }

  const formatted = await prettier.format(code.trim(), {
    parser: parserMap[language],
    plugins: [babelPlugin, estreePlugin, typescriptPlugin],
    semi: false,
    singleQuote: true,
    tabWidth: 2
  })

  return formatted.trim()
}

export default formatCode
