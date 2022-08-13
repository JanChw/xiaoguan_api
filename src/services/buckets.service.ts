import db from '@/db'
import { Bucket } from '@/types/interfaces/buckets.interface'
import { BucketDto } from '@/types/dtos/buckets.dto'
import { isEmpty } from '@/utils/util'
import { makeBucket, removeBucket } from '@/utils/minio'
import { HttpError, NotFoundError } from 'routing-controllers'
import CRUD from '@/decorators/crud.decorator'

@CRUD('bucket')
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

    if (!bucket) { throw new NotFoundError('bucket not found') }

    return bucket
  }

  public async findBucketById (bucketId: number): Promise<Bucket> {
    const bucket: Bucket = await db.bucket.findFirst({
      where: { id: bucketId }
    })
    return bucket
  }

  public async createBucket (bucketData: BucketDto): Promise<BucketDto> {
    if (isEmpty(bucketData.name)) throw new HttpError(400, 'name参数不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketData.name } })
    if (_bucket) throw new HttpError(409, `${bucketData.name} bucket already exists`)

    const bucketPms = db.bucket.create({ data: bucketData })
    const minioPms = makeBucket(bucketData.name)
    const [bucket] = await Promise.all([bucketPms, minioPms])
    return bucket
  }

  public async deleteBucket (bucketName: string): Promise<Bucket> {
    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketName } })
    if (!_bucket) throw new HttpError(409, `${bucketName} 不存在`)

    const findBucket = await db.bucket.findUnique({ where: { name: bucketName } })
    if (findBucket.isDefault) throw new HttpError(403, '不能删除默认的文件桶')

    const bucketPms = db.bucket.delete({ where: { name: bucketName } })
    const minioPms = removeBucket(bucketName)

    const [bucket] = await Promise.all([bucketPms, minioPms])

    return bucket
  }

  public async setDefaultBucket (bucketName: string): Promise<Bucket> {
    await db.bucket.updateMany({
      where: { isDefault: true },
      data: { isDefault: false }
    })
    const bucket = await db.bucket.update({
      where: { name: bucketName },
      data: { isDefault: true }
    })
    return bucket
  }
}
