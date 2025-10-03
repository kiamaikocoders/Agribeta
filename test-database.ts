import { supabase } from './lib/supabaseClient'

/**
 * Test script to verify database connection and RLS policies
 * Run this to debug authentication and profile creation issues
 */

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and RLS policies...\n')
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Database connection failed:', error)
      return
    }
    
    console.log('✅ Database connection successful')
    console.log(`📊 Total profiles in database: ${data || 0}`)
    
    // Test 2: Check auth state
    console.log('\n2. Testing authentication state...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ User is authenticated')
      console.log(`👤 User ID: ${session.user.id}`)
      console.log(`📧 Email: ${session.user.email}`)
    } else {
      console.log('⚠️  No authenticated user found')
    }
    
    // Test 3: Try to query profiles
    console.log('\n3. Testing profiles table access...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)
    
    if (profilesError) {
      console.error('❌ Profiles query failed:', profilesError)
    } else {
      console.log(`✅ Profiles query successful (${profiles?.length || 0} records)`)
    }
    
    // Test 4: Try to query farmer_profiles
    console.log('\n4. Testing farmer_profiles table access...')
    const { data: farmerProfiles, error: farmerError } = await supabase
      .from('farmer_profiles')
      .select('*')
      .limit(5)
    
    if (farmerError) {
      console.error('❌ Farmer profiles query failed:', farmerError)
    } else {
      console.log(`✅ Farmer profiles query successful (${farmerProfiles?.length || 0} records)`)
    }
    
    // Test 5: Try to query agronomist_profiles  
    console.log('\n5. Testing agronomist_profiles table access...')
    const { data: agronomistProfiles, error: agronomistError } = await supabase
      .from('agronomist_profiles')
      .select('*')
      .limit(5)
    
    if (agronomistError) {
      console.error('❌ Agronomist profiles query failed:', agronomistError)
    } else {
      console.log(`✅ Agronomist profiles query successful (${agronomistProfiles?.length || 0} records)`)
    }
    
    // Test 6: Test RLS policies (if authenticated)
    if (session) {
      console.log('\n6. Testing RLS policies with authenticated user...')
      
      // Try to insert a test farmer profile
      const testFarmerData = {
        id: session.user.id,
        farm_size: 1.5,
        farm_location: 'Test Location',
        primary_crop: 'Avocado',
        secondary_crops: ['Tomatoes'],
        planting_season: 'Spring',
        irrigation_type: 'Drip',
        pest_management_method: 'Organic',
        soil_type: 'Clay',
        successful_treatments: 0,
        total_spent: 0
      }
      
      console.log('🧪 Testing farmer profile insert...')
      const { error: insertError } = await supabase
        .from('farmer_profiles')
        .upsert(testFarmerData)
      
      if (insertError) {
        console.error('❌ Farmer profile insert failed:', insertError)
      } else {
        console.log('✅ Farmer profile insert/update successful')
      }
    }
    
    console.log('\n🎉 Database test completed!')
    
  } catch (error) {
    console.error('💥 Unexpected error during testing:', error)
  }
}

// Only run if this script is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testDatabaseConnection()
}

export { testDatabaseConnection }
