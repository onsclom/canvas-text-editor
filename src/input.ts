import { state } from "./main"
import { clamp, wordWrap } from "./utils"
import { TextChar } from "./main"

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
    forceValidCursorPos()
  }
})

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight": {
      state.cursor.pos.x = state.cursor.pos.x + 1
      if (
        lineLength(state.text[state.cursor.pos.y]) < state.cursor.pos.x &&
        state.text.length - 1 !== state.cursor.pos.y
      ) {
        state.cursor.pos.y = state.cursor.pos.y + 1
        state.cursor.pos.x = 0
      }
      break
    }
    case "ArrowLeft": {
      state.cursor.pos.x = state.cursor.pos.x - 1
      if (state.cursor.pos.x < 0) {
        state.cursor.pos.y -= 1
        state.cursor.pos.x = lineLength(state.text[state.cursor.pos.y])
      }
      break
    }
    case "ArrowUp": {
      state.cursor.pos.y = state.cursor.pos.y - 1
      break
    }
    case "ArrowDown": {
      if (state.text.length - 1 === state.cursor.pos.y)
        state.cursor.pos.x = state.text[state.cursor.pos.y].length
      else state.cursor.pos.y = state.cursor.pos.y + 1
      break
    }
    // TODO: make less hacky
    case "Backspace": {
      if (state.cursor.pos.x === 0 && state.cursor.pos.y === 0) break
      else if (state.cursor.pos.x === 0) {
        const removed = state.text[state.cursor.pos.y - 1].pop()!
        state.letterGraveyard.push({
          letter: removed.letter,
          time: 0,
          pos: removed.pos,
        })
        state.cursor.pos.y -= 1
        state.cursor.pos.x = lineLength(state.text[state.cursor.pos.y])
      } else {
        const removed = state.text[state.cursor.pos.y].splice(
          state.cursor.pos.x - 1,
          1
        )[0]
        state.letterGraveyard.push({
          letter: removed.letter,
          time: 0,
          pos: removed.pos,
        })
        state.cursor.pos.x -= 1
      }
      break
    }
    case "Enter": {
      // handle adding \n
      state.text[state.cursor.pos.y].splice(
        state.cursor.pos.x,
        0,
        textChar("\n", {
          ...state.cursor.pos,
        })
      )
      wordWrap()

      state.cursor.pos.y += 1
      state.cursor.pos.x = 0
      break
    }
    default: {
      if (e.key.length !== 1) break // special cases
      const newChar = textChar(e.key, {
        x: state.cursor.pos.x,
        y: state.cursor.pos.y,
      })
      state.text[state.cursor.pos.y].splice(state.cursor.pos.x, 0, newChar)
      state.cursor.onChar = newChar
      state.cursor.pos.x += 1
      break
    }
  }
  forceValidCursorPos()
  wordWrap() // word wrap in case necessary
})

// HELPER FUNCTIONS //

function textChar(char: string, pos: Vec2): TextChar {
  return {
    letter: char,
    pos: { ...pos },
    visualCur: { ...pos },
    visualStart: { ...pos },
    translateTime: 0,
    time: 0,
  }
}

function lineLength(line: TextChar[]) {
  if (!line) return 0
  return line[line.length - 1]?.letter === "\n" ? line.length - 1 : line.length
}

function forceValidCursorPos() {
  state.cursor.pos.y = clamp(0, state.text.length - 1, state.cursor.pos.y)
  state.cursor.pos.x = clamp(
    0,
    [state.cursor.pos.y] ? lineLength(state.text[state.cursor.pos.y]) : 0,
    state.cursor.pos.x
  )
}
