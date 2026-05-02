import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, join } from 'path'

function swPlugin() {
  const src = resolve(__dirname, 'public/sw.js')
  return {
    name: 'sw-cache-bust',
    closeBundle() {
      const hash = 'g' + Date.now().toString(36)
      const dist = resolve(__dirname, 'dist')
      const base = '/geodetic-tools/'

      const files = readdirSync(dist, { recursive: true })
        .map((f) => join(dist, f))
        .filter((f) => statSync(f).isFile())
        .map((f) => {
          const rel = f.slice(dist.length).replace(/\\/g, '/')
          return rel === '/index.html' ? base : base + rel.slice(1)
        })

      let content = readFileSync(src, 'utf-8')
      content = content.replace('__CACHE__', hash)
      content = content.replace('__PRECACHE__', JSON.stringify(files))
      writeFileSync(join(dist, 'sw.js'), content)
    },
  }
}

export default defineConfig({
  base: '/geodetic-tools/',
  plugins: [react(), swPlugin()],
})
