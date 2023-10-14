import { State } from "./main"
import { ease, lerp, vec2Equals } from "./utils"

export function animate(state: State, delta: number) {
  const { charHeight: CHAR_HEIGHT, charWidth: CHAR_WIDTH } = state.sizes
  // TODO: make more generic way to add animations
  // maybe just timers for example?
  state.text.forEach((row) => {
    row.forEach((letter) => {
      letter.time += delta / 1000
      letter.time = Math.min(state.settings.letterAnimationTime, letter.time)

      letter.translateTime += delta / 1000
      letter.translateTime = Math.min(
        state.settings.letterAnimationTime,
        letter.translateTime
      )
      letter.visualCur = lerp(
        letter.visualStart,
        letter.pos,
        ease(letter.translateTime / state.settings.letterAnimationTime)
      )
    })
  })

  // animate cursor
  if (!vec2Equals(state.cursor.lastPos, state.cursor.pos)) {
    // cursor moved so start animation timer
    state.cursor.visualTarget = {
      x: state.cursor.pos.x * CHAR_WIDTH,
      y: state.cursor.pos.y * CHAR_HEIGHT,
    }
    state.cursor.visualStart = state.cursor.visualPos
    state.cursor.visualTime = 0
    state.cursor.lastPos = structuredClone(state.cursor.pos)
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

  state.letterGraveyard.forEach((letter) => {
    letter.time += delta / 1000
    letter.time = Math.min(state.settings.letterAnimationTime, letter.time)
  })
  // remove letters that are too old
  state.letterGraveyard = state.letterGraveyard.filter(
    (letter) => letter.time < state.settings.letterAnimationTime
  )
}
