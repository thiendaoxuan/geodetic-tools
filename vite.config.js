import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function swPlugin() {
  const src = resolve(__dirname, 'public/sw.js')
  return {
    name: 'sw-cache-bust',
    closeBundle() {
      const hash = 'g' + Date.now().toString(36)
      const content = readFileSync(src, 'utf-8').replace('__CACHE__', hash)
      writeFileSync(resolve(__dirname, 'dist/sw.js'), content)
    },
  }
}

export default defineConfig({
  base: '/geodetic-tools/',
  plugins: [react(), swPlugin()],
})
