import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  role: string
  avatar_url: string | null
  bio: string | null
  country: string | null
  is_verified: boolean | null
  created_at: string
  farm_name?: string | null
  total_diagnoses?: number | null
}

interface User {
  id: string
  first_name: string
  last_name: string
  role: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  is_verified: boolean
  farm_name?: string
  farm_size?: number
  primary_crop?: string
  total_diagnoses?: number
  title?: string
  years_experience?: number
  specializations?: string[]
  average_rating?: number
  total_consultations?: number
  consultation_fee?: number
  response_time_minutes?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') // 'all', 'agronomist', 'farmer'
    const search = searchParams.get('search')
    const specialization = searchParams.get('specialization')
    const location = searchParams.get('location')

    // Build the query for profiles
    let query = supabaseAdmin()
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        role,
        avatar_url,
        bio,
        country,
        is_verified,
        created_at
      `)
      .order('created_at', { ascending: false })

    // Filter by role if specified
    if (role && role !== 'all') {
      query = query.eq('role', role)
    }

    // Filter by search term if provided
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    // Note: Location and specialization filtering will be done after fetching role-specific data

    const { data: profiles, error } = await query

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json({ error: 'Failed to fetch profiles', details: error.message }, { status: 500 })
    }

    console.log(`Found ${profiles?.length || 0} profiles for role: ${role}`)

    // Fetch role-specific data for each user
    const transformedUsers: User[] = await Promise.all(
      (profiles as Profile[])?.map(async (profile: Profile) => {
        try {
        const baseUser: User = {
          id: profile.id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          role: profile.role,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          location: profile.country,
          is_verified: profile.is_verified || false,
        }

        if (profile.role === 'farmer') {
          const { data: farmerData, error: farmerError } = await supabaseAdmin()
            .from('farmer_profiles')
            .select('farm_size, farm_location, primary_crop, successful_treatments')
            .eq('id', profile.id)
            .maybeSingle() // Use maybeSingle() instead of single() to handle missing records

          if (farmerError) {
            console.warn('Error fetching farmer profile for', profile.id, farmerError)
          }

          return {
            ...baseUser,
            farm_name: profile.farm_name || 'Farm',
            farm_size: farmerData?.farm_size || 0,
            primary_crop: farmerData?.primary_crop || 'Mixed Crops',
            total_diagnoses: farmerData?.successful_treatments || profile.total_diagnoses || 0,
            location: farmerData?.farm_location || profile.country || 'Unknown',
          } as User
        } else if (profile.role === 'agronomist') {
          const { data: agronomistData, error: agronomistError } = await supabaseAdmin()
            .from('agronomist_profiles')
            .select('title, years_experience, specializations, average_rating, total_consultations, consultation_fee, response_time_minutes')
            .eq('id', profile.id)
            .maybeSingle() // Use maybeSingle() instead of single() to handle missing records

          if (agronomistError) {
            console.warn('Error fetching agronomist profile for', profile.id, agronomistError)
          }

          return {
            ...baseUser,
            title: agronomistData?.title || 'Agronomist',
            years_experience: agronomistData?.years_experience || 0,
            specializations: agronomistData?.specializations || ['General Agriculture'],
            average_rating: agronomistData?.average_rating || 0,
            total_consultations: agronomistData?.total_consultations || 0,
            consultation_fee: agronomistData?.consultation_fee || 0,
            response_time_minutes: agronomistData?.response_time_minutes || 60,
          } as User
        }

        return baseUser
        } catch (profileError) {
          console.error('Error processing profile:', profile.id, profileError)
          // Return basic user data even if role-specific data fails
          return {
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role: profile.role,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            location: profile.country,
            is_verified: profile.is_verified || false,
          } as User
        }
      }) || []
    )

    // Apply additional filters after data transformation
    let filteredUsers = transformedUsers

    // Filter by location if provided
    if (location && location !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.location?.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Filter by specialization if provided (for agronomists)
    if (specialization && specialization !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        if (user.role === 'agronomist' && user.specializations) {
          return user.specializations.some((spec: string) => 
            spec.toLowerCase().includes(specialization.toLowerCase())
          )
        }
        return true
      })
    }

    console.log(`Returning ${filteredUsers.length} filtered users`)
    return NextResponse.json({ users: filteredUsers })

  } catch (error) {
    console.error('Error in networking users API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
