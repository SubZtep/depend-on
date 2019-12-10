require("dotenv").config()

module.exports =
  process.env.NODE_ENV === "production"
    ? {
        arrowParens: "always",
        trailingComma: "all",
        singleQuote: true,
        htmlWhitespaceSensitivity: "ignore"
      }
    : {
        semi: false,
        printWidth: 100
      }
