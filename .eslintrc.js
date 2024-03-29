module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    semi: 0,
    "space-before-function-paren": 0,
    "no-console": "off",
    //'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: [1, "single"] //引入引号 `` “” ''
  }
};
