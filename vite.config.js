import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANT: If your GitHub repo name is NOT "muscle-app", change the `base`
// value below to match: base: '/your-repo-name/'
// If you deploy to a custom domain or Vercel/Netlify instead of GitHub Pages,
// set base back to '/'.
export default defineConfig({
  base: '/muscle-app/',
  plugins: [react(), tailwindcss()],
})
