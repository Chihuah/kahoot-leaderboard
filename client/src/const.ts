// Removed shared constants as this is a static-only project

/**
 * 月排行設定：定義每個月份包含哪些週次
 * 優先從環境變數 VITE_MONTH_WEEKS 讀取（JSON 格式）
 * 如果環境變數未設定，則使用下方預設值
 * 如果不需要月排行功能，可以註解或刪除預設值
 */
const DEFAULT_MONTH_WEEKS: Record<string, string[]> | undefined = {
  "10月": ["ch01", "ch02", "ch03", "ch04"],
  "11月": ["ch05", "ch06", "ch07", "ch08"],
  "12月": ["ch09", "ch10", "ch11", "ch12"]
};

// 從環境變數讀取 MONTH_WEEKS，如果沒有設定則使用預設值
function getMonthWeeks(): Record<string, string[]> | undefined {
  const envMonthWeeks = import.meta.env.VITE_MONTH_WEEKS;
  if (envMonthWeeks) {
    try {
      return JSON.parse(envMonthWeeks);
    } catch (error) {
      console.error('[MONTH_WEEKS] 無法解析環境變數 VITE_MONTH_WEEKS，使用預設值', error);
      return DEFAULT_MONTH_WEEKS;
    }
  }
  return DEFAULT_MONTH_WEEKS;
}

export const MONTH_WEEKS = getMonthWeeks();

/**
 * 學期總分：取最佳 N 週的設定
 */
export const BEST_N_WEEKS = 7;

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
