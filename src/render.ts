import { State } from "./main"
import { ease, wordWrap } from "./utils"

export function render(state: State, ctx: CanvasRenderingContext2D) {
  const {
    charHeight: CHAR_HEIGHT,
    charWidth: CHAR_WIDTH,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  } = state.sizes

  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

  {
    // margin
    ctx.save()
    ctx.translate(state.sizes.leftMargin, state.sizes.margin)

    // draw cursor
    ctx.fillStyle = "blue"
    ctx.fillRect(
      state.cursor.visualPos.x,
      state.cursor.visualPos.y,
      CHAR_WIDTH / 8,
      CHAR_HEIGHT
    )

    // draw text
    state.text.forEach((row) => {
      row.forEach((letter) => {
        const { time, visualCur: curPos } = letter
        const animatedProgress = ease(time / state.settings.letterAnimationTime)
        ctx.save()
        const { x, y } = curPos
        ctx.translate(x * CHAR_WIDTH, y * CHAR_HEIGHT)
        type AnimationStyle = "scale-in" | "drop-in"
        const animationStyle = "drop-in" as AnimationStyle
        switch (animationStyle) {
          case "scale-in": {
            ctx.translate(
              (CHAR_WIDTH / 2) * (1 - animatedProgress),
              (CHAR_HEIGHT / 2) * (1 - animatedProgress)
            )
            ctx.scale(animatedProgress, animatedProgress)
            ctx.fillStyle = "black"
            break
          }
          case "drop-in": {
            ctx.translate(0, (1 - animatedProgress) * (-CHAR_HEIGHT / 2))
            ctx.fillStyle = `rgba(0,0,0,${
              time / state.settings.letterAnimationTime
            })`
            break
          }
        }
        ctx.fillText(letter.letter, 0, 0)
        ctx.restore()
      })
    })

    // draw graveyard text
    state.letterGraveyard.forEach(({ letter, time, pos }) => {
      const animatedProgress = ease(time / state.settings.letterAnimationTime)
      ctx.save()
      ctx.translate(pos.x * CHAR_WIDTH, pos.y * CHAR_HEIGHT)
      ctx.translate(0, animatedProgress * (-CHAR_HEIGHT / 2))
      ctx.fillStyle = `rgba(0,0,0,${
        1 - time / state.settings.letterAnimationTime
      })`
      ctx.fillText(letter, 0, 0)
      ctx.restore()
    })

    ctx.restore()
  }

  // DEBUG BAR
  ctx.fillStyle = "black"
  ctx.fillRect(0, SCREEN_HEIGHT, SCREEN_WIDTH, -CHAR_HEIGHT)
  ctx.fillStyle = "white"
  ctx.fillText(
    `line ${state.cursor.pos.y + 1}, char ${state.cursor.pos.x}`,
    0,
    SCREEN_HEIGHT - CHAR_HEIGHT
  )

  // do word wrap in case of resize
  wordWrap()
}
