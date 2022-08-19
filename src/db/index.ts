import { PrismaClient } from '@prisma/client'
import { transformDecimalsToNumber } from './transformDecimalToNumber'

const db = new PrismaClient()

db.$use(async (params, next) => {
  const transformTables = ['food', 'spec', 'service', 'cart', 'order', 'cartItem', 'category']
  // try {
  const result = await next(params)

  if (transformTables.includes(params.model)) {
    transformDecimalsToNumber(result)
  }

  return result
  // } catch (error) {
  //   console.log(error.message)
  // }
})

db.$connect().catch(console.log)

export default db
