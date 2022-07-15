import { CreateBucketDto } from '@/types/dtos/buckets.dto'
import { BucketService } from '@/services/buckets.service'
import { Bucket } from '@/types/interfaces/buckets.interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { validationMiddleware } from '@/middlewares/validation.middleware'

// TODO: 添加对minio的操作
@Controller()
export class BucketsController {
  public bucketService: BucketService = new BucketService()

  @Get('/buckets')
  @OpenAPI({ summary: 'Return a list of buckets' })
  async getBuckets () {
    const buckets: Bucket[] = await this.bucketService.findAllBuckets()
    return { data: buckets, message: 'findAll' }
  }

  @Get('/buckets/:name')
  @OpenAPI({ summary: 'Retrun find a bucket' })
  async getBucketByName (@Param('name') name: string) {
    const bucket: Bucket = await this.bucketService.findBucketByName(name)
    return { data: bucket, message: 'findOne' }
  }

  @Post('/buckets')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateBucketDto, 'body'))
  @OpenAPI({ summary: 'Create a new bucket' })
  async createBucket (@Body() bucket: CreateBucketDto) {
    const _bucket: Bucket = await this.bucketService.createBucket(bucket)
    return { data: _bucket, message: 'createOne' }
  }

  @Delete('/buckets/:name')
  @OpenAPI({ summary: 'Delete a bucket' })
  async deleteBucket (@Param('name') name: string) {
    const bucket = await this.bucketService.deleteBucket(name)
    return { data: bucket, message: 'deleteOne' }
  }
}
