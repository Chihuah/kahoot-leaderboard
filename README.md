# Kahoot Leaderboard Dashboard

一個基於 Next.js 開發的 Kahoot 成績排行榜系統，提供週排行與學期總排行功能，支援標準化分數計算與名次加分機制。

## 功能特色

- ✅ **週排行榜**：顯示每週 Kahoot 成績排名，支援原始分數與課堂參與換算兩種模式
- ✅ **月排行榜（月冠軍）**：按月份統計成績，前三名顯示 🥇🥈🥉 獎牌與背景色
- ✅ **學期總排行榜**：取最佳 N 週成績加總（預設 7 週），自動計算百分制，支援學號與總分排序
- ✅ **標準化分數**：將原始分數標準化至 0-100 分，確保不同週次的公平性
- ✅ **名次加分**：前 10 名給予額外加分（1名:+5, 2名:+3, 3名:+2, 4-10名:+1）
- ✅ **保底機制**：學期總分使用 MIN-MAX 標準化，保底 60 分，滿分 100 分
- ✅ **隱私保護**：僅顯示學號後四碼，保護學生隱私
- ✅ **響應式設計**：支援桌面與行動裝置瀏覽

## 技術架構

- **前端框架**：React 19 + Wouter (路由)
- **樣式系統**：Tailwind CSS 4 + shadcn/ui
- **資料解析**：PapaParse (CSV 解析)
- **部署平台**：Vercel

## 專案結構

```
kahoot-leaderboard/
├── client/                          # 前端應用程式
│   ├── public/                      # 靜態資源目錄
│   │   └── data/                    # CSV 資料檔案
│   │       ├── Kahoot_scores.csv              # 當前使用的成績資料（12 週模擬測試資料）
│   │       └── students.csv                   # 學生名冊（模擬測試資料）
│   ├── src/                         # 原始碼目錄
│   │   ├── components/              # React 元件
│   │   │   ├── ui/                  # shadcn/ui 基礎元件庫
│   │   │   ├── ErrorBoundary.tsx    # 錯誤邊界元件
│   │   │   ├── LeaderboardTable.tsx # 週排行榜表格元件
│   │   │   ├── ManusDialog.tsx      # 對話框元件
│   │   │   ├── SeasonTable.tsx      # 學期總排行榜表格元件
│   │   │   ├── ViewToggle.tsx       # 視圖切換按鈕（原始/換算）
│   │   │   └── WeekPicker.tsx       # 週次選擇器
│   │   ├── contexts/                # React Context
│   │   │   └── ThemeContext.tsx     # 主題管理 Context
│   │   ├── hooks/                   # 自訂 React Hooks
│   │   │   ├── useComposition.ts    # 輸入法組合事件處理
│   │   │   ├── useMobile.tsx        # 行動裝置偵測
│   │   │   └── usePersistFn.ts      # 函式持久化
│   │   ├── lib/                     # 工具函式庫
│   │   │   ├── blob.ts              # Vercel Blob 讀取工具
│   │   │   ├── compute.ts           # 成績計算邏輯（核心）
│   │   │   ├── csv.ts               # CSV 解析工具
│   │   │   ├── types.ts             # TypeScript 型別定義
│   │   │   └── utils.ts             # 通用工具函式
│   │   ├── pages/                   # 頁面元件
│   │   │   ├── About.tsx            # 規則說明頁
│   │   │   ├── Home.tsx             # 首頁（排行榜）
│   │   │   └── NotFound.tsx         # 404 頁面
│   │   ├── App.tsx                  # 應用程式入口與路由
│   │   ├── const.ts                 # 常數定義
│   │   ├── index.css                # 全域樣式（Tailwind CSS）
│   │   └── main.tsx                 # React 進入點
│   └── index.html                   # HTML 模板
├── DEPLOYMENT.md                    # 部署教學
├── ENV_SETUP.md                     # 環境變數設定說明
├── QUICK_START.md                   # Vercel Blob 快速開始指南（推薦閱讀）
├── README.md                        # 專案說明文件
├── VERCEL_BLOB_GUIDE.md             # Vercel Blob 完整指南（含方案比較）
├── VERCEL_BLOB_SETUP.md             # Vercel Blob 詳細設定步驟
├── MONTH_WEEKS_CONFIG.md			 # 月排行設定說明 (變數：MONTH_WEEKS)
├── components.json                  # shadcn/ui 設定檔
├── package.json                     # 專案依賴與腳本
├── pnpm-lock.yaml                   # pnpm 鎖定檔
├── tsconfig.json                    # TypeScript 設定
├── tsconfig.node.json               # Node.js TypeScript 設定
└── vite.config.ts                   # Vite 建置工具設定
```

