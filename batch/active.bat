@echo off
:loop
powershell -command "$wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('{SCROLLLOCK}')"
echo Running at %time%
timeout /t 300 /nobreak >nul
goto loop
