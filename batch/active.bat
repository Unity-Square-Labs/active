@echo off
:loop
call :checktime
powershell -command "$wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('{SCROLLLOCK}')"
echo Running at %time%
timeout /t 300 /nobreak >nul
goto loop

:checktime
set "t=%time: =0%"
for /f "tokens=1-2 delims=:." %%a in ("%t%") do (
    set /a "hh=1%%a-100", "mm=1%%b-100"
)
set /a "now=hh*60+mm"
set /a "start=8*60", "end=17*60+30"
if %now% lss %start% exit
if %now% geq %end% exit
goto :eof
