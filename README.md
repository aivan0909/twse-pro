# 台股∞PRO — 完整部署說明

## 檔案結構
```
twse-pwa/
├── index.html      主應用程式
├── manifest.json   PWA 設定
├── sw.js           Service Worker（離線支援）
├── icon-192.svg    App 圖示（小）
├── icon-512.svg    App 圖示（大）
└── README.md       本說明文件
```

## 功能清單
- ✅ K 線圖（7/14/30/60 日）
- ✅ 技術指標：MA5、MA10、布林通道（BB）、KD 隨機指標
- ✅ 籌碼面：三大法人買賣超（外資/投信/自營商）
- ✅ 到價警報（突破/跌破）+ 瀏覽器推播通知
- ✅ 匯出報表：CSV（Excel）、JSON、HTML 報表
- ✅ PWA：可安裝至手機/桌面主畫面
- ✅ 離線支援（Service Worker 快取）
- ✅ RWD 響應式設計（手機/平板/桌機）
- ✅ 資料來源：TWSE 官方 API（免費）+ 富果 Fugle（即時）

## 部署方式

### 方法一：Vercel（推薦，免費）
1. 在 vercel.com 註冊帳號
2. 建立新 Project → 上傳 twse-pwa 資料夾
3. 部署完成，取得 HTTPS URL（PWA 需要 HTTPS）

### 方法二：Netlify（免費）
1. 在 netlify.com 註冊
2. 拖曳 twse-pwa 資料夾到 Netlify 部署區
3. 自動部署完成

### 方法三：GitHub Pages（免費）
```bash
# 建立 GitHub Repo，上傳所有檔案
# Settings → Pages → 選擇 main branch
```

### 方法四：本地測試
```bash
# 需要 HTTPS 才能完整測試 PWA
npx serve twse-pwa
# 或
python3 -m http.server 8080 --directory twse-pwa
```

## 手機安裝 PWA
- **Android（Chrome）**：瀏覽網址 → 右上角選單 → 「安裝應用程式」
- **iOS（Safari）**：瀏覽網址 → 分享圖示 → 「加入主畫面」
- **桌面（Chrome/Edge）**：網址列右側出現安裝圖示

## 富果 API Key 取得
1. 前往 https://developer.fugle.tw
2. 免費註冊會員
3. 個人設定 → 取得 API Token
4. 在 App 右上角「🔑 富果Key」輸入

## 資料更新時機
| 資料 | 來源 | 更新時間 |
|------|------|---------|
| 收盤價/K線 | TWSE OpenAPI | 每日 17:00 後 |
| 即時報價 | 富果 REST | 盤中即時查詢 |
| WebSocket | 富果 WS | Tick 級即時 |
| 三大法人 | TWSE T86 | 每日收盤後 |

## CORS 說明
TWSE API 允許瀏覽器直接存取，無需後端代理。
若遇到 CORS 問題，可在 Vercel/Netlify 設定 proxy。
