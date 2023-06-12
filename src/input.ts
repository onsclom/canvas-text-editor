import { state } from "./main"
import { clamp } from "./utils"

addEventListener("mousemove", (e) => {
  document.body.style.cursor = "text"
  state.cursorPos = {
    x: e.clientX - state.sizes.leftMargin,
    y: e.clientY - state.sizes.margin,
  }
})

addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    const { charHeight: CHAR_HEIGHT, charWidth: CHAR_WIDTH } = state.sizes
    const x = Math.round(state.cursorPos.x / CHAR_WIDTH)
    const y = Math.floor(state.cursorPos.y / CHAR_HEIGHT)
    state.cursor.pos = { x, y }
    forceValidCursorPos(textTo2dArray(state.text))
  }
})

addEventListener("keydown", (e) => {
  const lines = textTo2dArray(state.text)
  switch (e.key) {
    case "ArrowRight": {
      state.cursor.pos.x = state.cursor.pos.x + 1
      if (lineLength(lines[state.cursor.pos.y]) < state.cursor.pos.x) {
        state.cursor.pos.y = state.cursor.pos.y + 1
        state.cursor.pos.x = 0
      }
      break
    }
    case "ArrowLeft": {
      state.cursor.pos.x = state.cursor.pos.x - 1
      if (state.cursor.pos.x < 0) {
        state.cursor.pos.y -= 1
        state.cursor.pos.x = lineLength(lines[state.cursor.pos.y])
      }
      break
    }
    case "ArrowUp": {
      state.cursor.pos.y = state.cursor.pos.y - 1
      break
    }
    case "ArrowDown": {
      state.cursor.pos.y = state.cursor.pos.y + 1
      break
    }
    case "Backspace": {
      if (state.cursor.pos.x === 0) {
        state.cursor.pos.y -= 1
        state.cursor.pos.x = lines[state.cursor.pos.y]?.length
      }
      const charAtCursor = lines[state.cursor.pos.y]?.[state.cursor.pos.x - 1]
      if (charAtCursor) {
        state.text.splice(state.text.indexOf(charAtCursor), 1)
        state.letterGraveyard.push({
          letter: charAtCursor.letter,
          time: 0,
          pos: { ...charAtCursor.pos },
        })
      }
      state.cursor.pos.x = state.cursor.pos.x - 1
      break
    }
    case "Enter": {
      // handle adding \n
      break
    }
    default: {
      // handle letter adding
      break
    }
  }
  forceValidCursorPos(lines)
})

// HELPER FUNCTIONS //

function textTo2dArray(text: typeof state.text) {
  const lines = [] as (typeof state.text)[]
  text.forEach((textChar) => {
    while (lines[textChar.pos.y] === undefined)
      lines[textChar.pos.y] = [] as typeof state.text
    lines[textChar.pos.y].push(textChar)
  })
  return lines
}

function lineLength(line: typeof state.text) {
  return line[line.length - 1]?.letter === "\n" ? line.length - 1 : line.length
}

function forceValidCursorPos(lines: (typeof state.text)[]) {
  state.cursor.pos.y = clamp(0, lines.length, state.cursor.pos.y)
  state.cursor.pos.x = clamp(
    0,
    lines[state.cursor.pos.y] ? lineLength(lines[state.cursor.pos.y]) : 0,
    state.cursor.pos.x
  )
}
