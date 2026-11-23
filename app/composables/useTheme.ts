/**
 * 檯燈 = 深色模式。記住使用者的選擇；首次造訪跟隨 prefers-color-scheme。
 * 首次繪製前由 nuxt.config 的行內腳本（THEME_SCRIPT）先決定 <html> 的 dark class，避免閃一下；
 * 這裡在掛載後讀回那個結果，之後由檯燈切換。
 */
export const THEME_KEY = 'theme'

export function useTheme() {
  const dark = useState('theme-dark', () => false)

  function apply(v: boolean) {
    dark.value = v
    document.documentElement.classList.toggle('dark', v)
  }

  function sync() {
    dark.value = document.documentElement.classList.contains('dark')
  }

  function toggle() {
    apply(!dark.value)
    try {
      localStorage.setItem(THEME_KEY, dark.value ? 'dark' : 'light')
    }
    catch {
      // 無痕模式或封鎖儲存時就不記住
    }
  }

  return { dark, sync, toggle }
}
