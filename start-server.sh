#!/bin/bash
# macOS/Linux用サーバー起動スクリプト
# Server startup script for macOS/Linux

echo "========================================"
echo "  Image Converter Server"
echo "========================================"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Python 3を使用してサーバーを起動します..."
    python3 server.py
elif command -v python &> /dev/null; then
    echo "Pythonを使用してサーバーを起動します..."
    python server.py
else
    echo ""
    echo "[エラー] Pythonがインストールされていません"
    echo ""
    echo "以下の方法でサーバーを起動してください:"
    echo ""
    echo "1. Python 3をインストール:"
    echo "   macOS: brew install python3"
    echo "   Ubuntu/Debian: sudo apt install python3"
    echo ""
    echo "2. または Node.js + npx:"
    echo "   npx http-server -p 8000 -c-1"
    echo ""
    echo "3. または VS Code Live Serverを使用"
    echo ""
    exit 1
fi
