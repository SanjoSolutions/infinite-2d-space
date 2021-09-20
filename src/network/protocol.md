# Protocol

## Use cases

* Sending pixels to server
  * 0: Sending pixels drawn by user (tuple of (x, y) tuples)
  * 1: Requesting pixels for viewport (also tells the server the active viewport, for sending pixels drawn by other users.)
* Receiving pixels from server
  * 2: Receiving pixels for viewport (ArrayBuffer for requested {minX, minY, maxX, maxY})
  * 3: Receiving pixels drawn by other users (tuple of (x, y) tuples)

## Data types

x, y ∈ ℤ<br>
32bit Number for x and y

## Paket format

List of length, List item 1, ..., List item n<br>
For [{x: 1, y: 2}, {x: 3, y: 4}]<br>
2, 1, 2, 3, 4<br>
Uint32, Int32, Int32, Int32, Int32
