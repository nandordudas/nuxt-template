export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server)
    return

  invalidateViewTransition()

  function invalidateViewTransition() {
    if ('id' in to.params && 'id' in from.params) {
      if (to.params.id && from.params.id)
        to.meta.viewTransition = false
    }
  }
})
