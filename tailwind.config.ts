import type { Config } from 'tailwindcss'

export default {
	content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx,json}', './src/lib/**/*.{js,ts,jsx,tsx,mdx,json}'],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem', // 16px (px-4)
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px'
			}
		},
		extend: {
			colors: {
				primary: {
					300: '#27d17f',
				},
				secondary: {
					400: '#2F469C'
				}
			},
			boxShadow: {
				glow: '0 0 8px 0',
				'inset-glow': 'inset 0 0 10px 0'
			},
			keyframes: {
				slideFromLeft: {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				slideFromRight: {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				}
			},
			backgroundImage: {
				'grid': `
          linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)
        `,
			},
			backgroundSize: {
				'grid': '24px 24px',
			},
		}
	},
	plugins: []
} satisfies Config
