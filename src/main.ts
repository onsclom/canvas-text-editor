import { render } from "./render"
import { animate } from "./animate"
import "./input"

const DEFAULT_TEXT = `wow this
supports multiple lines!
cool...
  wowoweeewa`

type DeletedLetter = {
  letter: string
  time: number
  pos: Vec2
}

export const state = {
  text: DEFAULT_TEXT.split("\n").map((line, y) =>
    line.split("").map((letter, x) => ({
      letter,
      time: 0,
      visualStart: { x, y },
      visualEnd: { x, y },
      visualCur: { x, y },
      translateTime: 0,
    }))
  ),
  letterGraveyard: [] as DeletedLetter[],
  cursor: {
    pos: { x: 0, y: 0 },
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
  },
  settings: {
    letterAnimationTime: 0.2,
    cursorAnimationTime: 0.2,
  },
  cursorPos: { x: 0, y: 0 },
}

export type State = typeof state

const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext("2d")!

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
  const CHAR_HEIGHT = 32
  ctx.font = `${CHAR_HEIGHT}px monospace`
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  const CHAR_WIDTH = ctx.measureText(" ").width
  state.sizes = {
    charHeight: CHAR_HEIGHT,
    charWidth: CHAR_WIDTH,
    screenWidth: WIDTH,
    screenHeight: HEIGHT,
    margin: 32,
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
