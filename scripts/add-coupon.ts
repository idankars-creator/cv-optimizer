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

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function addCoupon(code: string, credits: number) {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code,
        credits: credits,
        isActive: true,
      },
    });

    console.log('✅ Coupon created successfully!');
    console.log(JSON.stringify(coupon, null, 2));
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('❌ Error: Coupon code already exists');
    } else {
      console.error('❌ Error creating coupon:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: Get code and credits from command line arguments
const code = process.argv[2];
const credits = parseInt(process.argv[3]);

if (!code || !credits || isNaN(credits)) {
  console.log('Usage: npx tsx scripts/add-coupon.ts <CODE> <CREDITS>');
  console.log('Example: npx tsx scripts/add-coupon.ts NEWYEAR2026 10');
  process.exit(1);
}

addCoupon(code, credits);
