@echo off
:loop
for /f "tokens=1-2 delims=:" %%a in ("%time%") do (
    set hour=%%a
    set min=%%b
)
set hour=%hour: =%
if %hour% LSS 8 goto exit
if %hour% GTR 17 goto exit
if %hour% EQU 17 if %min% GTR 30 goto exit

powershell -command "$wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('{SCROLLLOCK}')"
echo Running at %time%

timeout /t 60 /nobreak >nul
goto loop

:exit
echo Outside work hours (%time%). Exiting.
exit
