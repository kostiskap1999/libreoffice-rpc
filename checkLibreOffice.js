const { windowManager } = require('node-window-manager')

function checkLibreOffice() {
    console.log("checking LibreOffice")
  const windows = windowManager.getWindows()

  const libreWindow = windows.find(win => {
    return (
      win.path &&
      win.path.toLowerCase().includes('soffice') &&
      win.isVisible()
    )
  })
  console.log("--libreWindow--")
  console.log(libreWindow)

  if (!libreWindow) {
    return { isRunning: false, fileName: null }
  }
  
  const title = libreWindow.getTitle()
  console.log("title: " + title)

  // Example title:
  // "file1.odt - LibreOffice Writer"
  const match = title.match(/^(.+?)\s[-—]\sLibreOffice/i)
  console.log("match: " + match)
  

  return {
    isRunning: true,
    fileName: match ? match[1] : null
  }
}

module.exports = { checkLibreOffice }