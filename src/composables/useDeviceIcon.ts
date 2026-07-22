/**
 * 把后端存储的 browser / os 文本映射为 iconify 品牌图标名。
 * 供评论区展示访客设备图标。
 */

/** 浏览器名 → iconify 图标（logos 集为品牌彩色 logo） */
const BROWSER_ICONS: Array<[RegExp, string]> = [
  [/edge/i, 'logos:microsoft-edge'],
  [/chrome/i, 'logos:chrome'],
  [/firefox/i, 'logos:firefox'],
  [/safari/i, 'logos:safari'],
  [/opera|opr/i, 'logos:opera'],
  [/brave/i, 'logos:brave'],
  [/qq/i, 'simple-icons:tencentqq'],
  [/wechat|micromessenger/i, 'ic:baseline-wechat'],
  [/uc/i, 'arcticons:uc-browser'],
  [/samsung/i, 'logos:samsung']
]

/** 操作系统名 → iconify 图标 */
const OS_ICONS: Array<[RegExp, string]> = [
  [/windows/i, 'logos:microsoft-windows-icon'],
  [/mac|os\s?x|macos/i, 'ic:baseline-apple'],
  [/ios|iphone|ipad/i, 'ic:baseline-apple'],
  [/android/i, 'logos:android-icon'],
  [/ubuntu/i, 'logos:ubuntu'],
  [/linux/i, 'logos:linux-tux'],
  [/harmony/i, 'arcticons:harmonyos']
]

const matchIcon = (value: string | undefined, table: Array<[RegExp, string]>, fallback: string) => {
  if (!value) return fallback
  for (const [re, icon] of table) {
    if (re.test(value)) return icon
  }
  return fallback
}

export const useDeviceIcon = () => {
  const browserIcon = (browser?: string) =>
    matchIcon(browser, BROWSER_ICONS, 'material-symbols:public')
  const osIcon = (os?: string) => matchIcon(os, OS_ICONS, 'material-symbols:devices')
  return { browserIcon, osIcon }
}
