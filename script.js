// script.js — Supabase auth + profile helpers for Kxbroker frontend
// WARNING: Never put your service/secret key in client-side code. Only the public/publishable key goes here.
const SUPABASE_URL = 'https://xzuhppufqsdenxunknhk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_rp1rKncynRmP-oSHRdGXLg_G3sEkXZ9' // publishable (anon) key

// Load Supabase client dynamically (works in module script)
async function loadSupabase() {
  const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
  return mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

let supabase = null
loadSupabase().then((c) => { supabase = c })

// Utility: show console-friendly messages and simple alerts
function showMessage(msg) {
  console.log('[Auth]', msg)
  // keep UX simple here; change to nicer UI as needed
}

/* --- Register flow --- */
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (!supabase) { showMessage('Supabase client not ready'); return }
  const email = document.getElementById('regEmail').value.trim()
  const password = document.getElementById('regPassword').value
  if (!email || !password) { showMessage('Email and password required'); return }

  showMessage('Signing up...')
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  })

  if (signUpError) {
    showMessage('SignUp error: ' + signUpError.message)
    return
  }

  const user = signUpData.user
  if (user) {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: '', role: 'customer' }])
      if (profileError) {
        console.warn('profiles insert error:', profileError)
      } else {
        showMessage('Profile row created (or attempted).')
      }
    } catch (err) {
      console.error('profile insert exception', err)
    }
  }

  showMessage('Registered. Check email if confirmation is required.')
})

/* --- Login flow --- */
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (!supabase) { showMessage('Supabase client not ready'); return }
  const email = document.getElementById('logEmail').value.trim()
  const password = document.getElementById('logPassword').value
  if (!email || !password) { showMessage('Email and password required'); return }

  showMessage('Signing in...')
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (loginError) {
    showMessage('Login error: ' + loginError.message)
    return
  }

  const user = loginData.user
  if (!user) {
    showMessage('No user returned; check email confirmation or auth settings.')
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.warn('Could not load profile:', profileError)
    redirectAfterLogin('customer')
    return
  }

  redirectAfterLogin(profile.role)
})

function redirectAfterLogin(role) {
  if (role === 'admin') {
    window.location.href = '/admin.html'
  } else {
    window.location.href = '/dashboard.html'
  }
}

/* --- Sign out helper --- */
async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
  window.location.href = '/'
}

/* --- Optional: check session on page load --- */
async function checkSessionOnLoad() {
  if (!supabase) return
  const { data } = await supabase.auth.getSession()
  const session = data?.session
  if (session?.user) {
    const userId = session.user.id
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single().catch(() => ({}))
    if (profile?.role === 'admin') {
      console.log('Admin is logged in')
    } else {
      console.log('Customer logged in')
    }
  }
}
setTimeout(checkSessionOnLoad, 800)
