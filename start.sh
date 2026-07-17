#!/bin/bash
# DrawRu 一键启动器

cd "$(dirname "$0")"

echo ""
echo " ╔══════════════════════════════════════╗"
echo " ║       DrawRu v3.5.6-beta 启动器     ║"
echo " ╚══════════════════════════════════════╝"
echo ""
echo " 正在启动本地服务器..."
echo " 启动成功后，浏览器将自动打开"
echo " 按 Ctrl+C 可停止服务器"
echo ""

# 使用 Python 启动 HTTP 服务器
python -m http.server 8080 2>&1 &
PID=$!

# 等待服务器启动
sleep 2

# 检测是否启动成功
if kill -0 $PID 2>/dev/null; then
    echo " 服务器已启动: http://localhost:8080/"
    
    # Windows 上用 start 打开浏览器
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start http://localhost:8080/
    else
        open http://localhost:8080/ 2>/dev/null || xdg-open http://localhost:8080/ 2>/dev/null
    fi
else
    echo " 启动失败，请检查端口 8080 是否被占用"
    exit 1
fi

# 等待用户按 Ctrl+C
echo ""
echo " 按 Ctrl+C 停止服务器"
wait $PID
