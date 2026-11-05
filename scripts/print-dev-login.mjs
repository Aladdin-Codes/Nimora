import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env.local');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const lines = env.split(/\r?\n/);
const values = {};

for (const raw of lines) {
  const line = raw.trim();
  if (!line || line.startsWith('#') || !line.includes('=')) continue;
  const idx = line.indexOf('=');
  const key = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  values[key] = value;
}

const supabaseUrl = values.NEXT_PUBLIC_SUPABASE_URL || '(not set)';
const devEmail = values.DEV_AUTH_EMAIL || 'dev@nimora.local';
const bypass = values.DEV_AUTH_BYPASS || 'false';
const serviceRole = values.SUPABASE_SERVICE_ROLE_KEY && !values.SUPABASE_SERVICE_ROLE_KEY.startsWith('replace-with-')
  ? 'configured'
  : 'missing';
const publishableKey = values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.startsWith('replace-with-')
  ? 'configured'
  : 'missing';

const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]):54321\/?$/.test(supabaseUrl);
console.log(isLocal ? '\nLocal development login instructions' : '\nHosted Supabase login instructions');
console.log(isLocal ? '====================================' : '======================================');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Dev login bypass: ${bypass}`);
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`Publishable key: ${publishableKey}`);
if (isLocal) {
  console.log(`Server-side service role key: ${serviceRole}`);
  console.log(`Dev email: ${devEmail}`);
  console.log('');
  console.log('1. Start local Supabase (requires Docker or Podman):');
  console.log('   npx supabase start');
  console.log('');
  console.log('2. Run the app and click Dev login at /login:');
  console.log('   npm run dev');
  console.log('');
  console.log('Notes:');
  console.log('- Dev auth is disabled in production.');
  console.log('- Never expose SUPABASE_SERVICE_ROLE_KEY in browser or client code.');
  console.log('- The password is read from .env.local and is never printed.');
} else {
  console.log('');
  console.log('1. In the Supabase dashboard, open this project and go to Authentication → Users.');
  console.log('2. Add a user, set a private password, and confirm the email address.');
  console.log('3. Run the app and sign in at /login with that account:');
  console.log('   npm run dev');
  console.log('');
  console.log('Standard sign-in uses the public publishable key; a service-role key is not needed.');
  console.log('The local Dev login button is unavailable for hosted projects. No Docker is needed.');
}
