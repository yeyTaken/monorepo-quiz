import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/theme'

export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        branco: '#FFFFFF',
        'azul-bebe': '#AEDFF7',  // um tom suave de azul claro
        ciano: '#00E5FF',        // ciano vibrante
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        lg: '1rem',
      },
    },
  },
  plugins: [heroui()],
} satisfies Config
