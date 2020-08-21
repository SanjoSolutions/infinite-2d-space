import { interpolatePointsOnLine } from './interpolatePointsOnLine.js'

console.log(interpolatePointsOnLine({x: 0, y: 0}, {x: 2, y: 0}))
// [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]

console.log(interpolatePointsOnLine({x: 0, y: 0}, {x: 0, y: 2}))
// [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}]

console.log(interpolatePointsOnLine({x: 0, y: 0}, {x: 2, y: 2}))
// [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}]

console.log(interpolatePointsOnLine({x: 2, y: 2}, {x: 0, y: 0}))
// [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}]

console.log(interpolatePointsOnLine({x: 0, y: 0}, {x: 0, y: 0}))
// [{x: 0, y: 0}]
