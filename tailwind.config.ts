import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			'4.2xl': '2.5rem'
  		},
  		colors: {
  			background: 'rgb(var(--background))',
  			foreground: 'rgb(var(--foreground))',
  			accent: {
  				DEFAULT: 'rgb(var(--accent))',
  				secondary: 'rgb(var(--accent-secondary))',
  				table: 'rgb(var(--accent-table))'
  			},
  			primary: 'rgb(var(--primary))',
  			lines: 'rgb(var(--lines))',
  			star: 'rgb(var(--star))'
  		},
  		borderRadius: {
  			lg: '16px',
  			md: '12px',
  			sm: '8px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
