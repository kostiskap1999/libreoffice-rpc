const RPC = require('discord-rpc')
const { checkLibreOffice } = require('./checkLibreOffice')

const clientId = '1476155314213752832'

RPC.register(clientId)

const rpc = new RPC.Client({ transport: 'ipc' })

const NULL_THRESHOLD = 2 // 2 * 3s = 6s

let sessionStart = null
let lastFileName = null
let lastRunningState = false
let nullFileCounter = 0
let rpcObject = {
                  details: 'Not in a file',
                  state: 'LibreOffice Open',
                  startTimestamp: sessionStart,
                  largeImageKey: 'libreoffice',
                  largeImageText: 'LibreOffice',
                  instance: false
                }

rpc.on('ready', () => {
  console.log('Rich Presence running…')

  setInterval(() => {
    console.log("===================START======================")
    const libreInfo = checkLibreOffice()
    
    if (libreInfo.isRunning) {
      sessionStart ??= new Date()

      if (libreInfo.fileName) {
        nullFileCounter = 0

        if (libreInfo.fileName !== lastFileName || !lastRunningState) {
          console.log("--libreInfo--")
          console.log(libreInfo)
          rpcObject.details = `Editing: ${libreInfo.fileName}`
          lastFileName = libreInfo.fileName
        }
      } else {
        nullFileCounter++

        if (nullFileCounter >= NULL_THRESHOLD && lastFileName !== null) {
          rpcObject.details = 'Not in a file'
          lastFileName = null
        }
      }

      rpc.setActivity(rpcObject)
      lastRunningState = true
    } else {
      nullFileCounter = 0
      if (lastRunningState) {
        rpc.clearActivity()
        sessionStart = null
        lastFileName = null
      }

      lastRunningState = false
    }
    console.log("===================END======================\n")
  }, 3000)
})

rpc.login({ clientId }).catch(console.error)

