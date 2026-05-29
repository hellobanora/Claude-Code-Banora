import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Banora brand palette
        navy: '#1B3A5C',
        midblue: '#2C5F8A',
        lightblue: '#5B9EC9',
        gold: '#D4A017',
        goldlight: '#FFD232',
        // Severity bands for postural findings
        severity: {
          ideal: '#2C8A3B',
          mild: '#D4A017',
          moderate: '#E07B00',
          marked: '#C0392B',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
