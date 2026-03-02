const { windowManager } = require('node-window-manager')

function checkLibreOffice() {
  const windows = windowManager.getWindows()

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
  
  const activeWindow = windowManager.getActiveWindow()
  const isFocused =
    activeWindow &&
    activeWindow.path &&
    activeWindow.path.toLowerCase().includes('soffice')

  // Example title: "file1.odt - LibreOffice Writer"
  const title = libreWindow.getTitle()
  const match = title.match(/^(.+?)\s[-—]\sLibreOffice/i)
  

  return {
    isRunning: true,
    fileName: match ? match[1] : null,
    isFocused
  }
}

module.exports = { checkLibreOffice }