import { env } from '@/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma'

export const schema = new URL(env.DATABASE_URL).searchParams.get('schema') || 'public'

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
}, { schema: schema })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
