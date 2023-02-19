/** @type {import('tailwindcss').plugin} */
/** @type {import('tailwindcss').Config} */
/** @type { import('@radix-ui/colors') } */

const tailwindColors = require('tailwindcss/colors')
const colors = require('@radix-ui/colors')
const plugin = require('tailwindcss/plugin')
const { lime, mauve, pink, amber, crimson, sky } = colors

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
          1: tailwindColors.zinc[50],
          2: tailwindColors.zinc[100],
          3: tailwindColors.zinc[200],
          4: tailwindColors.zinc[300],
          5: tailwindColors.zinc[400],
          6: tailwindColors.zinc[500],
          7: tailwindColors.zinc[600],
          8: tailwindColors.zinc[700],
          9: tailwindColors.zinc[800],
          10: tailwindColors.zinc[900],

        },
        accent: {
          1: mauve.mauve1,
          2: mauve.mauve2,
          3: mauve.mauve3,
          4: mauve.mauve4,
          5: mauve.mauve5,
          6: mauve.mauve6,
          7: mauve.mauve7,
          8: mauve.mauve8,
          9: mauve.mauve9,
          10: mauve.mauve10,
          11: mauve.mauve11,
          12: mauve.mauve12,
        },
        primary: {
          1: pink.pink1,
          2: pink.pink2,
          3: pink.pink3,
          4: pink.pink4,
          5: pink.pink5,
          6: pink.pink6,
          7: pink.pink7,
          8: pink.pink8,
          9: pink.pink9,
          10: pink.pink10,
          11: pink.pink11,
          12: pink.pink12,
        },
        secondary: {
          1: amber.amber1,
          2: amber.amber2,
          3: amber.amber3,
          4: amber.amber4,
          5: amber.amber5,
          6: amber.amber6,
          7: amber.amber7,
          8: amber.amber8,
          9: amber.amber9,
          10: amber.amber10,
          11: amber.amber11,
          12: amber.amber12,
        },
        interactive: {
          1: sky.sky1,
          2: sky.sky2,
          3: sky.sky3,
          4: sky.sky4,
          5: sky.sky5,
          6: sky.sky6,
          7: sky.sky7,
          8: sky.sky8,
          9: sky.sky9,
          10: sky.sky10,
          11: sky.sky11,
          12: sky.sky12,
        },
        negative: {
          1: crimson.crimson1,
          2: crimson.crimson2,
          3: crimson.crimson3,
          4: crimson.crimson4,
          5: crimson.crimson5,
          6: crimson.crimson6,
          7: crimson.crimson7,
          8: crimson.crimson8,
          9: crimson.crimson9,
          10: crimson.crimson10,
          11: crimson.crimson11,
          12: crimson.crimson12,
        },
        positive: {
          1: lime.lime1,
          2: lime.lime2,
          3: lime.lime3,
          4: lime.lime4,
          5: lime.lime5,
          6: lime.lime6,
          7: lime.lime7,
          8: lime.lime8,
          9: lime.lime9,
          10: lime.lime10,
          11: lime.lime11,
          12: lime.lime12,
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
