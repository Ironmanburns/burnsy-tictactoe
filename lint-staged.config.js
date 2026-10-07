export default {
  'src/**/*.{js,jsx}': [
    'eslint --fix',
    // Run the full unit suite; do not pass staged paths (vitest treats them as filters).
    () => 'npm run test -- --run --coverage=false',
  ],
}
