/**
 * Tailwind configuration
 * Kept as ESM `.mjs` to avoid placing these keys in `next.config.ts`.
 */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp-green': '#25D366',
        'chat-bg': '#ECE5DD',
      },
    },
  },
  plugins: [],
};