## 計分規則

### 週成績計算

1. **標準化分數** = (原始分數 / 該週最高分) × 100
2. **名次加分**：
   - 第 1 名：+5 分
   - 第 2 名：+3 分
   - 第 3 名：+2 分
   - 第 4-10 名：+1 分
   - 其餘：0 分
3. **週最終分** = 標準化分數 + 名次加分

**注意**：週成績計算**無保底機制**，標準化分數可低於 60 分。

### 月排行計算

1. **月總分**：加總指定月份內所有週次的「週最終分」
   - 例如：10月 = ch01 + ch02 + ch03 + ch04 的週最終分加總
2. **同分處理**：若月總分相同，則比較原始分數加總（高者排前）
3. **前三名獎勵**：月排行前三名會顯示 🥇🥈🥉 獎牌與背景色

**設定月份對應週次**：在 `client/src/const.ts` 中修改 `MONTH_WEEKS` 變數，如果不需要月排行功能，可以註解或刪除此設定。更多詳細介紹，請見說明文件`MONTH_WEEKS_CONFIG.md`

### 學期總分計算

1. **取最佳 N 週**：從所有週次中選取最高的 N 週成績加總（預設 N=7，可在 `client/src/const.ts` 中修改 `BEST_N_WEEKS`）
2. **百分制換算**：使用 **MIN-MAX 標準化**，將學期總分映射到 60-100 區間
   - 公式：百分制 = 60 + (學期總分 - 全班最低分) / (全班最高分 - 全班最低分) × 40
   - **保底機制**：最高分 100 分，最低分 60 分
3. **排序功能**：學期總排行榜支援按「學號」或「學期總分」排序，預設按總分降序排列

## 本地開發

### 環境需求

- Node.js 18+
- pnpm 8+

### 安裝與執行

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置生產版本
pnpm build

# 預覽生產版本
pnpm preview
```

開發伺服器預設運行於 `http://localhost:3000`

## 資料格式

### students.csv

學生名冊檔案，格式如下：

```csv
student_id,student_name,display_name
0554,王小明,小明
0159,李小華,小華
```

### Kahoot_scores.csv

Kahoot 原始成績檔案，格式如下：

```csv
student_id,ch01,ch02,ch03,ch04,ch05,ch06,ch07,ch08,ch09,ch10,ch11,ch12
0554,16000,14831,8304,9602,12737,4136,13661,6328,12514,11654,10961,8535
0159,10271,,10843,8850,4020,9497,7227,8322,8542,12363,15378,10231
0317,11723,7686,10235,8151,9018,10611,8679,,14220,8993,11296,
```

- 第一欄為學號（後四碼）
- 後續欄位為各週次的原始分數
- 空白欄位表示該學生該週缺席或未參與

## 部署至 Vercel

本專案支援使用 **Vercel Blob** 安全地存放 CSV 資料，避免將學生隱私資料提交至 GitHub。

### 🚀 快速開始

詳細步驟請參考 **`QUICK_START.md`** 文件，約 15-20 分鐘即可完成設定。

**簡要流程：**

