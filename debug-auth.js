// Debug Authentication Issues
// Add this to your browser console on the auth page to debug

async function debugAuth() {
  console.log('🔍 Debugging authentication issues...\n')
  
  // Test 1: Check if user exists in auth.users
  try {
    console.log('1. Testing sign-in with current credentials...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'your-test-email@example.com', // Replace with your test email
      password: 'your-test-password' // Replace with your test password
    })
    
    if (error) {
      console.error('❌ Sign-in error:', error.message)
      console.error('Full error:', error)
      
      if (error.message.includes('Email not confirmed')) {
        console.log('📧 Check your email for verification link')
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('🔑 Email/password combination not found')
      }
    } else {
      console.log('✅ Sign-in successful!')
      console.log('User:', data.user)
    }
  } catch (e) {
    console.error('💥 Unexpected error:', e)
  }
  
  // Test 2: Check what's in the profiles table
  console.log('\n2. Checking profiles table...')
  try {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profileError) {
      console.error('❌ Profile query error:', profileError)
    } else {
      console.log('✅ Profiles found:', profiles?.length || 0)
      console.log('Recent profiles:', profiles?.slice(-3))
    }
  } catch (e) {
    console.error('💥 Profile query failed:', e)
  }
}

// Run the debug function
debugAuth()