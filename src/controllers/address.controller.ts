import { AddressService } from '@/services/address.service'
import { Address } from '@/types/interfaces/address.interface'
import { AddressDto, SearchAddressDto } from '@/types/dtos/address.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParams, UseBefore } from 'routing-controllers'
import { validationMiddleware } from '@/middlewares/validation.middleware'
import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class AddressController {
  public addressService = new AddressService()

  @Get('/addresses')
  @OpenAPI({ summary: 'list addresses' })
  async getAddresses (@QueryParams() queryData: PaginationAndOrderByDto) {
    const data = await this.addressService.getAllWithPagination(queryData)()
    return { data, message: 'find address' }
  }

  @Get('/addresses/search')
  @OpenAPI({ summary: 'search address' })
  async searchAddresses (@QueryParams() queryData: SearchAddressDto) {
    const { address, ..._queryData } = queryData
    if (!address.length) return await this.getAddresses(_queryData)

    const findCondition = { where: { address: { contains: address } } }
    const data = await this.addressService.getAllWithPagination(_queryData)(findCondition)
    return { data, message: 'find all' }
  }

  @Post('/address')
  @OpenAPI({ summary: 'create address' })
  @UseBefore(validationMiddleware(AddressDto, 'body'))
  async createAddress (@Body() addressData: AddressDto) {
    const address: Address = await this.addressService.create(addressData)
    return { data: address, message: 'create' }
  }

  @Put('/address/:id')
  @UseBefore(validationMiddleware(AddressDto, 'body', true))
  async updateAddress (@Param('id') id: number, @Body() addressData: Partial<AddressDto>) {
    const address: Address = await this.addressService.update(id, addressData)
    return { data: address, message: 'update one' }
  }

  @Delete('/addresses')
  async deleteAddresses (@Body() ids: number[]) {
    const addresses: Address[] = await this.addressService.deletes(ids)
    return { data: addresses, message: 'delete' }
  }
}
