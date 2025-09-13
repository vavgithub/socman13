export interface Database {
  public: {
    Tables: {
      societies: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by_super_admin_id: string
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by_super_admin_id: string
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by_super_admin_id?: string
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'super_admin' | 'society_admin' | 'admin' | 'tenant'
          society_id: string | null
          created_by_id: string | null
          first_login_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'super_admin' | 'society_admin' | 'admin' | 'tenant'
          society_id?: string | null
          created_by_id?: string | null
          first_login_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'super_admin' | 'society_admin' | 'admin' | 'tenant'
          society_id?: string | null
          created_by_id?: string | null
          first_login_completed?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Society = Database['public']['Tables']['societies']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type UserRole = User['role']
export type SocietyStatus = Society['status']
