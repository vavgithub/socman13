#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Fire Alarm - Society Management System Setup');
console.log('================================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please copy .env.local.example to .env.local and configure your Supabase credentials.\n');
  process.exit(1);
}

// Read .env.local to check if it's configured
const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('your_supabase_project_url')) {
  console.log('⚠️  .env.local file contains placeholder values!');
  console.log('📝 Please update .env.local with your actual Supabase credentials.\n');
}

console.log('✅ Project setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Set up your Supabase project:');
console.log('   - Create a new project at https://supabase.com');
console.log('   - Run the SQL schema from supabase-schema.sql in your SQL editor');
console.log('   - Configure authentication settings');
console.log('   - Update .env.local with your project credentials');
console.log('\n2. Create your first super admin:');
console.log('   - Access your Supabase SQL editor');
console.log('   - Run: SELECT create_super_admin(\'admin@example.com\', \'Super Admin\', \'your_password\');');
console.log('\n3. Start the development server:');
console.log('   npm run dev');
console.log('\n4. Deploy to Vercel:');
console.log('   - Push to GitHub');
console.log('   - Connect to Vercel');
console.log('   - Set environment variables');
console.log('   - Deploy!');
console.log('\n🎉 Happy coding!');
