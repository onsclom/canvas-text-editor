// get computed font

const canvas = document.querySelector("canvas")!
const ctx = canvas.getContext("2d")!

const state = {
  text: `wow this
supports multiple lines!
cool...
  isn't it?`.split("\n"),
  cursor: {
    pos: { x: 0, y: 0 },
  },
}

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
  const CHAR_HEIGHT = 16
  const CHAR_WIDTH = ctx.measureText(" ").width

  // UPDATE

  // DRAW
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  state.text.forEach((line, i) => {
    ctx.fillStyle = "black"
    ctx.fillText(line, 0, CHAR_HEIGHT * (i + 1))
  })

  // LOOP
  requestAnimationFrame(loop)
})
