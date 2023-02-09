/** @type {import('tailwindcss').plugin} */
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const typography = {
  fontSizeMin: 1.05,
  fontSizeMax: 1.25,
  msFactorMin: 1.125,
  msFactorMax: 1.2,
  lineHeight: 1.6,
}

const screensRem = {
  min: 20,
  '2xs': 30,
  xs: 36,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 85.364,
}

const fsMin = typography.fontSizeMin
const fsMax = typography.fontSizeMax
const msFactorMin = typography.msFactorMin
const msFactorMax = typography.msFactorMax
const screenMin = screensRem.min
const screenMax = screensRem['2xl']

// Calc min and max font-size
const calcMulti = (multiMin = 0, multiMax = null) => {
  return {
    fsMin: fsMin * Math.pow(msFactorMin, multiMin),
    fsMax: fsMax * Math.pow(msFactorMax, multiMax || multiMin),
  }
}

// build the clamp property
const clamp = (multiMin = 0, multiMax = null) => {
  const _calcMulti = calcMulti(multiMin, multiMax || multiMin)
  const _fsMin = _calcMulti.fsMin
  const _fsMax = _calcMulti.fsMax
  return `clamp(${_fsMin}rem, calc(${_fsMin}rem + (${_fsMax} - ${_fsMin}) * ((100vw - ${screenMin}rem) / (${screenMax} - ${screenMin}))), ${_fsMax}rem)`
}

const remToPx = (rem) => {
  return `${rem * 16}px`
}

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    screens: {
      min: remToPx(screensRem.min),
      '2xs': remToPx(screensRem['2xs']),
      xs: remToPx(screensRem.xs),
      sm: remToPx(screensRem.sm),
      md: remToPx(screensRem.md),
      lg: remToPx(screensRem.lg),
      xl: remToPx(screensRem.xl),
      '2xl': remToPx(screensRem['2xl']),
      '3xl': remToPx(100),
    },
    fontFamily: {
      sans: ['"Satoshi", sans-serif'],
      mono: ['monospace'],
    },
    fontSize: {
      '3xs': clamp(-5),
      '2xs': clamp(-2),
      xs: clamp(-1.5),
      sm: clamp(-1.25),
      base: clamp(-1),
      md: clamp(0.125),
      lg: clamp(0.5),
      xl: clamp(1),
      '2xl': clamp(2),
      '3xl': clamp(3),
      '4xl': clamp(5),
    },
    fontVariationWidth: {
      125: 125,
      200: 200,
      250: 250,
      300: 300,
      400: 400,
      600: 600,
      800: 800,
      900: 900,
    },
    extend: {
      colors: {
        white: 'white',
        black: 'black',
        neutral: {
          10: "#191C24",
          9: "#303646",
          8: "#49526A",
          7: "#626E8E",
          6: "#828DA9",
          5: "#9BA4BA",
          4: "#B3BACB",
          3: "#CCD0DC",
          2: "#E2E4EB",
          1: "#F3F4F7",
        },
        primary: {
          10: "#410061",
          9: "#500079",
          8: "#6E0093",
          7: "#9800B6",
          6: "#C900DA",
          5: "#FE01FC",
          4: "#FE40EC",
          3: "#FE66E3",
          2: "#FE99E3",
          1: "#FECCEC",
        },
        secondary: {
          10: "#602706",
          9: "#7A3108",
          8: "#93450E",
          7: "#B75F17",
          6: "#DB7E21",
          5: "#FFA02E",
          4: "#FFBE62",
          3: "#FFD181",
          2: "#FFE4AB",
          1: "#FFF3D5",
        },
        interactive: {
          10: "#022A5F",
          9: "#023579",
          8: "#034A93",
          7: "#0569B6",
          6: "#088CDA",
          5: "#0BB4FE",
          4: "#47D2FE",
          3: "#6CE5FE",
          2: "#9DF4FE",
          1: "#CEFDFE",
        },
        negative: {
          1: "#FEE3D4",
          2: "#FDC0AB",
          3: "#FB9580",
          4: "#F86D60",
          5: "#F42D2D",
          6: "#D12030",
          7: "#AF1631",
          8: "#8D0E2F",
          9: "#75082E",
          10: "#5F0726",
        },
        positive: {
          1: "#D2FBD0",
          2: "#A3F7A9",
          3: "#72E985",
          4: "#4DD470",
          5: "#1CB854",
          6: "#149E53",
          7: "#0E8450",
          8: "#086A49",
          9: "#055843",
          10: "#044837",
        },
      },
      keyframes: {
        appear: {
          from: {
            opacity: 0,
            transform: 'translateY(5px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          from: {
            opacity: 0,
            transform: 'translateY(5px) scale(0.95)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },

        'scale-up': {
          '0%': { transform: 'scale(0.25)', opacity: 0 },
          '25%': { transform: 'scale(1.25)', opacity: 1 },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.25)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0 },
        },
      },
      animation: {
        appear: 'appear 300ms ease-in forwards',
        'scale-in': 'scale-in 250ms ease-in-out forwards',
        'scale-up': 'scale-up 2350ms ease-in-out alternate forwards',
      },
      height: {
        'fit-content': 'fit-content',
      },
      width: ({ theme }) => ({
        ...theme('screens'),
        'max-content': 'max-content',
        'fit-content': 'fit-content',
        'min-content': 'min-content',
      }),
      maxWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      minWidth: ({ theme }) => ({
        ...theme('width'),
        ...theme('screens'),
        unset: 'unset',
      }),
      opacity: {
        2.5: '0.025',
        3.5: '0.035',
        7.5: '0.075',
        15: '0.15',
      },
      spacing: {
        '1ex': '1ex',
      },
      aspectRatio: {
        'twitter-card': '2 / 1',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, theme, e }) => {
      const values = theme('fontVariationWidth')
      var utilities = Object.entries(values).map(([key, value]) => {
        return {
          [`.${e(`font-variation-width-${key}`)}`]: { 'font-variation-settings': `'wdth' ${value}` },
        }
      })
      addUtilities(utilities)
    }),
    require('tailwindcss-logical'),
    require('@tailwindcss/typography'),
  ],
};
