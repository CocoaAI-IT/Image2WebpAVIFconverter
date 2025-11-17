@echo off
REM Windows用サーバー起動スクリプト
REM Server startup script for Windows

echo ========================================
echo   Image Converter Server
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Pythonを使用してサーバーを起動します...
    python server.py
) else (
    echo Pythonが見つかりません。代替方法を試します...
    python3 --version >nul 2>&1
    if %errorlevel% == 0 (
        python3 server.py
    ) else (
        echo.
        echo [エラー] Pythonがインストールされていません
        echo.
        echo 以下の方法でサーバーを起動してください:
        echo.
        echo 1. Python 3をインストール: https://www.python.org/
        echo 2. または Node.js + npx: npx http-server -p 8000 -c-1
        echo 3. または VS Code Live Serverを使用
        echo.
        pause
    )
)
