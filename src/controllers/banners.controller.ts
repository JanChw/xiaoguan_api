import { validationMiddleware } from '@/middlewares/validation.middleware'
import { BannerService } from '@/services/banners.service'
import { BannerDto } from '@/types/dtos/banners.dto'
import { Banner } from '@/types/interfaces/banners.interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class BannersController {
  public bannerService = new BannerService()

  @Get('/banners')
  @OpenAPI({ summary: 'Return a list of banners' })
  async getAllBanners () {
    const banners: Banner[] = await this.bannerService.getAll({
      include: { imgs: true }
    })
    return banners
  }

  @Get('/banners/:id')
  @OpenAPI({ summary: 'Return a banner' })
  async getBannerById (@Param('id') id: number) {
    const banner: Banner = await this.bannerService.getOneById(id)
    return banner
  }

  @Post('/banners')
  @HttpCode(201)
  @UseBefore(validationMiddleware(BannerDto, 'body'))
  @OpenAPI({ summary: 'Create a banner' })
  async CreateBanner (@Body() bannerData: BannerDto) {
    const result = await this.bannerService.create(bannerData)
    return { data: result, message: 'createOne' }
  }

  @Put('/banners/:id')
  @UseBefore(validationMiddleware(BannerDto, 'body', true))
  @OpenAPI({ summary: 'Update a banner' })
  async updateBanner (@Param('id') id: number, @Body() bannerData: Partial<BannerDto>) {
    const banner: Banner = await this.bannerService.update(id, bannerData)
    return { data: banner, message: 'UpdateOne' }
  }

  @Delete('/banners/:id')
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
