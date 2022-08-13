import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

db.$connect().catch(console.log)

export default db
