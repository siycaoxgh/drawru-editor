@echo off
chcp 65001 >nul
title DrawRu v3.5.6-beta 启动器
cd /d "%~dp0"

echo.
echo   ========================================
echo     DrawRu v3.5.6-beta  Markdown - 微信
echo   ========================================
echo.
echo   启动本地 HTTP 服务器...
echo.
echo   地址: http://localhost:8080/
echo   按 Ctrl+C 停止服务器
echo.

python -m http.server 8080

pause
