// get computed font

const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext("2d")!

const ANIMATION_TIME = 0.1
const state = {
  text: `wow this
supports multiple lines!
cool...
  wowoweeewa`.split("\n"),
  cursor: {
    pos: { x: 0, y: 0 },

    visualPos: { x: 0, y: 0 },
    visualTime: 0,
    visualStart: { x: 0, y: 0 },
    visualTarget: { x: 0, y: 0 },
  },
  inputMode: "NORMAL" as "NORMAL" | "INSERT",
}

type Vector2 = { x: number; y: number }
function lerp(pos1: Vector2, pos2: Vector2, t: number) {
  return {
    x: pos1.x + (pos2.x - pos1.x) * t,
    y: pos1.y + (pos2.y - pos1.y) * t,
  }
}

let start = performance.now()
requestAnimationFrame(function loop(time) {
  // SETUP
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
  ctx.font = "16px monospace"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  const CHAR_HEIGHT = 16
  const CHAR_WIDTH = ctx.measureText(" ").width

  // UPDATE
  const delta = time - start
  start = time

  state.cursor.visualTarget = {
    x: state.cursor.pos.x * CHAR_WIDTH,
    y: state.cursor.pos.y * CHAR_HEIGHT,
  }
  state.cursor.visualTime += delta / 1000
  state.cursor.visualTime = Math.min(ANIMATION_TIME, state.cursor.visualTime)
  state.cursor.visualPos = lerp(
    state.cursor.visualStart,
    state.cursor.visualTarget,
    ease(state.cursor.visualTime / ANIMATION_TIME)
  )

  // DRAW
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // draw cursor
  ctx.fillStyle = "rgb(120, 255, 120)"
  ctx.fillRect(
    state.cursor.visualPos.x,
    state.cursor.visualPos.y,
    state.inputMode === "NORMAL" ? CHAR_WIDTH : CHAR_WIDTH / 8,
    CHAR_HEIGHT
  )

  // draw text
  state.text.forEach((line, i) => {
    ctx.fillStyle = "black"
    ctx.fillText(line, 0, CHAR_HEIGHT * i)
  })

  // DEBUG BAR
  ctx.fillStyle = "black"
  ctx.fillRect(0, HEIGHT, WIDTH, -CHAR_HEIGHT)
  ctx.fillStyle = "white"
  ctx.fillText(
    `${state.inputMode} ${state.cursor.pos.x}:${state.cursor.pos.y}`,
    0,
    HEIGHT - CHAR_HEIGHT
  )

  // LOOP
  requestAnimationFrame(loop)
})

function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

function animateCursor() {
  state.cursor.visualStart = { ...state.cursor.visualPos }
  state.cursor.visualTime = 0
}

function ease(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

window.addEventListener("keydown", (e) => {
  const ogPos = { ...state.cursor.pos }
  if (state.inputMode === "NORMAL") {
    if (e.key === "l") {
      state.cursor.pos.x++
      if (state.cursor.pos.x > state.text[state.cursor.pos.y].length) {
        if (state.cursor.pos.y !== state.text.length - 1) {
          state.cursor.pos.x = 0
          state.cursor.pos.y++
        }
      }
    } else if (e.key === "h") {
      state.cursor.pos.x--
      if (state.cursor.pos.x < 0) {
        if (state.cursor.pos.y !== 0) {
          state.cursor.pos.y--
          state.cursor.pos.x = state.text[state.cursor.pos.y].length
        }
      }
    } else if (e.key === "k") state.cursor.pos.y--
    else if (e.key === "j") state.cursor.pos.y++
    else if (e.key === "i") state.inputMode = "INSERT"
    else if (e.key === "x") {
      const row = state.text[state.cursor.pos.y].split("")
      const newRow = [
        ...row.slice(0, state.cursor.pos.x),
        ...row.slice(state.cursor.pos.x + 1),
      ]
      state.text[state.cursor.pos.y] = newRow.join("")
    }

    state.cursor.pos.y = clamp(0, state.text.length - 1, state.cursor.pos.y)
    state.cursor.pos.x = clamp(
      0,
      state.text[state.cursor.pos.y].length,
      state.cursor.pos.x
    )
    if (state.cursor.pos.x > state.text[state.cursor.pos.y].length)
      state.cursor.pos.x = state.text[state.cursor.pos.y].length
  } else if (state.inputMode === "INSERT") {
    if (e.key === "Escape") {
      state.inputMode = "NORMAL"
    } else if (e.key === "ArrowRight") {
      state.cursor.pos.x++
      if (state.cursor.pos.x > state.text[state.cursor.pos.y].length) {
        if (state.cursor.pos.y !== state.text.length - 1) {
          state.cursor.pos.x = 0
          state.cursor.pos.y++
        }
      }
    } else if (e.key === "ArrowLeft") {
      state.cursor.pos.x--
      if (state.cursor.pos.x < 0) {
        if (state.cursor.pos.y !== 0) {
          state.cursor.pos.y--
          state.cursor.pos.x = state.text[state.cursor.pos.y].length
        }
      }
    } else if (e.key === "ArrowUp") state.cursor.pos.y--
    else if (e.key === "ArrowDown") state.cursor.pos.y++
    else if (e.key === "Backspace") {
      const row = state.text[state.cursor.pos.y].split("")
      const newRow = [
        ...row.slice(0, state.cursor.pos.x - 1),
        ...row.slice(state.cursor.pos.x),
      ]
      state.text[state.cursor.pos.y] = newRow.join("")
      state.cursor.pos.x--
    } else if (e.key.length === 1) {
      const row = state.text[state.cursor.pos.y].split("")
      const newRow = [
        ...row.slice(0, state.cursor.pos.x),
        e.key,
        ...row.slice(state.cursor.pos.x),
      ]
      state.text[state.cursor.pos.y] = newRow.join("")
      state.cursor.pos.x++
    }

    state.cursor.pos.y = clamp(0, state.text.length - 1, state.cursor.pos.y)
    state.cursor.pos.x = clamp(
      0,
      state.text[state.cursor.pos.y].length,
      state.cursor.pos.x
    )
    if (state.cursor.pos.x > state.text[state.cursor.pos.y].length)
      state.cursor.pos.x = state.text[state.cursor.pos.y].length
  }

  if (ogPos.x !== state.cursor.pos.x || ogPos.y !== state.cursor.pos.y)
    animateCursor()
})
