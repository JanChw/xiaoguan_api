import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

db.$connect().catch(err => console.log(err))

export default db
