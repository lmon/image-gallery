import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    environmentVariables: {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ Set (length: ' + process.env.ADMIN_PASSWORD.length + ')' : '❌ Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set (length: ' + process.env.NEXTAUTH_SECRET.length + ')' : '❌ Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not set',
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set (starts with: ' + process.env.DATABASE_URL.substring(0, 15) + '...)' : '❌ Not set',
    }
  })
}

