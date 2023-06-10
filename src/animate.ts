import { State } from "./main"
import { ease, lerp } from "./utils"

export function animate(state: State, delta: number) {
  const { charHeight: CHAR_HEIGHT, charWidth: CHAR_WIDTH } = state.sizes
  state.text.forEach((line) => {
    line.forEach((letter) => {
      letter.time += delta / 1000
      letter.time = Math.min(state.settings.letterAnimationTime, letter.time)
    })
  })
  state.cursor.visualTarget = {
    x: state.cursor.pos.x * CHAR_WIDTH,
    y: state.cursor.pos.y * CHAR_HEIGHT,
  }
  state.cursor.visualTime += delta / 1000
  state.cursor.visualTime = Math.min(
    state.settings.cursorAnimationTime,
    state.cursor.visualTime
  )
  state.cursor.visualPos = lerp(
    state.cursor.visualStart,
    state.cursor.visualTarget,
    ease(state.cursor.visualTime / state.settings.cursorAnimationTime)
  )
}
