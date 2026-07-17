@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0switch-cos-assets.ps1" %*
echo.
pause
endlocal
