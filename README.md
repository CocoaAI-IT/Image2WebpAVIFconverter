# 🖼️ Image to WebP/AVIF Converter

PNG、JPEG、TIFF などの画像形式を WebP や AVIF に変換する、モダンなWebアプリケーションです。

## ✨ 機能

- **複数の画像形式に対応**
  - 入力: PNG, JPEG, TIFF, BMP, GIF など
  - 出力: WebP（可逆/不可逆）, AVIF

- **柔軟な変換オプション**
  - WebP: 可逆圧縮（Lossless）または不可逆圧縮（Lossy）を選択可能
  - 品質調整スライダー（1-100%）

- **使いやすいUI**
  - ドラッグ&ドロップで画像ファイルを追加
  - クリップボードから画像を貼り付け（Ctrl+V / Cmd+V）
  - 複数ファイルの一括処理
  - リアルタイムプレビュー表示

- **詳細な情報表示**
  - 元画像と変換後画像の並列プレビュー
  - ファイルサイズの比較
  - 圧縮率の表示

- **便利なダウンロード機能**
  - 個別ファイルのダウンロード
  - すべてのファイルをZIPで一括ダウンロード

- **完全にブラウザで動作**
  - サーバー不要
  - プライバシー保護（画像はアップロードされません）

## 🚀 使い方

### 起動方法

このアプリケーションは ES Modules を使用しているため、ローカルHTTPサーバーで実行する必要があります。

#### **方法1: 自動起動スクリプト（推奨）**

**Windows:**
```bash
start-server.bat
```
ダブルクリックするだけで自動的にブラウザが開きます。

**macOS / Linux:**
```bash
./start-server.sh
```
または
```bash
bash start-server.sh
```

#### **方法2: 手動でPythonサーバーを起動**

```bash
# Python 3がインストールされている場合
python3 server.py

# または
python server.py
```

ブラウザで `http://localhost:8000` を開きます。

#### **方法3: その他の方法**

**Node.jsを使用:**
```bash
npx http-server -p 8000 -c-1
```

**VS Code Live Server拡張機能:**
1. VS Codeで `index.html` を開く
2. 右クリック → "Open with Live Server"

### アプリの使い方

1. **ローカルサーバーを起動**
   - 上記の方法でサーバーを起動します
   - ブラウザで `http://localhost:8000` にアクセス

2. **画像を選択** (以下のいずれかの方法)
   - ドラッグ&ドロップで画像をアップロード
   - 「ファイルを選択」ボタンをクリック
   - 「クリップボードから貼り付け」ボタンをクリック
   - キーボードショートカット: Ctrl+V (Windows) / Cmd+V (Mac)

3. **変換設定**
   - 出力形式を選択（WebP または AVIF）
   - WebP の場合、圧縮モードを選択（可逆/不可逆）
   - 品質スライダーで圧縮品質を調整

4. **変換を実行**
   - 「変換を開始」ボタンをクリック

5. **ダウンロード**
   - 個別ファイルをダウンロード
   - または「すべてを ZIP でダウンロード」で一括取得

## 🛠️ 技術スタック

- **HTML5**: 基本構造
- **Tailwind CSS**: モダンなUIデザイン
- **Vanilla JavaScript (ES Modules)**: 画像変換ロジック
- **Canvas API**: 画像処理（WebP変換）
- **@jsquash/avif (WebAssembly)**: AVIF エンコーディング
- **Clipboard API**: クリップボードからの画像取得
- **JSZip**: ZIP ファイル生成

## 📋 対応ブラウザ

このアプリケーションは、WebAssembly をサポートする全てのモダンブラウザで動作します。

- **Chrome 90+**
- **Firefox 89+**
- **Safari 15+**
- **Edge 90+**

**AVIF 変換について**: WebAssembly ベースのエンコーダー（@jsquash/avif）を使用しているため、ブラウザのネイティブAVIF対応に依存せず、全てのモダンブラウザでAVIF変換が可能です。

## 🎨 UI デザイン

- グラデーション背景
- レスポンシブデザイン
- アニメーション効果
- ドラッグ&ドロップのビジュアルフィードバック
- モダンなカードベースレイアウト

## 📦 ファイル構成

```
Image2WebpAVIFconverter/
├── index.html         # メインHTMLファイル
├── app.js             # JavaScript ロジック（ES Module）
├── server.py          # Pythonローカルサーバー
├── start-server.bat   # Windows用起動スクリプト
├── start-server.sh    # macOS/Linux用起動スクリプト
└── README.md          # このファイル
```

## 🔒 プライバシー

このアプリケーションは完全にブラウザ内で動作します。画像はサーバーにアップロードされることはなく、すべての処理がローカルで行われます。

## 🔧 トラブルシューティング

### CORSエラーが発生する

**エラー例:**
```
Access to script at 'file:///.../app.js' from origin 'null' has been blocked by CORS policy
```

**原因:**
HTMLファイルを `file://` プロトコルで直接開いているため、ES Modules が動作しません。

**解決方法:**
1. ローカルHTTPサーバーを起動してください（上記の「起動方法」を参照）
2. `start-server.bat`（Windows）または `start-server.sh`（macOS/Linux）を実行
3. ブラウザで `http://localhost:8000` にアクセス

### ボタンが反応しない

- ブラウザのコンソールにエラーが表示されていないか確認してください
- ローカルサーバー経由でアクセスしているか確認してください
- ブラウザのキャッシュをクリアして再読み込みしてください（Ctrl+Shift+R / Cmd+Shift+R）

### AVIF変換が遅い

- AVIF変換はWebAssemblyを使用するため、大きな画像では数秒かかる場合があります
- 複数の画像を変換する場合は、順番に処理されるため時間がかかります
- これは正常な動作です

### クリップボードから貼り付けできない

- ブラウザがClipboard APIをサポートしているか確認してください
- HTTPS または localhost でアクセスしているか確認してください
- ブラウザのクリップボード権限を許可してください

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！

## 📞 サポート

問題が発生した場合は、Issue を作成してください。
