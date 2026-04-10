/**
 * vue-tsc debe correr contra el proyecto completo con paths de tsconfig.app.json.
 * Si lint-staged pasa rutas de archivo sueltas, vue-tsc no aplica @/* y falla en masa.
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{ts,vue}': () => 'vue-tsc --noEmit --skipLibCheck -p tsconfig.app.json',
  '*.{ts,vue,js}': 'eslint --fix --cache',
}
