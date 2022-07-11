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
    const specs: Spec[] = await this.specService.getAll()
    return { data: specs, message: 'findAll' }
  }

  @Get('/specs/:id')
  @OpenAPI({ summary: 'Return find a spec' })
  async getSpecById (@Param('id') id: number) {
    const spec: Spec = await this.specService.getOneById(id)
    return { data: spec, message: 'findOne' }
  }

  @Post('/specs')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateSpecDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createSpec (@Body() specData: CreateSpecDto) {
    const spec: Spec = await this.specService.create(specData)
    return { data: spec, message: 'created' }
  }

  @Put('/specs/:id')
  @UseBefore(validationMiddleware(CreateSpecDto, 'body', true))
  @OpenAPI({ summary: 'Update a spec' })
  async updateSpec (@Param('id') id: number, @Body() specData: Partial<CreateSpecDto>) {
    const spec: Spec = await this.specService.update(id, specData)
    return { data: spec, message: 'updated' }
  }

  @Delete('/specs/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser (@Param('id') id: number) {
    const spec: Spec = await this.specService.delete(id)
    return { data: spec, message: 'deleted' }
  }
}
