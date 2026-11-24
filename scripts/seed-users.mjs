import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=')
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  {
    email: 'admin@accesspath.demo',
    password: 'AccessPassword123!',
    fullName: 'Chief Access Administrator',
    role: 'admin',
    id: '00000000-0000-0000-0000-000000000004',
  },
  {
    email: 'moderator@accesspath.demo',
    password: 'AccessPassword123!',
    fullName: 'Regional Access Moderator',
    role: 'moderator',
    id: '00000000-0000-0000-0000-000000000003',
  },
  {
    email: 'contributor@accesspath.demo',
    password: 'AccessPassword123!',
    fullName: 'Active Community Contributor',
    role: 'contributor',
    id: '00000000-0000-0000-0000-000000000002',
  },
  {
    email: 'user@accesspath.demo',
    password: 'AccessPassword123!',
    fullName: 'Daily Commuter (Wheelchair User)',
    role: 'user',
    id: '00000000-0000-0000-0000-000000000001',
  },
]

async function seedDemoUsers() {
  console.log('--- Seeding Demo Accounts (Admin, Moderator, Contributor, User) ---')

  for (const user of DEMO_USERS) {
    try {
      // 1. Check if user exists in auth.users
      const { data: existingUser } = await supabase.auth.admin.getUserById(user.id)

      if (!existingUser?.user) {
        console.log(`Creating user: ${user.email} (${user.role})...`)
        const { error: createError } = await supabase.auth.admin.createUser({
          id: user.id,
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.fullName,
            role: user.role,
          },
        })

        if (createError) {
          console.error(`Failed to create ${user.email}:`, createError.message)
        } else {
          console.log(`Successfully created ${user.email}`)
        }
      } else {
        console.log(`User ${user.email} already exists. Updating role & profile...`)
        await supabase.auth.admin.updateUserById(user.id, {
          password: user.password,
          user_metadata: { full_name: user.fullName, role: user.role },
        })
      }

      // 2. Ensure profile table has proper role
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.fullName,
        role: user.role,
        trust_score: user.role === 'admin' ? 100 : user.role === 'moderator' ? 80 : 30,
        preferences: { avoid_stairs: true, max_incline_deg: 8 },
      })
    } catch (err) {
      console.error(`Error processing ${user.email}:`, err)
    }
  }

  console.log('Demo accounts seeded successfully!')
  console.log('Password for all demo accounts: AccessPassword123!')
}

seedDemoUsers()
