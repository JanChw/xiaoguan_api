import { PrismaClient } from '@prisma/client'
// import { Decimal } from '@prisma/client/runtime'

// Decimal.prototype.toJSON = function () {
//   return this.toNumber()
// }
const db = new PrismaClient()

db.$connect().catch(err => console.log(err))

export default db
