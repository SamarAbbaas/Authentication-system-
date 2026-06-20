export async function waitForSession(supabaseClient: any, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const { data: { session } } = await supabaseClient.auth.getSession()
    if (session) {
      return session
    }
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  return null
}
