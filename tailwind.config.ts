import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Ensure src directory is included
  ],
  theme: {
    extend: {
      colors: {
        'calc-bg': '#1a1a1a', // Dark background
        'calc-display': '#333333', // Display background
        'calc-text-primary': '#ffffff', // Primary text color
        'calc-text-secondary': '#a0a0a0', // Secondary text color
        'calc-btn-bg': '#3c3c3c', // Default button background
        'calc-btn-hover': '#505050', // Default button hover
        'calc-btn-operator': '#ff9500', // Orange for operators
        'calc-btn-operator-hover': '#ffac33',
        'calc-btn-special': '#a6a6a6', // Gray for special functions (C, +/-, %)
        'calc-btn-special-hover': '#bfbfbf',
        'calc-btn-equals': '#1a75ff', // Blue for equals
        'calc-btn-equals-hover': '#4d94ff',
        'calc-history-bg': '#222222', // History panel background
        'calc-history-border': '#444444', // History item border
      },
      boxShadow: {
        'calc-button': '0 4px 6px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;