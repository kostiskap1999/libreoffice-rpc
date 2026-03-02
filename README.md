## LibreOffice Rich Presence for Discord
This script sets a basic Rich Presence for LibreOffice on Discord. It detects whether LibreOffice is open, if a file is open or not, and if the user has been idle for more than 30 seconds.

## Instructions
1. Download and install node if you don't already have it.
2. Clone the project and install dependencies with `npm start`.
3. Change the folder path on the project's .vbs file to where you'll keep have the code.

Optional: To have the script running in the background on startup
4. Press `Windows key + R ` and type `shell:startup`. Copy the .vbs file there.
5. Do the same with `shell:common startup` to install for all users.

To kill the script
6. Open task manager.
7. Find it in the Details tab as a node.exe and kill it.