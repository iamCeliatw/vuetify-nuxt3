// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if(process.server) return;
  const user = await useSupabaseClient().auth.getUser()
  if (to.path === '/admin' && !user.data.user) {
    return navigateTo('/login');
  }
});
