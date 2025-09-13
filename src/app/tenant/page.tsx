import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import TenantDashboard from '@/components/TenantDashboard'

export default async function TenantPage() {
  const user = await requireAuth()
  
  if (user.role !== 'tenant') {
    throw new Error('Unauthorized access')
  }

  const supabase = await createClient()

  const { data: society } = await supabase
    .from('societies')
    .select('*')
    .eq('id', user.society_id)
    .single()

  if (!society) {
    throw new Error('Society not found')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TenantDashboard user={user} society={society} />
    </div>
  )
}
