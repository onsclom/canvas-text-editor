import { state } from "./main"

export function lerp(pos1: Vec2, pos2: Vec2, t: number) {
  return {
    x: pos1.x + (pos2.x - pos1.x) * t,
    y: pos1.y + (pos2.y - pos1.y) * t,
  }
}

export function ease(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

export function vec2Equals(pos1: Vec2, pos2: Vec2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

export function wordWrap() {
  const charsPerRow = state.sizes.charsPerRow
  let line = 0
  let row = 0
  let lastCharWasNewline = false
  const cursorAttachedTo = {
    x: state.cursor.pos.x - 1,
    y: state.cursor.pos.y,
  }

  const textChars = state.text.flat()
  const newText = [] as typeof state.text

  textChars.forEach((textChar) => {
    if (lastCharWasNewline) {
      lastCharWasNewline = false
      row = 0
      line++
    }

    if (textChar.letter === "\n") {
      lastCharWasNewline = true
    } else if (row >= charsPerRow) {
      row = 0
      line++
    }

    const newPos = {
      x: row,
      y: line,
    }

    if (!vec2Equals(textChar.pos, newPos)) {
      // if cursor right after this char, move it to the new position too

      if (state.cursor.onChar === textChar) {
        if (vec2Equals(cursorAttachedTo, textChar.pos)) {
          state.cursor.pos = {
            x: newPos.x + 1,
            y: newPos.y,
          }
        }
      }
      textChar.visualStart = textChar.visualCur
      textChar.pos = newPos
      textChar.translateTime = 0
    }
    newText[line] = newText[line] || []
    newText[line][row] = textChar

    row++
  })
  state.text = newText
}
