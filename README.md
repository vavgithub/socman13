# Fire Alarm - Society Management System

A comprehensive multi-society management system built with Next.js 14, TypeScript, Supabase, and Shadcn/UI.

## Features

- **Multi-tenant Architecture**: Support for multiple societies with isolated data
- **Role-based Access Control**: Super Admin, Society Admin, Admin, and Tenant roles
- **Authentication**: Secure login with forced password change on first login
- **Society Management**: Create and manage societies with assigned administrators
- **User Management**: Add and manage users within each society
- **Responsive Design**: Modern UI with orange theme using Shadcn/UI components

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom orange theme

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd socman13
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Configure authentication settings in Supabase dashboard

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- **societies**: Stores society information
- **users**: Stores user information with role-based access

### User Roles

- **super_admin**: Platform-level administrator who can create societies
- **society_admin**: Society-level administrator who manages their specific society
- **admin**: Local administrator within a society
- **tenant**: Basic member of a society

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`

4. Deploy!

## Usage

### Creating a Super Admin

1. Access your Supabase dashboard
2. Go to SQL Editor
3. Run the following function to create a super admin:

```sql
SELECT create_super_admin(
  'admin@example.com',
  'Super Admin Name',
  'your_secure_password'
);
```

### User Flow

1. **Super Admin** creates societies and assigns society admins
2. **Society Admin** receives auto-generated credentials via email
3. **Society Admin** logs in and is forced to change password
4. **Society Admin** creates local admins/tenants for their society
5. **All users** receive credentials via email with forced password change

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── change-password/   # First login password change
│   ├── super-admin/       # Super admin dashboard
│   ├── society/[id]/      # Society-specific dashboard
│   ├── tenant/            # Tenant dashboard
│   └── unauthorized/      # Unauthorized access page
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/UI components
│   ├── SuperAdminDashboard.tsx
│   ├── SocietyDashboard.tsx
│   └── TenantDashboard.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client configuration
│   ├── auth.ts          # Authentication utilities
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
    └── database.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.