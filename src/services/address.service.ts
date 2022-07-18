import CRUD from '@/decorators/crud.decorator'
import db from '@/db'
import { Address } from '@/types/interfaces/address.interface'
import { isEmpty } from '@/utils/util'

@CRUD('address')
export class AddressService {
  async getAddresses (address?: string): Promise<Address[]> {
    const opts = isEmpty(address) ? {} : { where: { address: { contains: address } } }
    const addresses: Address[] = await db.address.findMany(opts)
    return addresses
  }
}
