import { Decimal } from '@prisma/client/runtime'

export const transformDecimalsToNumber = (obj: any) => {
  if (!obj) {
    return
  }

  for (const key of Object.keys(obj)) {
    if (Decimal.isDecimal(obj[key])) {
      obj[key] = obj[key].toNumber()
    } else if (typeof obj[key] === 'object') {
      transformDecimalsToNumber(obj[key])
    }
  }
}