1. 在 Vercel Dashboard 建立 Blob Store
2. 使用 Vercel CLI 上傳 CSV 檔案
3. 設定環境變數（`VITE_KAHOOT_SCORES_BLOB_URL` 和 `VITE_STUDENTS_BLOB_URL` 或 `VITE_MONTH_WEEKS`）
4. 推送程式碼並部署

### 方法一：使用 Vercel Blob（推薦）

**這是最安全且最方便的方式**，適合保護學生隱私資料，且更新成績無需重新部署。

**優點：**

- ✅ CSV 資料不會出現在 GitHub 或公開網址
- ✅ 無檔案大小限制
- ✅ 更新成績無需重新部署（上傳新 CSV 即可）
- ✅ 完全免費（500MB 儲存 + 100GB 月頻寬）

**設定步驟：**

請參考以下文件：

- **快速開始**：`QUICK_START.md`（推薦，15-20 分鐘完成）
- **完整教學**：`VERCEL_BLOB_SETUP.md`（含截圖與詳細說明）
- **環境變數說明**：`ENV_SETUP.md`
- **Vercel Blob 指南**：`VERCEL_BLOB_GUIDE.md`（含方案比較與成本分析）

### 方法二：使用環境變數（小型資料集）

適合學生人數少於 100 人的小型資料集。

**限制**：環境變數有大小限制（約 4KB），不適合大型 CSV 檔案。

**步驟**：

1. 將 CSV 內容複製為純文字
2. 在 Vercel 設定環境變數：`VITE_KAHOOT_SCORES_CSV` 和 `VITE_STUDENTS_CSV`
3. 修改 `csv.ts` 優先從環境變數讀取

### 方法三：使用 public 目錄（僅限測試）

**⚠️ 注意：此方法會將 CSV 檔案公開，不建議用於正式環境**

1. 將 CSV 檔案放在 `client/public/data/` 目錄
2. 在 `.gitignore` 中加入：
   ```
   client/public/data/*.csv
   ```
3. 使用 Vercel CLI 手動上傳檔案

## 更新成績資料

### 使用環境變數方式

1. 編輯新的 CSV 檔案
2. 複製完整內容
3. 在 Vercel 專案設定中更新對應的環境變數
4. 觸發重新部署（Vercel 會自動偵測環境變數變更）

### 使用 public 目錄方式

1. 更新 `client/public/data/Kahoot_scores.csv`
2. 推送至 GitHub
3. Vercel 自動部署

## 常見問題

### Q: 如何修改「最佳 N 週」的數值？

A: 在 `client/src/const.ts` 中修改 `BEST_N_WEEKS` 常數的值即可。例如將 `export const BEST_N_WEEKS = 7;` 改為您想要的數值。修改後，首頁與規則說明頁會自動顯示新的數值。

### Q: 如何新增更多週次？

A: 只需在 `Kahoot_scores.csv` 中新增對應的欄位（例如 `ch13`），系統會自動偵測並顯示。

### Q: 週成績有保底機制嗎？

A: **沒有**。週成績計算不設保底，標準化分數可低於 60 分。保底機制僅適用於學期總分的百分制換算。

### Q: 學期總分的保底機制如何運作？

A: 學期總分使用 MIN-MAX 標準化，將全班的學期總分映射到 60-100 分區間。最高分固定為 100 分，最低分固定為 60 分，中間分數按比例分配。

### Q: 如何客製化 UI 樣式？

A: 修改 `client/src/index.css` 中的 CSS 變數，或直接編輯各元件的 Tailwind 類別。

## 模擬測試資料

專案包含 12 週的模擬測試資料（`Kahoot_scores_12weeks.csv`），包含 73 位學生，出席率約 86.5%。您可以使用此資料測試系統功能。

## 授權

MIT License

## 專案開發AI協作

本專案之初期規劃與專案開發規格書，由ChatGPT 5對話生成。後續程式碼撰寫、修訂與說明文件撰寫，由 AI Agent ([Manus](https://manus.im/app)) 協助製作。
