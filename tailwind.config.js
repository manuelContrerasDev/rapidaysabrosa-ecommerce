/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEE7E7',
          100: '#FDCFCF',
          200: '#FC9F9F',
          300: '#FA6F6F',
          400: '#F94040',
          500: '#E81010',
          600: '#BC0D0D',
          700: '#9C0F0F',
          800: '#710A0A',
          900: '#450606',
        },
        secondary: {
          50: '#F2FEEA',
          100: '#E6FDD6',
          200: '#CCFAAC',
          300: '#B3F883',
          400: '#99F559',
          500: '#80F230',
          600: '#66C226',
          700: '#4D911D',
          800: '#336113',
          900: '#1A300A',
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE7C2',
          200: '#FFCF85',
          300: '#FFB847',
          400: '#FFA00A',
          500: '#FF8800',
          600: '#CC6D00',
          700: '#995200',
          800: '#663600',
          900: '#331B00',
        },
        neutral: {
          50: '#FFF8F0',
          100: '#FFF1E6',
          200: '#FFE8D9',
          300: '#FFD0B5',
          400: '#FFC9A8',
          500: '#FFB088',
          600: '#FF976A',
          700: '#FF7D4D',
          800: '#FF642F',
          900: '#FF4A12',
        },
        olive: {
          light: '#6A8E91',
          DEFAULT: '#4A6C6F',
          dark: '#2A4A4D',
        },

        // 🎨 Paleta de marca Rapida&Sabrosa
        brand: {
          red: {
            DEFAULT: "#c1121f",
            dark: "#780000",
            light: "#ef233c",
          },
          yellow: {
            DEFAULT: "#ffb703",
            dark: "#ff9900",
            light: "#ffd166",
          },
          black: {
            DEFAULT: "#000000",
            soft: "#1a1a1a",
            light: "#333333",
          },
          red: {
            DEFAULT: "#e11d27",   // Rojo principal
            dark: "#9b0b12",
            light: "#ff3b41",
          },
          yellow: {
            DEFAULT: "#ffb703",
            dark: "#ff9900",
            light: "#ffd166",
          },
          black: {
            DEFAULT: "#000000",
            soft: "#1a1a1a",
            light: "#333333",
          },
          green: {
            DEFAULT: "#16a34a",   // ✅ Verde confirmación
            dark: "#15803d",
            light: "#22c55e",
          }
        },
      },

      // 🔠 Fuentes tipográficas
      fontFamily: {
        anton: ["Anton", "sans-serif"],      // 🔥 Titulares / navegación
        poppins: ["Poppins", "sans-serif"],  // ✨ Cuerpo / texto general
        montserrat: ["Montserrat", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        lobster: ["Lobster", "cursive"],
        bangers: ["Bangers", "sans-serif"], // (se mantiene por compatibilidad)
        display: ["Bungee", "sans-serif"],
        heading: ["Righteous", "sans-serif"],
        body: ["Fredoka", "sans-serif"],
      },

      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },

      backgroundImage: theme => ({
        'pizza-pattern': "url('https://images.pexels.com/photos/3682838/pexels-photo-3682838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'tomato-pattern': "url('https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'wood-pattern': "url('https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'hero-pizza': "url('/images/pizza-hero.jpeg')",

        // 🌈 Gradientes personalizados
        'gradient-brand': `linear-gradient(to right, ${theme("colors.brand.red.DEFAULT")}, ${theme("colors.brand.black.DEFAULT")}, ${theme("colors.brand.yellow.DEFAULT")})`,
        'gradient-brand-dark': `linear-gradient(to right, ${theme("colors.brand.yellow.dark")}, ${theme("colors.brand.red.dark")}, ${theme("colors.brand.black.soft")})`,
        'gradient-red-yellow': `linear-gradient(to right, ${theme("colors.brand.red.DEFAULT")}, ${theme("colors.brand.yellow.DEFAULT")})`,
        'gradient-yellow-red': `linear-gradient(to right, ${theme("colors.brand.yellow.DEFAULT")}, ${theme("colors.brand.red.DEFAULT")})`,
        'gradient-black-red': `linear-gradient(to right, ${theme("colors.brand.black.DEFAULT")}, ${theme("colors.brand.red.DEFAULT")})`,
      }),

    'cheese-texture':
    "url('https://www.transparenttextures.com/patterns/cheese-hole.png')",



      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
},
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};
