import { validationMiddleware } from '@/middlewares/validation.middleware'
import { CategoryService } from '@/services/category.service'
import { CategoryDto } from '@/types/dtos/category.dto'
import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'
import { Category } from '@/types/interfaces/category.interface'
import { ResultWithCount } from '@/types/interfaces/common.interface'
import { Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam, QueryParams, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class CategoryController {
  public categoryService = new CategoryService()

  @Get('/categories')
  @OpenAPI({ summary: 'get a list of category' })
  async getCategories (@QueryParams() queryData: PaginationAndOrderByDto) {
    const data: ResultWithCount = await this.categoryService.getAllWithPagination(queryData)()
    return { data, message: 'get a list of category' }
  }

  @Get('/categories/foods')
  @OpenAPI({ summary: 'get a list of category' })
  async getFoodsByCategory (@QueryParams() queryData: PaginationAndOrderByDto) {
    const data = await this.categoryService.getRelationsBy(queryData)('foods')
    return { data, message: 'get a list of category' }
  }

  @Get('/category/:id/foods')
  @OpenAPI({ summary: 'get a category by id' })
  async getOne (@Param('id') id: number, @QueryParams() queryData: PaginationAndOrderByDto) {
    // const data = await this.categoryService.getFoodsOfCategory(id, queryData)
    const data = await this.categoryService.getRelationsOf(queryData)(id, 'foods')
    return { data, message: 'get a category by id' }
  }

  @Post('/category')
  @OpenAPI({ summary: 'create a new category' })
  @UseBefore(validationMiddleware(CategoryDto, 'body'))
  async createCategory (@Body() category: CategoryDto) {
    const data: Category = await this.categoryService.create(category)
    return { data, message: 'create a new category' }
  }

  @Put('/category/:id')
  @OpenAPI({ summary: 'update a category' })
  @UseBefore(validationMiddleware(CategoryDto, 'body', true))
  async updateCategory (@Body() category: Partial<CategoryDto>) {
    const data: Category = await this.categoryService.update(category)
    return { data, message: 'update a category' }
  }

  @Put('/category/:id/add/foods')
  @OpenAPI({ summary: 'add foods to category' })
  async addFoodsToCategory (@Param('id') id: number, @BodyParam('ids') foodIds: number[]) {
    const data = await this.categoryService.updateRelations({
      op: 'add',
      relation: 'foods',
      relations: foodIds
    })(id)
    return { data, message: 'add foods to category' }
  }

  @Put('/category/:id/remove/foods')
  @OpenAPI({ summary: 'add foods to category' })
  async removeFoodsToCategory (@Param('id') id: number, @BodyParam('ids') foodIds: number[]) {
    const data = await this.categoryService.updateRelations({
      op: 'remove',
      relation: 'foods',
      relations: foodIds
    })(id)
    return { data, message: 'remove foods to category' }
  }

  @Delete('/cotegory/:id')
  @OpenAPI({ summary: 'delete a category ' })
  async removeCategory (@Param('id') id: number) {
    const data: Category = await this.categoryService.delete(id)
    return { data, message: 'delete a category' }
  }

  @Delete('/cotegories')
  @OpenAPI({ summary: 'delete a category ' })
  async removeCategories (@BodyParam('ids') ids: number[]) {
    const data: Category[] = await this.categoryService.deletes(ids)
    return { data, message: 'delete a category' }
  }
}
