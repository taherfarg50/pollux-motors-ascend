import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./src/lib/supabase.ts",
		"./src/lib/animation.ts",
		"./src/lib/animations/**/*.{ts,tsx}",
		"./src/context/**/*.{ts,tsx}",
		"./src/services/**/*.{ts,tsx}",
		"./src/utils/**/*.{ts,tsx}",
		"./src/types/**/*.{ts,tsx}",
		"./src/integrations/supabase/**/*.{ts,tsx}",
		"./src/main.tsx",
		"./src/App.tsx"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			}
		},
		screens: {
			'xs': '475px',  // Extra small screens
			'sm': '640px',  // Small screens
			'md': '768px',  // Medium screens  
			'lg': '1024px', // Large screens
			'xl': '1280px', // Extra large screens
			'2xl': '1536px' // 2X large screens
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'pollux-blue': '#1937E3',
				'pollux-gold': '#D4AF37',
				'pollux-gold-light': '#E6C757',
				'pollux-platinum': '#E5E4E2',
				'pollux-dark': '#0A0A0F',
				'pollux-light': '#F8F9FA',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" }
				},
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" }
				},
				"zoom-in": {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" }
				},
				"background-shine": {
					"from": {
						"backgroundPosition": "0 0"
					},
					"to": {
						"backgroundPosition": "-200% 0"
					}
				},
				"float": {
					"0%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
					"100%": { transform: "translateY(0px)" }
				},
				"scroll-bounce": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(8px)" }
				},
				"shimmer": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" }
				},
				"rotate-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				},
				"pulse-scale": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.05)" }
				},
				"ripple": {
					"0%": { transform: "scale(0)", opacity: "1" },
					"100%": { transform: "scale(4)", opacity: "0" }
				},
				"3d-tilt": {
					"0%, 50%, 100%": { transform: "rotate3d(0, 0, 0, 0deg)" },
					"25%": { transform: "rotate3d(1, 0, 0, 3deg)" },
					"75%": { transform: "rotate3d(0, 1, 0, 3deg)" }
				},
				"blur-in": {
					"0%": { filter: "blur(12px)", opacity: "0" },
					"100%": { filter: "blur(0px)", opacity: "1" }
				},
				"gradient-x": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" }
				},
				"gradient-y": {
					"0%, 100%": { backgroundPosition: "50% 0%" },
					"50%": { backgroundPosition: "50% 100%" }
				},
				"bounce-fade": {
					"0%, 100%": { transform: "translateY(0)", opacity: "1" },
					"50%": { transform: "translateY(-30px)", opacity: "0.6" }
				},
				"glow-pulse": {
					"0%, 100%": { boxShadow: "0 0 5px 0px rgba(25, 55, 227, 0.5)" },
					"50%": { boxShadow: "0 0 20px 5px rgba(25, 55, 227, 0.8)" }
				},
				"slide-up-fade": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"slide-down-fade": {
					"0%": { opacity: "0", transform: "translateY(-20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"slide-left-fade": {
					"0%": { opacity: "0", transform: "translateX(20px)" },
					"100%": { opacity: "1", transform: "translateX(0)" }
				},
				"slide-right-fade": {
					"0%": { opacity: "0", transform: "translateX(-20px)" },
					"100%": { opacity: "1", transform: "translateX(0)" }
				},
				"particle-move": {
					"0%": { transform: "translate(0, 0)", opacity: "0" },
					"25%": { opacity: "1" },
					"75%": { opacity: "1" },
					"100%": { transform: "translate(var(--x), var(--y))", opacity: "0" }
				},
				"ping-slow": {
					"0%": { transform: "scale(0.8)", opacity: "0.5" },
					"70%": { transform: "scale(1.2)", opacity: "0.2" },
					"100%": { transform: "scale(1.5)", opacity: "0" }
				},
				"luxury-shimmer": {
					"0%": { backgroundPosition: "-100% 0" },
					"100%": { backgroundPosition: "200% 0" }
				},
				"elegant-reveal": {
					"0%": { clipPath: "inset(0 100% 0 0)" },
					"100%": { clipPath: "inset(0 0 0 0)" }
				},
				"smooth-reveal-left": {
					"0%": { transform: "translateX(-30px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" }
				},
				"smooth-reveal-right": {
					"0%": { transform: "translateX(30px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" }
				},
				"luxury-fade": {
					"0%": { opacity: "0", filter: "blur(8px)" },
					"100%": { opacity: "1", filter: "blur(0)" }
				},
				"text-gradient-animate": {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" }
				},
				"border-glow": {
					"0%": { boxShadow: "0 0 5px rgba(212,175,55,0.3)" },
					"50%": { boxShadow: "0 0 20px rgba(212,175,55,0.6)" },
					"100%": { boxShadow: "0 0 5px rgba(212,175,55,0.3)" }
				},
				"parallax-scroll": {
					"0%": { transform: "translateY(50px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"card-hover": {
					"0%": { transform: "scale(1)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
					"100%": { transform: "scale(1.03)", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" }
				},
				"fade-up-slow": {
					"0%": { transform: "translateY(30px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"zoom-in-slow": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.7s ease-in-out forwards",
				"fade-up": "fade-up 0.7s ease-out forwards",
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"zoom-in": "zoom-in 0.3s ease-out",
				"background-shine": "background-shine 2s linear infinite",
				"float": "float 6s ease-in-out infinite",
				"scroll-bounce": "scroll-bounce 2s ease-in-out infinite",
				"shimmer": "shimmer 2s infinite",
				"rotate-slow": "rotate-slow 8s linear infinite",
				"pulse-scale": "pulse-scale 3s ease-in-out infinite",
				"ripple": "ripple 1s linear",
				"3d-tilt": "3d-tilt 8s ease-in-out infinite",
				"blur-in": "blur-in 0.6s forwards",
				"gradient-x": "gradient-x 3s ease infinite",
				"gradient-y": "gradient-y 3s ease infinite",
				"bounce-fade": "bounce-fade 3s ease infinite",
				"glow-pulse": "glow-pulse 2s ease-in-out infinite",
				"slide-up-fade": "slide-up-fade 0.4s ease-out forwards",
				"slide-down-fade": "slide-down-fade 0.4s ease-out forwards",
				"slide-left-fade": "slide-left-fade 0.4s ease-out forwards",
				"slide-right-fade": "slide-right-fade 0.4s ease-out forwards",
				"particle-move": "particle-move 4s ease-out forwards",
				"ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
				"luxury-shimmer": "luxury-shimmer 3s ease-in-out infinite",
				"elegant-reveal": "elegant-reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards",
				"smooth-reveal-left": "smooth-reveal-left 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
				"smooth-reveal-right": "smooth-reveal-right 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
				"luxury-fade": "luxury-fade 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
				"text-gradient-animate": "text-gradient-animate 3s ease infinite",
				"border-glow": "border-glow 2s ease-in-out infinite",
				"parallax-scroll": "parallax-scroll 1s ease-out forwards",
				"card-hover": "card-hover 0.3s ease-out forwards",
				"fade-up-slow": "fade-up-slow 1s cubic-bezier(0.19, 1, 0.22, 1) forwards",
				"zoom-in-slow": "zoom-in-slow 1s cubic-bezier(0.19, 1, 0.22, 1) forwards"
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				display: ['Playfair Display', 'Georgia', 'serif'],
				mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace']
			},
			transitionTimingFunction: {
				'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
				'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
				'smooth': 'cubic-bezier(0.65, 0, 0.35, 1)'
			},
			transitionProperty: {
				'transform-opacity': 'transform, opacity'
			},
			backgroundImage: {
				'luxury-gradient': 'linear-gradient(135deg, #1937E3 0%, #3B82F6 100%)',
				'gold-gradient': 'linear-gradient(to right, #D4AF37, #F7E7CE, #D4AF37)',
				'dark-gradient': 'linear-gradient(to bottom, #0D1117, #1A1A1A)',
				'glass-effect': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
			},
			boxShadow: {
				'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
				'gold-glow': '0 0 15px rgba(212, 175, 55, 0.5)',
				'blue-glow': '0 0 20px rgba(25, 55, 227, 0.4)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
