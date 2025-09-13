'use client'

import { useState } from 'react'
import { User, Society } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Building2, Users, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface SuperAdminDashboardProps {
  user: User
  societies: Society[]
}

export default function SuperAdminDashboard({ user, societies: initialSocieties }: SuperAdminDashboardProps) {
  const [societies, setSocieties] = useState(initialSocieties)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signOut } = useAuth()
  const supabase = createClient()

  const [newSociety, setNewSociety] = useState({
    name: '',
    description: '',
    adminEmail: '',
    adminName: ''
  })

  const handleCreateSociety = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create society
      const { data: society, error: societyError } = await supabase
        .from('societies')
        .insert({
          name: newSociety.name,
          description: newSociety.description,
          created_by_super_admin_id: user.id
        })
        .select()
        .single()

      if (societyError) {
        setError(societyError.message)
        return
      }

      // Create society admin user
      const { error: userError } = await supabase
        .from('users')
        .insert({
          email: newSociety.adminEmail,
          name: newSociety.adminName,
          role: 'society_admin',
          society_id: society.id,
          created_by_id: user.id
        })

      if (userError) {
        setError(userError.message)
        return
      }

      // Create auth user for society admin
      const { error: authError } = await supabase.auth.admin.createUser({
        email: newSociety.adminEmail,
        password: 'temp_password_123', // This should be sent via email
        email_confirm: true,
        user_metadata: {
          name: newSociety.adminName
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Update the societies list
      setSocieties([society, ...societies])
      setShowCreateForm(false)
      setNewSociety({ name: '', description: '', adminEmail: '', adminName: '' })

      // TODO: Send email with credentials to society admin
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fire Alarm</h1>
                <p className="text-sm text-gray-500">Super Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Societies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{societies.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Societies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {societies.filter(s => s.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended Societies</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {societies.filter(s => s.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Society Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Society
          </Button>
        </div>

        {/* Societies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Societies</CardTitle>
            <CardDescription>
              Manage all societies in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {societies.map((society) => (
                  <TableRow key={society.id}>
                    <TableCell className="font-medium">{society.name}</TableCell>
                    <TableCell>{society.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(society.status)}>
                        {society.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(society.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Society Dialog */}
        <AlertDialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Society</AlertDialogTitle>
              <AlertDialogDescription>
                Create a new society and assign an admin to manage it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleCreateSociety} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Society Name</Label>
                <Input
                  id="name"
                  value={newSociety.name}
                  onChange={(e) => setNewSociety({ ...newSociety, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSociety.description}
                  onChange={(e) => setNewSociety({ ...newSociety, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={newSociety.adminName}
                  onChange={(e) => setNewSociety({ ...newSociety, adminName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newSociety.adminEmail}
                  onChange={(e) => setNewSociety({ ...newSociety, adminEmail: e.target.value })}
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                    {loading ? 'Creating...' : 'Create Society'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
