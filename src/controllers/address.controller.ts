import { AddressService } from '@/services/address.service'
import { Address } from '@/types/interfaces/address.interface'
import { AddressDto } from '@/types/dtos/address.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, UseBefore } from 'routing-controllers'
import { validationMiddleware } from '@/middlewares/validation.middleware'

@Controller()
export class AddressController {
  public addressService = new AddressService()

  @Get('/addresses')
  async getAllAddresses (@QueryParam('address') addressData: string) {
    const addresses: Address[] = await this.addressService.getAddresses(addressData)
    return { data: addresses, message: 'find all' }
  }

  @Post('/address')
  @UseBefore(validationMiddleware(AddressDto, 'body'))
  async createAddress (@Body() addressData: AddressDto) {
    const address: Address = await this.addressService.create(addressData)
    return { data: address, message: 'create' }
  }

  @Put('/address/:id')
  @UseBefore(validationMiddleware(AddressDto, 'body', true))
  async updateAddress (@Param('id') id: number, @Body() addressData: Partial<AddressDto>) {
    const address: Address = await this.addressService.update(addressData)
    return { data: address, message: 'update one' }
  }

  @Delete('/addresses')
  async deleteAddresses (@Body() ids: number[]) {
    const addresses: Address[] = await this.addressService.deletes(ids)
    return { data: addresses, message: 'delete' }
  }
}
