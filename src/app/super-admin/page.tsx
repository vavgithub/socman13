import { requireSuperAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import SuperAdminDashboard from '@/components/SuperAdminDashboard'

export default async function SuperAdminPage() {
  const user = await requireSuperAdmin()
  const supabase = await createClient()

  const { data: societies } = await supabase
    .from('societies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminDashboard user={user} societies={societies || []} />
    </div>
  )
}
