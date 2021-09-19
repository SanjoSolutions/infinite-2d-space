import { interpolatePointsOnLine } from './interpolatePointsOnLine2.js'
import { delayed } from '../delayed.js'
import { getValue, setValue } from '../localStorageDB.js'
import { Space } from './Space2.js'
import { min } from './min.js'
import { max } from './max.js'
import { Viewport } from './Viewport.js'
import { createFullDocumentCanvas } from '../createFullDocumentCanvas/createFullDocumentCanvas.js'

class Pixel {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

async function main() {
  let viewport = await loadViewportCenter()

  let saveViewportCenterHandler
  const saveViewportCenter = () => {
    if (!saveViewportCenterHandler) {
      saveViewportCenterHandler = setTimeout(() => {
        saveViewportCenterBase(viewport)
      }, 5000)
    }
  }

  const pixels = await load()

  let spaceViewport = createSpaceViewport(pixels)
  const space = new Space(spaceViewport)
  for (const pixel of pixels) {
    space.set(pixel)
  }

  function getVisiblePixels(viewport) {
    const visiblePixels = []
    for (let y = viewport.minY; y <= viewport.maxY; y++) {
      for (let x = viewport.minX; x <= viewport.maxX; x++) {
        if (space.get({ x, y })) {
          visiblePixels.push(new Pixel(x, y))
        }
      }
    }
    return visiblePixels
  }

  const saveDelayed = delayed(
    function savePixels() {
      save(pixels)
    },
    5000
  )

  const pencil = document.querySelector('.pencil')
  const { canvas, context } = createFullDocumentCanvas()

  window.addEventListener(
    'resize',
    function onResize() {
      const width = parseInt(canvas.style.width, 10)
      const height = parseInt(canvas.style.height, 10)
      setViewport({
        minX: viewport.minX,
        minY: viewport.minY,
        maxX: viewport.minX + width,
        maxY: viewport.minY + height
      })
    }
  )

  context.lineWidth = 1
  context.lineCap = 'round'

  document.body.appendChild(canvas)

  function updateView() {
    // const visiblePixels = getVisiblePixels(viewport)
    // context.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
    const devicePixelRatio = window.devicePixelRatio
    const width = canvas.width
    const height = canvas.height
    const imageData = context.createImageData(width, height)
    for (let y = viewport.minY; y <= viewport.maxY; y++) {
      for (let x = viewport.minX; x <= viewport.maxX; x++) {
        const pixel = space.get({ x, y })
        if (pixel) {
          for (let yDelta = 0; yDelta < devicePixelRatio; yDelta++) {
            for (let xDelta = 0; xDelta < devicePixelRatio; xDelta++) {
              const index =
                ((devicePixelRatio * (viewport.maxY - y) + yDelta) * width +
                  (devicePixelRatio * (x - viewport.minX) + xDelta)) *
                4
              imageData.data[index] = 0
              imageData.data[index + 1] = 0
              imageData.data[index + 2] = 0
              imageData.data[index + 3] = 255
            }
          }
        }
      }
    }
    context.putImageData(imageData, 0, 0)
    // drawPixels(
    //   visiblePixels.map(pixel => pixelCoordinatesToViewportCoordinates(viewport, pixel))
    // )
  }

  updateView()

  let isDrawing = false
  let lastPoint
  window.addEventListener('mousedown', (event) => {
    saveDelayed.cancel()
    if (saveViewportCenterHandler) {
      clearTimeout(saveViewportCenterHandler)
      saveViewportCenterHandler = undefined
    }
    if (!spacePressed && isLeftMouseButton(event)) {
      isDrawing = true
      const point = eventToPoint(event)
      const pixel = viewportCoordinatesToPixelCoordinates(viewport, point)
      pixels.push(pixel)
      space.set(pixel)
      if (isPixelVisible(viewport, pixel)) {
        drawLine(
          pixelCoordinatesToViewportCoordinates(viewport, pixel),
          pixelCoordinatesToViewportCoordinates(viewport, pixel),
        )
      }
      lastPoint = point
    }
  })

  window.addEventListener('mousemove', (event) => {
    const point = eventToPoint(event)
    pencil.style.left = point.x
    pencil.style.top = point.y
    if (!spacePressed && isDrawing) {
      const interpolatedPixels = interpolatePointsOnLine(
        lastPoint,
        point,
      ).map((point) =>
        viewportCoordinatesToPixelCoordinates(viewport, point),
      )
      pixels.push(...interpolatedPixels)
      for (const pixel of interpolatedPixels) {
        space.set(pixel)
      }
      const visiblePixels = interpolatedPixels.filter((pixel) =>
        isPixelVisible(viewport, pixel),
      )
      drawPixels(
        visiblePixels.map((pixel) =>
          pixelCoordinatesToViewportCoordinates(viewport, pixel),
        ),
      )
      lastPoint = point
    }
  })

  window.addEventListener('mouseup', (event) => {
    isDrawing = false
    saveDelayed()
  })

  // Move START

  let spacePressed = false
  let primaryMouseButtonPressed = false
  let previousPosition = undefined

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      spacePressed = true
      document.body.classList.add('moving')
      event.preventDefault()
    }
  })

  window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      spacePressed = false
      previousPosition = undefined
      document.body.classList.remove('moving')
      event.preventDefault()
    }
  })

  window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      primaryMouseButtonPressed = true
    }
  })

  window.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
      primaryMouseButtonPressed = false
      previousPosition = undefined
    }
  })

  window.addEventListener('mousemove', (event) => {
    if (spacePressed && primaryMouseButtonPressed) {
      const position = {
        x: event.pageX,
        y: event.pageY,
      }

      if (previousPosition) {
        const delta = {
          x: position.x - previousPosition.x,
          y: position.y - previousPosition.y,
        }
        viewport = {
          minX: viewport.minX - delta.x,
          minY: viewport.minY + delta.y,
          maxX: viewport.maxX - delta.x,
          maxY: viewport.maxY + delta.y,
        }
        saveViewportCenter()
        updateView()
      }

      previousPosition = position
    }
  })

  // Move END

  function drawLine(a, b) {
    context.beginPath()
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
    context.stroke()
  }

  function drawPixels(pixels) {
    for (const pixel of pixels) {
      context.fillRect(pixel.x, pixel.y, 1, 1)
    }
  }

  function getViewport() {
    return viewport
  }

  function setViewport(_viewport) {
    viewport = _viewport
    saveViewportCenter()
    updateView()
  }

  function getViewportCenter() {
    return {
      x: Math.floor(viewport.minX + 0.5 * (viewport.maxX - viewport.minX)),
      y: Math.floor(viewport.minY + 0.5 * (viewport.maxY - viewport.minY)),
    }
  }

  function setViewportCenter(x, y) {
    viewport = convertViewportCenterToViewport({ x, y })
    saveViewportCenter()
    updateView()
  }

  function moveViewport(deltaX, deltaY) {
    viewport = new Viewport({
      minX: viewport.minX + Math.floor(deltaX),
      minY: viewport.minY + Math.floor(deltaY),
      maxX: viewport.maxX + Math.floor(deltaX),
      maxY: viewport.maxY + Math.floor(deltaY),
    })
    saveViewportCenter()
    updateView()
  }

  window.getViewport = getViewport
  window.setViewport = setViewport
  window.getViewportCenter = getViewportCenter
  window.setViewportCenter = setViewportCenter
  window.moveViewport = moveViewport
}

