import db from '@/db'
import { Bucket } from '@/types/interfaces/buckets.interface'
import { File, SearchFileOption } from '@/types/interfaces/files.interface'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import { removeObjects } from '@/utils/minio'
import { FileOptionalInfoDto } from '@/types/dtos/files.dto'

export class FileService {
  async findAllFilesByBucketName (opts: SearchFileOption): Promise<File[]> {
    const { bucketname, originName, isCollected } = opts
    if (isEmpty(bucketname)) throw new HttpError(400, 'bucketName 不能为空')
    const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })
    if (!bucket) throw new HttpError(409, `${bucketname} 不存在`)

    let condition = { where: { bucketId: bucket.id } }

    if (originName) {
      condition = { where: { originName: { contains: originName } } }
    }
    if (isCollected) {
      condition = { where: { isCollected: true } }
    }

    const files: File[] = await db.file.findMany(condition)
    return files
  }

  async updateFile (id: number, fileData: FileOptionalInfoDto) {
    console.log(fileData)
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

    const files = filesData.map(_mapToUploadFile(bucketname, bucketId))

    // const _files: File[] = await db.file.createMany({ data: files, skipDuplicates: true })
    //   .catch(async (err) => {
    //     console.error(err)
    //     const filenames = filesData.map(file => file.filename)
    //     await removeObjects(bucketname, filenames)
    //   })

    const _files: File[] = await db.$transaction(
      files.map((file) => db.file.create({ data: file })))
      .catch(async (err) => {
        console.error(err)
        const filenames = filesData.map(file => file.filename)
        await removeObjects(bucketname, filenames)
      })

    return _files
  }

  async removeFiles (bucketname: string, filenames: string[]): Promise<File[]> {
    if (isEmpty(bucketname) || isEmpty(filenames)) throw new HttpError(400, 'bucketName和filenames都不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })
    if (!_bucket) throw new HttpError(409, `${bucketname} 不存在`)

    const dbPms = db.file.deleteMany({ where: { filename: { in: filenames } } })
    const mnPms = removeObjects(bucketname, filenames)
    const [result] = await Promise.all([dbPms, mnPms])
    console.log(result)
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
