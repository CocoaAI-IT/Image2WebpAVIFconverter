#!/usr/bin/env python3
"""
Simple HTTP Server for Image Converter
画像変換アプリ用のシンプルなHTTPサーバー

Usage:
    python server.py
    または
    python3 server.py

Then open: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging
        print(f"[Server] {self.address_string()} - {format % args}")


if __name__ == "__main__":
    # Change to script directory
    script_dir = Path(__file__).parent
    import os
    os.chdir(script_dir)

    Handler = MyHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("🚀 Image Converter Server Started!")
        print("=" * 60)
        print(f"📁 Serving directory: {script_dir}")
        print(f"🌐 Server running at: {url}")
        print("=" * 60)
        print("👉 ブラウザで開く: Ctrl+C で停止")
        print("=" * 60)

        # Open browser automatically
        try:
            webbrowser.open(url)
            print("✅ ブラウザを開きました")
        except:
            print("⚠️  手動でブラウザを開いてください")

        print("\n[Server] サーバーを停止するには Ctrl+C を押してください\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n[Server] サーバーを停止しています...")
            httpd.shutdown()
            print("✅ サーバーが停止しました")
