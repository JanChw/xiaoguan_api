import db from '@/db'
import { Bucket } from '@/types/interfaces/buckets.interface'
import { CreateBucketDto } from '@/types/dtos/buckets.dto'
import { isEmpty } from '@/utils/util'
import { HttpException } from '@/exceptions/HttpException'
export class BucketService {
  public async findAllBuckets (): Promise<Bucket[]> {
    const buckets: Bucket[] = await db.bucket.findMany()
    return buckets
  }

  // TODO:在minio中添加桶
  public async findBucketByName (bucketName: string): Promise<Bucket> {
    const bucket: Bucket = await db.bucket.findFirst({
      where: { name: bucketName }
    })
    return bucket
  }

  public async findBucketById (bucketId: number): Promise<Bucket> {
    const bucket: Bucket = await db.bucket.findFirst({
      where: { id: bucketId }
    })
    return bucket
  }

  public async createBucket (bucketData: CreateBucketDto): Promise<CreateBucketDto> {
    if (isEmpty(bucketData.name)) throw new HttpException(400, 'name参数不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketData.name } })
    if (_bucket) throw new HttpException(409, `${bucketData.name} bucket already exists`)

    const bucket: Bucket = await db.bucket.create({ data: bucketData })
    return bucket
  }

  public async deleteBucket (bucketName: string): Promise<Bucket[]> {
    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketName } })
    if (!_bucket) throw new HttpException(409, `${bucketName} 不存在`)

    const bucket: Bucket[] = await db.bucket.delete({ where: { name: bucketName } })
    return bucket
  }
}
