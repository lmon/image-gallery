import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    // Test 1: Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlFormat: process.env.DATABASE_URL 
        ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') // Hide password
        : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    }

    // Test 2: Try to connect and query
    let connectionTest = {
      connected: false,
      error: null as string | null,
      queryResult: null as any,
    }

    try {
      // Simple query to test connection
      const result = await prisma.$queryRaw`SELECT 1 as test, VERSION() as mysql_version, DATABASE() as current_db`
      connectionTest.connected = true
      connectionTest.queryResult = result
    } catch (error: any) {
      connectionTest.connected = false
      connectionTest.error = error.message
    }

    // Test 3: Try to query work table
    let workTableTest = {
      success: false,
      count: 0,
      error: null as string | null,
    }

    try {
      const count = await prisma.work.count()
      workTableTest.success = true
      workTableTest.count = count
    } catch (error: any) {
      workTableTest.success = false
      workTableTest.error = error.message
    }

    await prisma.$disconnect()

    return NextResponse.json({
      status: connectionTest.connected ? 'success' : 'error',
      timestamp: new Date().toISOString(),
      tests: {
        environment: envCheck,
        connection: connectionTest,
        workTable: workTableTest,
      }
    })
  } catch (error: any) {
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      code: error.code,
      meta: error.meta,
    }, { status: 500 })
  }
}

