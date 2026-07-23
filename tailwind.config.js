/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				vault: {
					ink: '#15171C',
					surface: '#1C1F26',
					'surface-raised': '#242832',
					border: '#333846',
					text: '#EEF0F3',
					muted: '#8B93A3',
					accent: '#C89B5C',
					live: '#4FAE82'
				}
			},
			fontFamily: {
				display: ['"Fraunces Variable"', 'ui-serif', 'serif'],
				sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
			},
			boxShadow: {
				vault: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)',
				'vault-hover': '0 2px 4px rgba(0,0,0,0.45), 0 12px 32px -8px rgba(0,0,0,0.6)'
			},
			borderRadius: {
				vault: '0.5rem'
			},
			keyframes: {
				fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.96)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				}
			},
			animation: {
				fadeIn: 'fadeIn 180ms ease-out',
				scaleIn: 'scaleIn 180ms ease-out'
			}
		}
	},
	plugins: []
};
