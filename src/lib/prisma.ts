import { env } from '@/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma'

const databaseUrl = process.env.DATABASE_URL ?? env.DATABASE_URL
export const schema = new URL(databaseUrl).searchParams.get('schema') || 'public'

const adapter = new PrismaPg({
  connectionString: databaseUrl,
}, { schema: schema })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
