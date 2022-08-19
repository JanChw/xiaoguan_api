import { validationMiddleware } from '@/middlewares/validation.middleware'
import { ServiceService } from '@/services/service.service'
import { CreateServicesDto } from '@/types/dtos/service.dto'
import { Service } from '@/types/interfaces/service.interface'
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

  @Get('/service/:id')
  @OpenAPI({ summary: 'Return a service' })
  async getService (@Param('id') id: number) {
    const service: Service = await this.servicesService.getOneById(id)
    return { data: service, message: 'getOne' }
  }

  @Post('/service')
  @OpenAPI({ summary: 'Create a service' })
  @UseBefore(validationMiddleware(CreateServicesDto, 'body'))
  async createService (@Body() serviceData: CreateServicesDto) {
    const service: Service = await this.servicesService.create(serviceData)
    return { data: service, message: 'createOne' }
  }

  @Put('/service/:id')
  @OpenAPI({ summary: 'Update a service' })
  @UseBefore(validationMiddleware(CreateServicesDto, 'body', true))
  async updateService (@Param('id') id: number, @Body() serviceData: Partial<CreateServicesDto>) {
    const service: Service = await this.servicesService.update(id, serviceData)
    return { data: service, message: 'updateOne' }
  }

  @Delete('/service/:id')
  @OpenAPI({ summary: 'Delete a service' })
  async deleteService (@Param('id') id: number) {
    const service: Service = await this.servicesService.delete(id)
    return { data: service, message: 'deleteOne' }
  }
}
