import { render } from "./render"
import { animate } from "./animate"
import "./input"

const DEFAULT_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta blandit mi non rutrum. Aliquam malesuada, sapien a faucibus lacinia, diam leo ornare nisi, a convallis diam ex ut lectus. Donec vulputate faucibus euismod. Nullam efficitur finibus enim sed consectetur. Vestibulum neque dui, bibendum sit amet mattis ac, tincidunt vel orci. Cras pellentesque tincidunt risus id ultrices. Suspendisse non euismod ex.

Nunc rutrum semper mi, vitae luctus purus pharetra id. Donec nisi quam, bibendum tempor euismod bibendum, vulputate maximus lorem. Aliquam ac odio nisl. Vivamus cursus ultricies dui in feugiat. Sed pharetra tellus purus, id eleifend tortor pharetra vel. Sed laoreet vel magna non rutrum. Ut lobortis, leo eget vestibulum accumsan, diam neque pharetra elit, ut volutpat est enim at urna. Sed dignissim mi at augue elementum vulputate. Mauris enim massa, tincidunt sit amet congue ut, venenatis ut arcu. Fusce feugiat est urna. Donec finibus commodo magna quis convallis. Praesent vitae eros id tortor finibus semper eu id nisl. Suspendisse ullamcorper enim mollis magna maximus, vel pellentesque nisl vehicula.\n`
// this needs to always end with newline!

const MAX_CHARS_PER_LINE = 55 // optimal line length for reading based on google

function textChar(letter: string, pos: Vec2) {
  return {
    letter,
    time: 0,
    visualStart: { x: 0, y: 0 },
    pos,
    visualCur: { x: 0, y: 0 },
    translateTime: 0,
  }
}

export type TextChar = ReturnType<typeof textChar>

function textCharsFromString(text: string) {
  const chars = text.split("").map((letter) => ({
    letter,
    time: 0,
    visualStart: { x: 0, y: 0 },
    pos: { x: 0, y: 0 },
    visualCur: { x: 0, y: 0 },
    translateTime: 0,
  }))
  return [chars] as TextChar[][]
}

type DeletedLetter = {
  letter: string
  time: number
  pos: Vec2
}

export const state = {
  text: textCharsFromString(DEFAULT_TEXT),
  letterGraveyard: [] as DeletedLetter[],
  cursor: {
    pos: { x: 0, y: 0 },
    lastPos: { x: 0, y: 0 },
    visualPos: { x: 0, y: 0 },
    visualTime: 0,
    visualStart: { x: 0, y: 0 },
    visualTarget: { x: 0, y: 0 },
    onChar: null as TextChar | null,
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
