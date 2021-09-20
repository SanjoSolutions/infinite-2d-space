export class WebSocketMock extends EventTarget {
  constructor() {
    super()
    this._dataToReturnAfterNextSend = null
  }

  returnDataAfterNextSend(data) {
    this._dataToReturnAfterNextSend = data
  }

  send() {
    const dataToReturnAfterNextSend = this._dataToReturnAfterNextSend
    if (dataToReturnAfterNextSend) {
      this._dataToReturnAfterNextSend = null
      setImmediate(
        () => {
          this.dispatchEvent(new MessageEvent('message', {
            data: dataToReturnAfterNextSend
          }))
        }
      )
    }
  }
}
