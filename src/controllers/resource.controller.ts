import { AddPermssion } from '@/decorators/permission.decorator'
import { validationMiddleware } from '@/middlewares/validation.middleware'
import { ResourceService } from '@/services/resource.service'
import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'
import { ResourceDto } from '@/types/dtos/resource.dto'
import { Resource } from '@/types/interfaces/resource.interface'
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParams, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { ResourceType } from '../types/enums/resource.enum'

@Controller()
export class ResourceController {
  public resourceService: ResourceService = new ResourceService()

  @Get('/permissions')
  @OpenAPI({ summary: 'get all permissions' })
  async getAllPermissions (@QueryParams() queryData: PaginationAndOrderByDto) {
    const opts = {
      where: { type: ResourceType.ACTION_BUTTON },
      select: { permission: true }
    }
    const data: Array<string> = await this.resourceService.getAllWithPagination(queryData)(opts)
    return { data, message: 'list all permissions' }
  }

  @Get('/resources')
  @OpenAPI({ summary: 'list resources' })
  async getAllResources (@QueryParams() queryData: PaginationAndOrderByDto) {
    const data: Resource[] = await this.resourceService.getAllWithPagination(queryData)()
    return { data, message: 'list resources' }
  }

  @Get('/resource/:id')
  @OpenAPI({ summary: 'get a resources' })
  async getResource (@Param('id') id: number) {
    const data: Resource = await this.resourceService.getOneById(id)
    return { data, message: 'get a resources' }
  }

  @Post('/resource')
  @OpenAPI({ summary: 'register a resource' })
  @UseBefore(validationMiddleware(ResourceDto, 'body'))
  @AddPermssion('添加权限', 'resource:create')
  async createResource (@Body() resData: ResourceDto) {
    // const data: Resource = await this.resourceService.createWithUnique(resData, 'permission')
    const data: Resource = await this.resourceService.create(resData)
    return { data, message: 'register resource' }
  }

  @Put('/resource/:id')
  @OpenAPI({ summary: 'update a resource' })
  @UseBefore(validationMiddleware(ResourceDto, 'body', true))
  async updateRole (@Body() resData: Partial<ResourceDto>, @Param('id') id: number) {
    const data: Resource = this.resourceService.update(id, resData)
    return { data, message: 'update resource' }
  }

  @Delete('/resource/:id')
  @OpenAPI({ summary: 'delete a resource' })
  async deleteResource (@Param('id') id: number) {
    const data: Resource = await this.resourceService.delete(id)
    return { data, message: 'dlelete a resource' }
  }
}