function createSpaceViewport(pixels) {
  const xCoordinates = pixels.map((pixel) => pixel.x)
  const yCoordinates = pixels.map((pixel) => pixel.y)
  return new Viewport({
    minX: Math.floor(min(xCoordinates)),
    minY: Math.floor(min(yCoordinates)),
    maxX: Math.ceil(max(xCoordinates)),
    maxY: Math.ceil(max(yCoordinates)),
  })
}

function isLeftMouseButton(event) {
  return event.button === 0
}

function eventToPoint(event) {
  return { x: event.pageX, y: event.pageY }
}

function save(pixels) {
  setValue('pixels', JSON.stringify(pixels))
  console.log('Saved pixels.')
}

async function load() {
  return JSON.parse((await getValue('pixels')) || '[]')
}

function saveViewportCenterBase(viewport) {
  setValue('viewportCenter', JSON.stringify(getViewportCenter()))
  console.log('Saved viewport center.')
}

async function loadViewportCenter() {
  const viewportCenter = JSON.parse(
    (await getValue('viewportCenter')) || JSON.stringify({ x: 0, y: 0 }),
  )
  return convertViewportCenterToViewport(viewportCenter)
}

function convertViewportCenterToViewport({ x, y }) {
  const width = window.innerWidth
  const height = window.innerHeight
  return new Viewport({
    minX: Math.floor(x - 0.5 * width),
    minY: Math.floor(y - 0.5 * height),
    maxX: Math.floor(x + 0.5 * width),
    maxY: Math.floor(y + 0.5 * height),
  })
}

function isPixelVisible(viewport, pixel) {
  return (
    pixel.x >= viewport.minX &&
    pixel.x <= viewport.maxX &&
    pixel.y >= viewport.minY &&
    pixel.y <= viewport.maxY
  )
}

function pixelCoordinatesToViewportCoordinates(viewport, pixel) {
  if (isPixelVisible(viewport, pixel)) {
    const x = pixel.x - viewport.minX
    const y = viewport.maxY - pixel.y
    return { x, y }
  } else {
    throw new Error('Pixel not in viewport')
  }
}

function viewportCoordinatesToPixelCoordinates(viewport, { x, y }) {
  return {
    x: viewport.minX + x,
    y: viewport.maxY - y,
  }
}

main()