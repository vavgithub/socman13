import { requireAdminOrAbove } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import SocietyDashboard from '@/components/SocietyDashboard'

interface SocietyPageProps {
  params: {
    id: string
  }
}

export default async function SocietyPage({ params }: SocietyPageProps) {
  const user = await requireAdminOrAbove()
  const supabase = await createClient()

  // Verify user has access to this society
  if (user.role !== 'super_admin' && user.society_id !== params.id) {
    throw new Error('Unauthorized access to this society')
  }

  const { data: society } = await supabase
    .from('societies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!society) {
    throw new Error('Society not found')
  }

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('society_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <SocietyDashboard 
        user={user} 
        society={society} 
        users={users || []} 
      />
    </div>
  )
}
