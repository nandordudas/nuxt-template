import { AliasSortingPlugin, FlatMetaPlugin, TemplateParamsPlugin } from '@unhead/vue/plugins'

export default defineNuxtPlugin({
  setup() {
    const unhead = injectHead()

    unhead.use(TemplateParamsPlugin)
    unhead.use(FlatMetaPlugin)
    unhead.use(AliasSortingPlugin)
  },
})
