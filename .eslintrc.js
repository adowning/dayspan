module.exports = {
  root: true,
  env: {
    node: true
  },
  // extends: ['plugin:vue/essential', 'prettier', 'standard'],
  extends: ['plugin:vue/essential'],
  // plugins: ['prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: [1, 'never'],
    quotes: [1, 'single']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
