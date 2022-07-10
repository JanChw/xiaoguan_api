import db from '@/db'
import { HttpException } from '@/exceptions/HttpException'
import { CreateFileDto } from '@/shared/dtos/files.dto'
import { Bucket } from '@/shared/interfaces/bucket.interface'
import { File } from '@/shared/interfaces/files.interface'
import { isEmpty } from '@/utils/util'
// import { File } from '@/shared/interfaces/files.interface'

export class FileService {
  async findAllFilesByBucketName (bucketName: string): Promise<File[]> {
    if (isEmpty(bucketName)) throw new HttpException(400, 'bucketName 不能为空')
    const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketName } })
    if (!bucket) throw new HttpException(409, `${bucketName} 不存在`)

    const files: File[] = await db.file.findMany({ where: { bucketId: bucket.id } })
    return files
  }

  // TODO:上传文件
  async uploadFiles (files: CreateFileDto[]): Promise<File[]> {
    if (isEmpty(files)) throw new HttpException(400, 'bucketName和filenames都不能为空')
    console.log(files)
    const bucketId = files[0].bucketId
    const _bucket: Bucket = await db.bucket.findFirst({ where: { id: bucketId } })
    if (!_bucket) throw new HttpException(409, `${_bucket.name} 不存在`)

    const _files: File[] = await db.file.createMany({ data: files, skipDuplicates: true })

    return _files
  }

  async removeFiles (bucketName: String, fileIds: number[]): Promise<File[]> {
    if (isEmpty(bucketName) && isEmpty(fileIds)) throw new HttpException(400, 'bucketName和filenames都不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketName } })
    if (!_bucket) throw new HttpException(409, `${bucketName} 不存在`)

    const files: File[] = await db.file.deleteMany({ where: { id: { in: fileIds } } })
    return files
  }
}
