import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { Space } from './Space2.js'
import { getDatabase } from './unnamed/firebase/getDatabase.js'

export class FirestoreSpace {
  constructor() {
    this._space = new Space()
  }

  setOnUpdate(onUpdate) {
    this._onUpdate = onUpdate
  }

  async setViewport(viewport) {
    if (this._unsubscribe) {
      this._unsubscribe()
    }
    this._unsubscribe = onSnapshot(
      this._getDocumentReference(),
      snapshot => {
        this._space = new Space()
        const data = snapshot.data()
        const {pixels} = data
        for (const yKey of Object.keys(pixels)) {
          const y = Number(yKey)
          const row = pixels[yKey]
          for (const xKey of Object.keys(row)) {
            const x = Number(xKey)
            this._space.set({x, y})
          }
        }
        if (this._onUpdate) {
          this._onUpdate()
        }
      },
    )
  }

  _getDocumentReference() {
    const database = getDatabase()
    return doc(database, 'pixels', '0')
  }

  _convertPositionToId(position) {
    const { x, y } = position
    return `${ x }_${ y }`
  }

  _convertIdToPosition(id) {
    const parts = id.split('_')
    const x = Number(parts[0])
    const y = Number(parts[1])
    return { x, y }
  }

  get({ x, y }) {
    return this._space.get({ x, y })
  }

  async set({ x, y }) {
    this._space.set({ x, y })

    const document = {
      pixels: this._convertNestedMapToNestedObjects(
        this._space.data
      )
    }
    await setDoc(
      this._getDocumentReference(),
      document
    )
  }

  _convertNestedMapToNestedObjects(nestedMap) {
    return Object.fromEntries(
      Array.from(nestedMap.entries()).map(
        ([key, set]) => [
          key,
          Object.fromEntries(
            Array.from(set.keys()).map(x => [x, true])
          )
        ]
      )
    )
  }
}
