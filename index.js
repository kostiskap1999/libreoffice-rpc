const RPC = require('discord-rpc')
const { windowManager } = require('node-window-manager')

const clientId = '1476155314213752832'

RPC.register(clientId)

const rpc = new RPC.Client({ transport: 'ipc' })

let sessionStart = null
let lastFileName = null
let lastRunningState = false

rpc.on('ready', () => {
  console.log('Rich Presence running…')

  setInterval(() => {
    const libreInfo = checkLibreOffice()

    if (libreInfo.isRunning) {
      if (!sessionStart) sessionStart = new Date()

      // Only update Discord if something changed
      if (
        libreInfo.fileName !== lastFileName ||
        !lastRunningState
      ) {
        rpc.setActivity({
          details: libreInfo.fileName
          ? `Editing: ${libreInfo.fileName}`
          : 'Not in a file',
          state: 'LibreOffice Open',
          startTimestamp: sessionStart,
          largeImageKey: 'libreoffice',
          largeImageText: 'LibreOffice',
          instance: false
        })

        lastFileName = libreInfo.fileName
      }

      lastRunningState = true
    } else {
      if (lastRunningState) {
        rpc.clearActivity()
        sessionStart = null
        lastFileName = null
      }

      lastRunningState = false
    }
  }, 500) // 0.5 second polling = near-instant updates
})

rpc.login({ clientId }).catch(console.error)

/**
 * Real-time LibreOffice window detection
 */
function checkLibreOffice() {
  const windows = windowManager.getWindows()

  // Look for any visible LibreOffice window
  const libreWindow = windows.find(win => {
    return (
      win.path &&
      win.path.toLowerCase().includes('soffice') &&
      win.isVisible()
    )
  })

  if (!libreWindow) {
    return { isRunning: false, fileName: null }
  }
  
  const title = libreWindow.getTitle()

  // Example title:
  // "file1.odt - LibreOffice Writer"
  const match = title.match(/^(.+?)\s[-—]\sLibreOffice/i)

  return {
    isRunning: true,
    fileName: match ? match[1] : null
  }
}