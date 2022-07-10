import { ServiceService } from '@/services/services.service'
import { Service } from '@/shared/interfaces/services.interface'
import { Controller, Get } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class ServicesController {
  public servicesService = new ServiceService()

  @Get('/services')
  @OpenAPI({ summary: 'Return a list of services' })
  async getServices () {
    const services: Service[] = await this.servicesService.getAll()
    return services
  }
}
