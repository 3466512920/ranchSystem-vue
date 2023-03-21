
export class WebSocketServer {
  static instance = null

  // 单例模式
  static get Instance() {
    if (!this.instance) {
      this.instance = new WebSocketServer()
    }
    return this.instance
  }

  useWebSocket(url, handleMessage) {
    const ws = new WebSocket(url)

    const init = () => {
      bindEvent()
    }

    function bindEvent() {
      ws.addEventListener('open', handleOpen, false)
      ws.addEventListener('close', handleClose, false)
      ws.addEventListener('error', handleError, false)
      ws.addEventListener('message', handleMessage, false)
    }

    function handleOpen(e) {
      console.log('开始建立连接...', e)
    }
    function handleClose(e) {
      console.log('连接关闭', e)
    }
    function handleError(e) {
      console.log('连接出错', e)
    }

    init()

    return ws
  }
}

export default WebSocketServer

