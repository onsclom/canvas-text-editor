import { render } from "./render"
import { animate } from "./animate"
import "./input"

const DEFAULT_TEXT = `wow this
supports multiple lines! i need longer lines ok what about an omega long line. this should definitely be wrapped
cool...
  wowoweeewa`

const MAX_CHARS_PER_LINE = 55 // optimal line length for reading based on google

function textCharsFromText(text: string) {
  return text.split("").map((letter) => ({
    letter,
    time: 0,
    visualStart: { x: 0, y: 0 },
    pos: { x: 0, y: 0 },
    visualCur: { x: 0, y: 0 },
    translateTime: 0,
  }))
}

type DeletedLetter = {
  letter: string
  time: number
  pos: Vec2
}

export const state = {
  text: textCharsFromText(DEFAULT_TEXT),
  letterGraveyard: [] as DeletedLetter[],
  cursor: {
    pos: { x: 0, y: 0 },
    lastPos: { x: 0, y: 0 },
    visualPos: { x: 0, y: 0 },
    visualTime: 0,
    visualStart: { x: 0, y: 0 },
    visualTarget: { x: 0, y: 0 },
  },
  sizes: {
    charHeight: 0,
    charWidth: 0,
    screenWidth: 0,
    screenHeight: 0,
    margin: 10,
    charsPerRow: 0,
    leftMargin: 0,
  },
  settings: {
    letterAnimationTime: 0.2,
    cursorAnimationTime: 0.2,
    maxCharsPerLine: MAX_CHARS_PER_LINE, // optimal line length for reading based on google
  },
  cursorPos: { x: 0, y: 0 },
}

export type State = typeof state

const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext("2d")!

// load custom font for canvas
new FontFace("inteloneMonoFont", "url(/intelone-mono-font-family-regular.woff)")
  .load()
  .then((font) => document.fonts.add(font))

function setup() {
  const dpi = window.devicePixelRatio
  const canvasComputedWidth = parseInt(
    getComputedStyle(canvas).getPropertyValue("width")
  )
  const canvasComputedHeight = parseInt(
    getComputedStyle(canvas).getPropertyValue("height")
  )
  canvas.width = canvasComputedWidth * dpi
  canvas.height = canvasComputedHeight * dpi
  ctx.resetTransform()
  ctx.scale(dpi, dpi)
  const WIDTH = canvasComputedWidth
  const HEIGHT = canvasComputedHeight
  const CHAR_HEIGHT = 24
  ctx.font = `${CHAR_HEIGHT}px inteloneMonoFont`
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  const CHAR_WIDTH = ctx.measureText(" ").width
  const MARGIN = 16

  const charsPerRow = Math.min(
    Math.floor((WIDTH - MARGIN * 2) / CHAR_WIDTH),
    MAX_CHARS_PER_LINE
  )
  const leftMargin = Math.max(MARGIN, (WIDTH - charsPerRow * CHAR_WIDTH) / 2)
  state.sizes = {
    charHeight: CHAR_HEIGHT,
    charWidth: CHAR_WIDTH,
    screenWidth: WIDTH,
    screenHeight: HEIGHT,
    margin: MARGIN,
    charsPerRow,
    leftMargin,
  }
}

let cur = performance.now()
requestAnimationFrame(function loop(time) {
  setup()
  const delta = time - cur
  cur = time
  animate(state, delta)
  render(state, ctx)
  requestAnimationFrame(loop)
})
