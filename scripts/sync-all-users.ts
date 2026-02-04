import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import { config } from 'dotenv';
import ws from 'ws';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not found');
}

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  throw new Error('CLERK_SECRET_KEY not found in environment variables');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function syncAllUsers() {
  try {
    console.log('🔄 Starting user sync from Clerk to Prisma...\n');

    // Get all users from Clerk using REST API
    const response = await fetch('https://api.clerk.com/v1/users?limit=500', {
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Clerk API error: ${response.status} ${response.statusText}`);
    }

    const clerkUsers = await response.json();
    const userCount = clerkUsers.length || 0;

    console.log(`📊 Found ${userCount} users in Clerk\n`);

    let syncedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const clerkUser of clerkUsers) {
      const userId = clerkUser.id;
      const userEmail = clerkUser.email_addresses?.[0]?.email_address || 
                        clerkUser.emailAddresses?.[0]?.emailAddress || 
                        'no-email@example.com';

      try {
        // Check if user already exists in Prisma
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (existingUser) {
          console.log(`⏭️  Skipped: ${userEmail} (already exists)`);
          skippedCount++;
          continue;
        }

        // Create user in Prisma
        await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            credits: 5, // Give all users 5 free credits
          },
        });

        console.log(`✅ Synced: ${userEmail} (${userId})`);
        syncedCount++;
      } catch (error: any) {
        console.error(`❌ Error syncing ${userEmail}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Sync Summary:');
    console.log(`   Total Clerk users: ${userCount}`);
    console.log(`   ✅ Successfully synced: ${syncedCount}`);
    console.log(`   ⏭️  Already existed: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('\n🎉 Sync complete!');
  } catch (error) {
    console.error('🔥 Fatal error during sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncAllUsers();
