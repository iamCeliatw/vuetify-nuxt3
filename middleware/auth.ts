// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await useSupabaseClient().auth.getUser()
  if (to.path.startsWith('/admin') && !user.data.user) {
    return navigateTo('/login');
  }
});
