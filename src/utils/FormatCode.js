import prettier from "prettier/standalone";
import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import typescriptPlugin from "prettier/plugins/typescript";
const formatCode = async (code, language = "tsx") => {
    const parserMap = {
        tsx: "babel-ts",
        html: "html",
        js: "babel",
    };
    const wrappedCode = `const __temp = (${code.trim()})`;
    const formatted = await prettier.format(wrappedCode, {
        parser: parserMap[language],
        plugins: [babelPlugin, estreePlugin, typescriptPlugin],
        semi: false,
        singleQuote: true,
        tabWidth: 2
    });
    return formatted
        .replace(/^const __temp = \(/, "")
        .replace(/\);\s*$/, "")
        .trim();
};
export default formatCode;
