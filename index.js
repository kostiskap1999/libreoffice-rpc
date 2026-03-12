const RPC = require('discord-rpc')
const { checkLibreOffice } = require('./checkLibreOffice')

const clientId = '1476155314213752832'

RPC.register(clientId)

const rpc = new RPC.Client({ transport: 'ipc' })

// ===== CONFIG =====
const POLL_INTERVAL = 3000        // 3 seconds
const IDLE_DELAY = 60000          // 60 seconds
const NULL_THRESHOLD = 2          // 2 * 3s = 6s file null debounce

// ===== STATE =====
let sessionStart = null
let lastFileName = null
let lastRunningState = false
let lastFocusState = null
let lastFocusedAt = null
let nullFileCounter = 0

rpc.on('ready', () => {
  console.log('Rich Presence running…')

  setInterval(() => {
    const libreInfo = checkLibreOffice()
    const now = Date.now()

    // ====================================
    // LibreOffice IS running
    // ====================================
    if (libreInfo.isRunning) {
      sessionStart ??= new Date()
      let somethingChanged = false

      
      // -------- FILE DETECTION --------
      if (libreInfo.fileName) {
        nullFileCounter = 0

        if (libreInfo.fileName !== lastFileName) {
          lastFileName = libreInfo.fileName
          somethingChanged = true
        }
      } else {
        nullFileCounter++

        if (nullFileCounter >= NULL_THRESHOLD && lastFileName !== null) {
          lastFileName = null
          somethingChanged = true
        }
      }


      // -------- FOCUS DETECTION --------
      const now = Date.now()
      if (libreInfo.isFocused)
        lastFocusedAt = now

      let effectiveFocusState = false
      if (lastFocusedAt && (now - lastFocusedAt) < IDLE_DELAY)
        effectiveFocusState = true

      if (effectiveFocusState !== lastFocusState) {
        lastFocusState = effectiveFocusState
        somethingChanged = true
      }


      // -------- UPDATE DISCORD IF NEEDED --------
      if (somethingChanged || !lastRunningState) {
        const activity = {
          details: lastFileName
            ? "In a file"
            : "Not in a file",
          startTimestamp: sessionStart,
          largeImageKey: "libreoffice",
          largeImageText: "LibreOffice",
          instance: false
        }

        if (lastFileName) {
          activity.state = lastFocusState
            ? "Writing a masterpiece"
            : "Probably procrastinating"
        }

        rpc.setActivity(activity)
      }

      lastRunningState = true
    }

    // ====================================
    // LibreOffice CLOSED
    // ====================================
    else {
      nullFileCounter = 0

      if (lastRunningState) {
        rpc.clearActivity()
        sessionStart = null
        lastFileName = null
        lastFocusState = null
        lastFocusedAt = null
      }

      lastRunningState = false
    }

  }, POLL_INTERVAL)
})

rpc.login({ clientId }).catch(console.error)