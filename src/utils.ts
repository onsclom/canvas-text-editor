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
