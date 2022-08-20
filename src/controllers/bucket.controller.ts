import { BucketDto } from '@/types/dtos/bucket.dto'
import { BucketService } from '@/services/bucket.service'
import { Bucket } from '@/types/interfaces/bucket.interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { validationMiddleware } from '@/middlewares/validation.middleware'
import { ResultWithCount } from '@/types/interfaces/common.interface'

@Controller()
export class BucketsController {
  public bucketService: BucketService = new BucketService()

  @Get('/buckets')
  @OpenAPI({ summary: 'Return a list of buckets' })
  async getBuckets () {
    const data: ResultWithCount = await this.bucketService.getAll()
    return { data, message: 'findAll' }
  }

  @Get('/bucket/default')
  @OpenAPI({ summary: 'Retrun default bucket' })
  async getDefaultBucket () {
    const buckets: Bucket[] = await this.bucketService.getAll({ where: { isDefault: true } })
    if (!buckets.length) throw new Error('未设置默认文件桶')
    return { data: buckets[0], message: 'findOne' }
  }

  @Get('/bucket/:name')
  @OpenAPI({ summary: 'Retrun find a bucket' })
  async getBucketByName (@Param('name') name: string) {
    const bucket: Bucket = await this.bucketService.findBucketByName(name)
    return { data: bucket, message: 'findOne' }
  }

  @Post('/bucket')
  @HttpCode(201)
  @UseBefore(validationMiddleware(BucketDto, 'body'))
  @OpenAPI({ summary: 'Create a new bucket' })
  async createBucket (@Body() bucket: BucketDto) {
    const _bucket: Bucket = await this.bucketService.createBucket(bucket)
    return { data: _bucket, message: 'createOne' }
  }

  @Put('/bucket/:bucketname/default')
  @OpenAPI({ summary: 'set default bucket' })
  async setDefaultBucket (@Param('bucketname') bucketname: string) {
    const bucket = await this.bucketService.setDefaultBucket(bucketname)
    return bucket
  }

  @Delete('/bucket/:name')
  @OpenAPI({ summary: 'Delete a bucket' })
  async deleteBucket (@Param('name') name: string) {
    const bucket = await this.bucketService.deleteBucket(name)
    return { data: bucket, message: 'deleteOne' }
  }
}
