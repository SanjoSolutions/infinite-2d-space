import { interpolatePointsOnLine } from './interpolatePointsOnLine.js'

test('interpolate points on line (1)', () => {
  expect(interpolatePointsOnLine({ x: 0, y: 0 }, { x: 2, y: 0 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ])
})

test('interpolate points on line (2)', () => {
  expect(interpolatePointsOnLine({ x: 0, y: 0 }, { x: 0, y: 2 })).toEqual([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ])
})

test('interpolate points on line (3)', () => {
  expect(interpolatePointsOnLine({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ])
})

test('interpolate points on line (4)', () => {
  expect(interpolatePointsOnLine({ x: 2, y: 2 }, { x: 0, y: 0 })).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ])
})

test('interpolate points on line (5)', () => {
  expect(interpolatePointsOnLine({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual([
    { x: 0, y: 0 },
  ])
})
