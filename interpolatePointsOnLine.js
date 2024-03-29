export function interpolatePointsOnLine(a, b) {
  const minX = Math.round(Math.min(a.x, b.x));
  const maxX = Math.round(Math.max(a.x, b.x));
  if (minX !== maxX) {
    if (b.x < a.x) {
      const temp = a;
      a = b;
      b = temp;
    }
    const m = (b.y - a.y) / (b.x - a.x);
    const points = [];
    for (let x = minX; x <= maxX; x++) {
      const point = {
        x,
        y: Math.round(m * (x - a.x) + a.y),
      };
      points.push(point);
    }
    return points;
  } else {
    const minY = Math.round(Math.min(a.y, b.y));
    const maxY = Math.round(Math.max(a.y, b.y));
    if (minY !== maxY) {
      if (b.y < a.y) {
        const temp = a;
        a = b;
        b = temp;
      }
      const m = (b.x - a.x) / (b.y - a.y);
      const points = [];
      for (let y = minY; y <= maxY; y++) {
        const point = {
          x: Math.round(m * (y - a.y) + a.x),
          y,
        };
        points.push(point);
      }
      return points;
    } else {
      return [{ x: minX, y: minY }];
    }
  }
}
