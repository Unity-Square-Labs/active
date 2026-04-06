@echo off
:loop
for /f "tokens=1-2 delims=:" %%a in ("%time%") do (
    set hour=%%a
    set min=%%b
)
set hour=%hour: =%

if %hour% LSS 8 goto sleep
if %hour% GTR 17 goto sleep
if %hour% EQU 17 if %min% GTR 30 goto sleep

powershell -command "$wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('{SCROLLLOCK}')"
echo Running at %time%

:sleep
ping -n 60 localhost >nul
goto loop
