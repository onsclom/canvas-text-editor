import { State } from "./main"
import { ease } from "./utils"

export function render(state: State, ctx: CanvasRenderingContext2D) {
  const {
    charHeight: CHAR_HEIGHT,
    charWidth: CHAR_WIDTH,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  } = state.sizes

  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

  // draw cursor
  ctx.fillStyle = "rgb(50, 200, 50)"
  ctx.fillRect(
    state.cursor.visualPos.x,
    state.cursor.visualPos.y,
    CHAR_WIDTH / 8,
    CHAR_HEIGHT
  )

  // draw text
  ctx.save()
  state.text.forEach((line, y) => {
    line.forEach(({ letter, time }, x) => {
      const animatedProgress = ease(time / state.settings.letterAnimationTime)

      ctx.save()
      ctx.translate(x * CHAR_WIDTH, y * CHAR_HEIGHT)

      ctx.translate(
        (CHAR_WIDTH / 2) * (1 - animatedProgress),
        (CHAR_HEIGHT / 2) * (1 - animatedProgress)
      )
      ctx.scale(animatedProgress, animatedProgress)

      // ctx.fillStyle = `rgba(0,0,0,${time / LETTER_ANIMATION_TIME})`
      ctx.fillStyle = "black"
      ctx.fillText(letter, 0, 0)
      ctx.restore()
    })
  })
  ctx.restore()

  // DEBUG BAR
  ctx.fillStyle = "black"
  ctx.fillRect(0, SCREEN_HEIGHT, SCREEN_WIDTH, -CHAR_HEIGHT)
  ctx.fillStyle = "white"
  ctx.fillText(
    `line ${state.cursor.pos.y + 1}, char ${state.cursor.pos.x + 1}`,
    0,
    SCREEN_HEIGHT - CHAR_HEIGHT
  )
}
