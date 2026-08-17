// script.js — Supabase auth + profile helpers for Kxbroker frontend
// IMPORTANT: replace the placeholders below with your project's values
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'   // e.g. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY'            // e.g. sbp_...

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
  // uncomment next line to show alerts:
  // alert(msg)
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

  // If signUpData.user exists, create a profile row for them.
  // Note: the anon key can insert rows only if RLS policies permit it (we'll rely on policies that allow user to insert their own profile).
  const user = signUpData.user
  if (user) {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: '', role: 'customer' }])
      if (profileError) {
        // If it fails due to RLS or other reason, log it — profile can be created server-side later.
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
  // signInWithPassword for current supabase client API
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

  // Retrieve profile to get role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    // If profile missing, user is probably not yet seeded; default to customer
    console.warn('Could not load profile:', profileError)
    redirectAfterLogin('customer')
    return
  }

  redirectAfterLogin(profile.role)
})

function redirectAfterLogin(role) {
  if (role === 'admin') {
    // create an admin.html page or admin area
    window.location.href = '/admin.html'
  } else {
    // user dashboard (create dashboard.html)
    window.location.href = '/dashboard.html'
  }
}

/* --- Sign out helper --- */
async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
  localStorage.removeItem('sb-logged-in')
  window.location.href = '/'
}

/* --- Optional: check session on page load --- */
async function checkSessionOnLoad() {
  if (!supabase) return
  const { data } = await supabase.auth.getSession()
  const session = data?.session
  if (session?.user) {
    // session exists; optionally fetch profile and show logged-in UI
    const userId = session.user.id
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single().catch(() => ({}))
    if (profile?.role === 'admin') {
      // optionally show admin nav link, etc.
      console.log('Admin is logged in')
    } else {
      console.log('Customer logged in')
    }
  }
}
setTimeout(checkSessionOnLoad, 800) // wait briefly for client to load
