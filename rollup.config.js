import buble from 'rollup-plugin-buble'
import standard from 'rollup-plugin-standard'

export default {
  entry: 'src/plugin.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    standard(),
    buble({ objectAssign: 'Object.assign' })
  ]
}
