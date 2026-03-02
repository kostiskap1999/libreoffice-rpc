Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d C:\Path\to\project\libre-office.rpc && node index.js", 0, False
Set WshShell = Nothing