import { State } from "./main";
import { ease, lerp, vec2Equals } from "./utils";

export function animate(state: State, delta: number) {
  const { charHeight: CHAR_HEIGHT, charWidth: CHAR_WIDTH } = state.sizes;
  // TODO: make more generic way to add animations
  // maybe just timers for example?
  state.text.forEach((row) => {
    row.forEach((letter) => {
      letter.time += delta / 1000;
      letter.time = Math.min(state.settings.letterAnimationTime, letter.time);

      letter.translateTime += delta / 1000;
      letter.translateTime = Math.min(
        state.settings.letterAnimationTime,
        letter.translateTime
      );

      const dist = Math.sqrt(
        (letter.visualStart.x - letter.pos.x) ** 2 +
          (letter.visualStart.y - letter.pos.y) ** 2
      );
      const MAX_DIST = 5;
      if (dist > MAX_DIST) {
        letter.visualStart = {
          x: letter.pos.x + (letter.visualStart.x - letter.pos.x) / dist,
          y: letter.pos.y + (letter.visualStart.y - letter.pos.y) / dist,
        };
      }

      letter.visualCur = lerp(
        letter.visualStart,
        letter.pos,
        ease(letter.translateTime / state.settings.letterAnimationTime)
      );
    });
  });

  // animate cursor
  if (!vec2Equals(state.cursor.lastPos, state.cursor.pos)) {
    const dist = Math.sqrt(
      (state.cursor.visualStart.x - state.cursor.pos.x) ** 2 +
        (state.cursor.visualStart.y - state.cursor.pos.y) ** 2
    );
    const MAX_DIST = 5;
    if (dist > MAX_DIST) {
      state.cursor.visualStart = {
        x:
          state.cursor.pos.x +
          (state.cursor.visualStart.x - state.cursor.pos.x) / dist,
        y:
          state.cursor.pos.y +
          (state.cursor.visualStart.y - state.cursor.pos.y) / dist,
      };
    }

    // cursor moved so start animation timer
    state.cursor.visualTarget = {
      x: state.cursor.pos.x * CHAR_WIDTH,
      y: state.cursor.pos.y * CHAR_HEIGHT,
    };
    state.cursor.visualStart = state.cursor.visualPos;
    state.cursor.visualTime = 0;
    state.cursor.lastPos = structuredClone(state.cursor.pos);
  }
  state.cursor.visualTime += delta / 1000;
  state.cursor.visualTime = Math.min(
    state.settings.cursorAnimationTime,
    state.cursor.visualTime
  );
  state.cursor.visualPos = lerp(
    state.cursor.visualStart,
    state.cursor.visualTarget,
    ease(state.cursor.visualTime / state.settings.cursorAnimationTime)
  );

  state.letterGraveyard.forEach((letter) => {
    letter.time += delta / 1000;
    letter.time = Math.min(state.settings.letterAnimationTime, letter.time);
  });
  // remove letters that are too old
  state.letterGraveyard = state.letterGraveyard.filter(
    (letter) => letter.time < state.settings.letterAnimationTime
  );
}
