import CatchError from '@/decorators/catchError.decorator'
import { validationMiddleware } from '@/middlewares/validation.middleware'
import { ServiceService } from '@/services/services.service'
import { CreateServicesDto } from '@/shared/dtos/services.dto'
import { Service } from '@/shared/interfaces/services.interface'
import { Body, Controller, Delete, Get, Param, Post, Put, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class ServicesController {
  public servicesService = new ServiceService()

  @Get('/services')
  @OpenAPI({ summary: 'Return a list of services' })
  async getServices () {
    const services: Service[] = await this.servicesService.getAll()
    return { data: services, message: 'findAll' }
  }

  @Get('/services/:id')
  @OpenAPI({ summary: 'Return a service' })
  async getService (@Param('id') id: number) {
    const service: Service = await this.servicesService.getOneById(id)
    return { data: service, message: 'getOne' }
  }

  @Post('/services')
  @OpenAPI({ summary: 'Create a service' })
  @UseBefore(validationMiddleware(CreateServicesDto, 'body'))
  async createService (@Body() serviceData: CreateServicesDto) {
    const service: Service = await this.servicesService.create(serviceData)
    return { data: service, message: 'createOne' }
  }

  @Put('/services/:id')
  @OpenAPI({ summary: 'Update a service' })
  @UseBefore(validationMiddleware(CreateServicesDto, 'body', true))
  async updateService (@Param('id') id: number, @Body() serviceData: Partial<CreateServicesDto>) {
    const service: Service = await this.servicesService.update(id, serviceData)
    return { data: service, message: 'updateOne' }
  }

  @Delete('/services/:id')
  @OpenAPI({ summary: 'Delete a service' })
  async deleteService (@Param('id') id: number) {
    const service: Service = await this.servicesService.delete(id)
    return { data: service, message: 'deleteOne' }
  }
}
