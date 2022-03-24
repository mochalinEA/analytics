import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'

import {generateMainEntries, generateAdapterEntries, generateEventEntries} from './build/utils'

const extensions = ['.ts']

const getPlugins = (index) => [
  resolve({ extensions }),
  commonjs(),
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        declaration: index === 0
      }
    }
  }),
  babel({
    presets: [
      '@babel/preset-env',
    ],
    babelHelpers: 'bundled',
    extensions,
  }),
]

const entries = [
  ...generateMainEntries(),
  ...generateAdapterEntries(),
  ...generateEventEntries()
]

const entriesWithPlugins = entries.map((entry, index) => ({...entry, plugins: getPlugins(index)}))

export default entriesWithPlugins
