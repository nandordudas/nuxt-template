import { en } from '@nuxt/ui/locale'
import colors from 'tailwindcss/colors'

type Color = keyof typeof colors

export function useHeadCommon() {
  const appConfig = useAppConfig()
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const themeColor = computed(() => isDark.value ? colors[appConfig.ui.colors.neutral as Color][900] : 'white')
  const lang = computed(() => en.code)
  const dir = computed(() => en.dir)

  useHead({
    meta: [{ key: 'theme-color', name: 'theme-color', content: themeColor }],
    link: [{ rel: 'icon', type: 'image/svg+xml', href: import.meta.env.DEV ? '/icon-dev.svg' : '/icon.svg' }],
    htmlAttrs: { dir, lang },
  })

  return { locale: en }
}
