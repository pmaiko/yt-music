module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      },
    },
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  // https://eslint.vuejs.org/rules/require-name-property.html
  'rules': {
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'no-console': 0,
    'prefer-const': ['error', { 'destructuring': 'all' }],
    'no-return-await': 0,
    'no-unused-expressions': 0,
    'no-trailing-spaces': 0,
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    'no-new': 0,
    'no-prototype-builtins': 0,
    'handle-callback-err': 0,
    'valid-typeof': 0,
    'dot-notation': 0,
    'quote-props': ['error', 'consistent'],

    '@typescript-eslint/no-unused-vars': 'error',

    'vue/max-attributes-per-line': ['error', { 'singleline': { 'max': 1 }, 'multiline': { 'max': 1 } }],
    'vue/multiline-html-element-content-newline': ['error', { 'ignoreWhenEmpty': true, 'allowEmptyLines': false }],
    'vue/script-indent': ['error', 2, { 'baseIndent': 1, 'switchCase': 0, 'ignores': [] }],
    'vue/html-indent': ['error', 2, { 'attribute': 1, 'baseIndent': 1, 'closeBracket': 0, 'alignAttributesVertically': true, 'ignores': [] }],
    'vue/html-self-closing': ['error', { 'html': { 'void': 'never', 'normal': 'always', 'component': 'always' }, 'svg': 'always', 'math': 'always' }],
    'vue/html-closing-bracket-spacing': ['error', { 'selfClosingTag': 'always' }],
    'vue/html-closing-bracket-newline': ['error', { 'singleline': 'never', 'multiline': 'always', 'selfClosingTag': { 'singleline': 'never', 'multiline': 'always' } }],
    'vue/first-attribute-linebreak': ['error', { 'singleline': 'ignore', 'multiline': 'below' }],
    'vue/attribute-hyphenation': ['error', 'never'],
    'vue/prop-name-casing': ['error', 'camelCase']
  },
  'globals': {
    process: true,
    global: true,
    __dirname: true,
    Buffer: true
  }
}
