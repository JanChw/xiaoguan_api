import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { CreateSpecDto, UpdateSpecPartialDto } from '@/shared/dtos/specs.dto'
import { Spec } from '@/shared/interfaces/specs.interface'
import SpecService from '@services/specs.service'
import { validationMiddleware } from '@middlewares/validation.middleware'

@Controller()
export class SpecsController {
  public specService = new SpecService();

  @Get('/specs')
  @OpenAPI({ summary: 'Return a list of specs' })
  async getSpecs () {
    const findAllSpecsData: Spec[] = await this.specService.findAllSpecs()
    return { data: findAllSpecsData, message: 'findAll' }
  }

  @Get('/specs/:id')
  @OpenAPI({ summary: 'Return find a spec' })
  async getSpecById (@Param('id') userId: number) {
    const spec: Spec = await this.specService.findSpecById(userId)
    return { data: spec, message: 'findOne' }
  }

  @Post('/specs')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateSpecDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createSpec (@Body() specData: CreateSpecDto) {
    const createSpecData: Spec = await this.specService.createSpec(specData)
    return { data: createSpecData, message: 'created' }
  }

  @Put('/specs/:id')
  @UseBefore(validationMiddleware(UpdateSpecPartialDto, 'body', true))
  @OpenAPI({ summary: 'Update a spec' })
  async updateUser (@Param('id') specId: number, @Body() specData: UpdateSpecPartialDto) {
    const updateSpecData: Spec[] = await this.specService.updateSpec(specId, specData)
    return { data: updateSpecData, message: 'updated' }
  }

  @Delete('/specs/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser (@Param('id') specId: number) {
    const deleteSpecData: Spec[] = await this.specService.deleteSpec(specId)
    return { data: deleteSpecData, message: 'deleted' }
  }
}
