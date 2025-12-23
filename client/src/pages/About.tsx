import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { fetchKahootScoresLastModified } from '@/lib/csv';
import { formatLastModified } from '@/lib/blob';
import { BEST_N_WEEKS } from '@/const';

export default function About() {
  const [lastModified, setLastModified] = useState<string>('載入中...');

  useEffect(() => {
    // 主動取得最後更新時間
    fetchKahootScoresLastModified().then((lastModifiedDate) => {
      setLastModified(formatLastModified(lastModifiedDate));
    }).catch(() => {
      setLastModified('無法載入');
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">關於 Kahoot 排行榜</h1>
          <p className="text-muted-foreground">
            計分規則說明與隱私政策
          </p>
        </div>

        <div className="space-y-6">
          {/* 計分規則 */}
          <Card>
            <CardHeader>
              <CardTitle>計分規則</CardTitle>
              <CardDescription>
                本系統採用標準化分數與名次加分機制，確保公平性
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">週成績計算</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>標準化分數</strong>：將原始分數標準化至 0-100 分
                    <div className="ml-6 mt-1 text-muted-foreground">
                      公式：標準化分數 = (原始分數 / 該週最高分) × 100
                    </div>
                  </li>
                  <li>
                    <strong>名次加分</strong>：根據排名給於額外加分
                    <div className="ml-6 mt-1 text-muted-foreground">
                      第 1 名：+5 分 | 第 2 名：+3 分 | 第 3 名：+2 分 | 第 4-10 名：+1 分
                    </div>
                  </li>
                  <li>
                    <strong>週最終分</strong>：標準化分數加上名次加分
                    <div className="ml-6 mt-1 text-muted-foreground">
                      公式：週最終分 = 標準化分數 + 名次加分
                    </div>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">月排行計算（月冠軍）</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>月總分</strong>：加總指定月份內所有週次的「週最終分」
                    <div className="ml-6 mt-1 text-muted-foreground">
                      例如：10月 = ch01 + ch02 + ch03 + ch04 的週最終分加總
                    </div>
                  </li>
                  <li>
                    <strong>同分處理</strong>：若月總分相同，則比較原始分數加總（高者排前）
                  </li>
                  <li>
                    <strong>前三名獎勵</strong>：月排行前三名會顯示 🥇🥈🥉 獎牌與背景色
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">學期總分計算</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>取最佳 {BEST_N_WEEKS} 週</strong>：從所有週次中選取最高的 {BEST_N_WEEKS} 週成績加總
                    <div className="ml-6 mt-1 text-muted-foreground">
                      若週數不足 {BEST_N_WEEKS} 週，則加總所有現有週次
                    </div>
                  </li>
                  <li>
                    <strong>百分制換算</strong>：使用 MIN-MAX 標準化，將學期總分映射到 60-100 區間
                    <div className="ml-6 mt-1 text-muted-foreground">
                      公式：百分制 = 60 + (學期總分 - 全班最低分) / (全班最高分 - 全班最低分) × 40
                    </div>
                    <div className="ml-6 mt-1 text-muted-foreground">
                      保底機制：最高分 100 分，最低分 60 分
                    </div>
                  </li>
                </ol>
              </div>


            </CardContent>
          </Card>

          {/* 隱私政策 */}
          <Card>
            <CardHeader>
              <CardTitle>隱私保護</CardTitle>
              <CardDescription>
                我們重視您的個人資料安全
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                本排行榜系統採用<strong>去識別化</strong>設計，公開榜單僅顯示<strong>學號後四碼</strong>，
                不會顯示完整學號或真實姓名。
              </p>
              <p>
                所有成績資料僅用於課堂參與評分，不會用於其他用途或對外公開。
              </p>
              <p className="text-muted-foreground">
                如對隱私政策有任何疑問，請聯繫課程教師。
              </p>
            </CardContent>
          </Card>

          {/* 資料更新 */}
          <Card>
            <CardHeader>
              <CardTitle>資料更新</CardTitle>
              <CardDescription>
                成績資料更新頻率與說明
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                成績資料通常在每次 Kahoot 活動結束後的 <strong>1-2 個工作天內</strong> 更新。
              </p>
              <p>
                若發現成績有誤，請於活動結束後 <strong>一週內</strong> 向課程教師提出申訴。
              </p>
              <p className="text-muted-foreground mt-4">
                最後更新時間：{lastModified === '未知' ? '本地開發模式（部署後將自動顯示）' : lastModified}
              </p>
            </CardContent>
          </Card>

          {/* 技術說明 */}
          <Card>
            <CardHeader>
              <CardTitle>技術說明</CardTitle>
              <CardDescription>
                本系統採用的技術架構
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                本排行榜系統使用 <strong>Next.js</strong> 框架開發，部署於 <strong>Vercel</strong> 平台。
              </p>
              <p>
                所有成績計算均在前端完成，確保資料處理的透明性與即時性。
              </p>
              <p className="text-muted-foreground">
                系統開源於 <a href="https://github.com/Chihuah/kahoot-leaderboard" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">GitHub</a>，歡迎檢視原始碼。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

