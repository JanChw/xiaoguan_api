import db from '@/db'
import { HttpException } from '@/exceptions/HttpException'
import { Bucket } from '@/types/interfaces/bucket.interface'
import { File } from '@/types/interfaces/files.interface'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import { removeObjects } from '@/utils/minio'
import { UpdateFileDto } from '@/types/dtos/files.dto'
import url from 'url'

export class FileService {
  async findAllFilesByBucketName (bucketName: string): Promise<File[]> {
    if (isEmpty(bucketName)) throw new HttpException(400, 'bucketName 不能为空')
    const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketName } })
    if (!bucket) throw new HttpException(409, `${bucketName} 不存在`)

    const files: File[] = await db.file.findMany({ where: { bucketId: bucket.id } })
    return files
  }

  async updateFile (id: number, fileData: UpdateFileDto) {
    const file = await db.file.update({ where: { id }, data: fileData })
    return file
  }

  // TODO:upload from url
  async uploadFileFromUrl (buckname: string, url: string) {
  }

  async uploadFiles (bucketname: string, filesData: any): Promise<File[]> {
    if (isEmpty(bucketname) || isEmpty(filesData)) throw new HttpError(400, '传入参数都不能为空......')

    const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })

    if (!bucket) throw new HttpError(400, '存储桶不存在')

    const bucketId = bucket.id
    console.log(filesData)
    const files = filesData.map(_mapToUploadFile(bucketname, bucketId))

    console.log(files)

    const _files: File[] = await db.file.createMany({ data: files, skipDuplicates: true })
      .catch(async (err) => {
        console.error(err)
        const filenames = filesData.map(file => file.filename)
        await removeObjects(bucketname, filenames)
      })

    return _files
  }

  async removeFiles (bucketname: string, filenames: string[]): Promise<File[]> {
    if (isEmpty(bucketname) && isEmpty(filenames)) throw new HttpException(400, 'bucketName和filenames都不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })
    if (!_bucket) throw new HttpException(409, `${bucketname} 不存在`)

    const dbPms = db.file.deleteMany({ where: { filename: { in: filenames } } })
    const mnPms = removeObjects(bucketname, filenames)
    const [result] = await Promise.all([dbPms, mnPms])
    return result
  }
}

function _mapToUploadFile (bucketName, bucketId) {
  return (file) => {
    const _file = {}

    _file.bucketId = bucketId
    _file.filename = file.filename
    _file.originName = file.originalname
    _file.fileType = file.mimetype.split('/')[0].toUpperCase()
    _file.url = `/${bucketName}/${file.filename}`

    return _file
  }
}
