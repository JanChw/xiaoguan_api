import { validationMiddleware } from '@/middlewares/validation.middleware'
import { BannerService } from '@/services/banner.service'
import { BannerDto } from '@/types/dtos/banner.dto'
import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'
import { Banner } from '@/types/interfaces/banner.interface'
import { ResultWithCount } from '@/types/interfaces/common.interface'
import { Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParams, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class BannersController {
  public bannerService = new BannerService()

  @Get('/banners')
  @OpenAPI({ summary: 'Return a list of banners' })
  async getAllBanners (@QueryParams() queryData: PaginationAndOrderByDto) {
    const data: ResultWithCount = await this.bannerService.getAllWithPagination(queryData)({
      include: { imgs: true }
    })
    return { data, message: 'list banner' }
  }

  @Get('/banner/:id')
  @OpenAPI({ summary: 'Return a banner' })
  async getBannerById (@Param('id') id: number) {
    const data: Banner = await this.bannerService.getOneById(id, {
      include: {
        imgs: {
          select: {
            id: true,
            filename: true,
            url: true,
            bucket: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })
    return { data, message: 'get a banner' }
  }

  // TODO:Test
  @Post('/banner')
  @UseBefore(validationMiddleware(BannerDto, 'body'))
  @OpenAPI({ summary: 'Create a banner' })
  async CreateBanner (@Body() bannerData: BannerDto) {
    const { imgs, ..._bannerData } = bannerData
    const includeImgs = { include: { imgs: true } }

    if (imgs) {
      const createRelationOpts = {
        entity: _bannerData,
        relation: 'imgs',
        relations: imgs
      }
      const data = await this.bannerService.createUniqueWithRelations('name', createRelationOpts, includeImgs)
      return { data, message: 'createOne' }
    }

    const data = await this.bannerService.createWithUnique('name', bannerData, includeImgs)

    return { data, message: 'createOne' }
  }

  @Put('/banner/:id')
  @UseBefore(validationMiddleware(BannerDto, 'body', true))
  @OpenAPI({ summary: 'Update a banner' })
  async updateBanner (@Param('id') id: number, @Body() bannerData: Partial<BannerDto>) {
    const banner: Banner = await this.bannerService.update(id, bannerData)
    return { data: banner, message: 'UpdateOne' }
  }

  @Put('/banner/:id/add/imgs')
  @OpenAPI({ summary: 'add or remove img from banner' })
  async addImagesToBanner (@Param('id') id: number, @BodyParam('imgs') imgIds: number[]) {
    const includeImgs = { include: { imgs: true } }
    const updateRelation = {
      op: 'add',
      relation: 'imgs',
      relations: imgIds

    }
    const data: Banner = await this.bannerService.updateRelations(updateRelation)(id, includeImgs)
    return { data, message: 'add or remove img from banner' }
  }

  @Put('/banner/:id/remove/imgs')
  @OpenAPI({ summary: 'add or remove img from banner' })
  async removeImagesToBanner (@Param('id') id: number, @BodyParam('imgs') imgIds: number[]) {
    const includeImgs = { include: { imgs: true } }
    const updateRelation = {
      op: 'remove',
      relation: 'imgs',
      relations: imgIds

    }
    const data: Banner = await this.bannerService.updateRelations(updateRelation)(id, includeImgs)
    return { data, message: 'add or remove img from banner' }
  }

  @Delete('/banner/:id')
  @OpenAPI({ summary: 'Delete a banner' })
  async deleteBanner (@Param('id') id: number) {
    const banner: Banner = await this.bannerService.delete(id)
    return { data: banner, message: 'DeleteOne' }
  }

  @Delete('/banners')
  @OpenAPI({ summary: 'Delete banners' })
  async deleteBanners (@Body() ids: number[]) {
    const banners: Banner[] = await this.bannerService.deletes(ids)
    return { data: banners, message: 'DeleteMany' }
  }
}
