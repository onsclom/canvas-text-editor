import { state } from "./main"
import { clamp } from "./utils"

function animateCursor() {
  state.cursor.visualStart = { ...state.cursor.visualPos }
  state.cursor.visualTime = 0
}

window.addEventListener("keydown", (e) => {
  const ogPos = { ...state.cursor.pos }

  if (e.key === "ArrowRight") {
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
    const row = state.text[state.cursor.pos.y]
    if (state.cursor.pos.x === 0) {
      if (state.cursor.pos.y !== 0) {
        const newRow = [...state.text[state.cursor.pos.y - 1], ...row]
        state.cursor.pos.x = state.text[state.cursor.pos.y - 1].length
        state.text[state.cursor.pos.y - 1] = newRow
        state.text.splice(state.cursor.pos.y, 1)
        state.cursor.pos.y--
      }
    } else {
      const newRow = [
        ...row.slice(0, state.cursor.pos.x - 1),
        ...row.slice(state.cursor.pos.x),
      ]
      state.text[state.cursor.pos.y] = newRow
      state.cursor.pos.x--
    }
  } else if (e.key === "Enter") {
    const row = state.text[state.cursor.pos.y]
    const newRow = [...row.slice(state.cursor.pos.x)]
    state.text[state.cursor.pos.y] = row.slice(0, state.cursor.pos.x)
    state.text.splice(state.cursor.pos.y + 1, 0, newRow)
    state.cursor.pos.y++
    state.cursor.pos.x = 0
  } else if (e.key.length === 1) {
    const row = state.text[state.cursor.pos.y]
    const newRow = [
      ...row.slice(0, state.cursor.pos.x),
      {
        letter: e.key,
        time: 0,
      },
      ...row.slice(state.cursor.pos.x),
    ]
    state.text[state.cursor.pos.y] = newRow
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

  if (ogPos.x !== state.cursor.pos.x || ogPos.y !== state.cursor.pos.y)
    animateCursor()
})
