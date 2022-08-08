import { validationMiddleware } from '@/middlewares/validation.middleware'
import { ResourceService } from '@/services/resources.service'
import { ResourceDto } from '@/types/dtos/resources.dto'
import { Body, Controller, Get, Param, Post, Put, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { ResourceType } from '../types/enums/resources.enum'

@Controller()
export class ResourceController {
  public resourceService: ResourceService = new ResourceService()

  @Get('/permissions')
  @OpenAPI({ summary: 'get all permissions' })
  async getAllPermissions () {
    const opts = {
      where: { type: ResourceType.ACTION_BUTTON },
      select: { permission: true }
    }
    const data: Array<string> = await this.resourceService.getAll(opts)
    return { data, message: 'list all permissions' }
  }

  @Get('/resources')
  @OpenAPI({ summary: 'list resources' })
  async getAlResources () {
    const data: Resource[] = await this.resourceService.getAll()
    return { data, message: 'list resources' }
  }

  @Post('/resources')
  @OpenAPI({ summary: 'register a resource' })
  @UseBefore(validationMiddleware(ResourceDto, 'body'))
  async createResource (@Body() resData: ResourceDto) {
    const data: Resource = this.resourceService.create(resData)
    return { data, message: 'register resource' }
  }

  @Put('/resources/:id')
  @OpenAPI({ summary: 'update a resource' })
  @UseBefore(validationMiddleware(ResourceDto, 'body', true))
  async updateRole (@Body() resData: ResourceDto, @Param('id') id: number) {
    const data: Resource = this.resourceService.update(id, resData)
    return { data, message: 'update resource' }
  }

  @Delete('/resources/:id')
  @OpenAPI({ summary: 'delete a resource' })
  async deleteResource (@Param('id') id: number) {
    const data: Resource = await this.resourceService.delete(id)
    return { data, message: 'dlelete a resource' }
  }
}
