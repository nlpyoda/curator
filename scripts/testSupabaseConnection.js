// Test Supabase database connection
import { PrismaClient } from '@prisma/client';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase database connection...\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('1. Attempting to connect to Supabase...');
    
    // Test connection with a simple query
    await prisma.$connect();
    console.log('   ✅ Connection established');
    
    // Test a simple query
    console.log('2. Testing database query...');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('   ✅ Query successful:', result);
    
    console.log('\n✅ Supabase connection test passed!');
    
  } catch (error) {
    console.error('\n❌ Supabase connection test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🔍 Troubleshooting steps:');
      console.log('1. Check if Supabase project is paused (free tier auto-pauses after inactivity)');
      console.log('2. Verify the connection string is correct');
      console.log('3. Check if the password contains special characters that need URL encoding');
      console.log('4. Ensure the project is running in Supabase dashboard');
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testSupabaseConnection();