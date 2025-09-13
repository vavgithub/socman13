import { createClient } from '@/lib/supabase/server'
import { User, UserRole } from '@/types/database'
import { redirect } from 'next/navigation'

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return null
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return user
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireRole(requiredRole: UserRole): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== requiredRole) {
    redirect('/unauthorized')
  }
  
  return user
}

export async function requireSuperAdmin(): Promise<User> {
  return requireRole('super_admin')
}

export async function requireSocietyAdmin(): Promise<User> {
  return requireRole('society_admin')
}

export async function requireAdminOrAbove(): Promise<User> {
  const user = await requireAuth()
  
  if (!['super_admin', 'society_admin', 'admin'].includes(user.role)) {
    redirect('/unauthorized')
  }
  
  return user
}

export function getRedirectPath(user: User): string {
  if (!user.first_login_completed) {
    return '/change-password'
  }
  
  switch (user.role) {
    case 'super_admin':
      return '/super-admin'
    case 'society_admin':
    case 'admin':
      return `/society/${user.society_id}`
    case 'tenant':
      return '/tenant'
    default:
      return '/unauthorized'
  }
}
