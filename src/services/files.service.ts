import db from '@/db'
import { Bucket } from '@/types/interfaces/buckets.interface'
import { File, SearchFileOption } from '@/types/interfaces/files.interface'
import { isEmpty, generateFilename } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import { removeObjects, putObject, removeObject } from '@/utils/minio'
import { convertToWebpOrAvif } from '@/utils/opImage'
import { FileOptionalInfoDto } from '@/types/dtos/files.dto'
import path from 'path'
import { Media } from '@/types/enums/files.enum'
import { BucketService } from './buckets.service'
import { request } from 'undici'

export class FileService {
  public bucketService: BucketService = new BucketService()

  async findFiles (opts?: SearchFileOption): Promise<File[]> {
    const { bucketname, originName, isCollected, fileType } = opts || {}

    const condition = { where: {} }

    if (bucketname.length) {
      const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })
      if (!bucket) throw new HttpError(409, `${bucketname} 不存在`)
      Object.assign(condition.where, { bucketId: bucket.id })
    }

    if (originName) {
      Object.assign(condition.where, { originName: { contains: originName } })
    }

    if (isCollected) {
      Object.assign(condition.where, { isCollected })
    }

    if (fileType) {
      Object.assign(condition.where, { fileType })
    }

    const files: File[] = await db.file.findMany(condition)

    return files
  }

  async updateFile (id: number, fileData: FileOptionalInfoDto) {
    const file = await db.file.update({ where: { id }, data: fileData })
    return file
  }

  // TODO:原子化操作
  async uploadFileFromUrl (bucketname: string, url: string) {
    const bucket = await this.bucketService.findBucketByName(bucketname)
    const filename = generateFilename()
    const file = {
      filename,
      originName: path.basename(url),
      url: `/${bucketname}/${filename}`,
      fileType: Media.IMAGE,
      bucketId: bucket.id
    }
    const { statusCode, body } = await request(url)

    if (statusCode !== 200) throw new HttpError(400, '网络图片请求失败')

    const data = await convertToWebpOrAvif(body)
    let errMessage = ''
    const uploadPms = putObject(bucketname, filename, data).catch(err => {
      errMessage = err.message
      db.file.delete({ where: { filename } })
    })
    const filePms = db.file.create({ data: file }).catch(err => {
      errMessage = err.message
      removeObject(bucketname, filename)
    })

    const [, img] = await Promise.all([uploadPms, filePms])
    if (errMessage) throw new Error(errMessage)
    return img
  }

  async uploadFiles (bucketname: string, filesData: any): Promise<File[]> {
    if (isEmpty(bucketname) || isEmpty(filesData)) throw new HttpError(400, '传入参数都不能为空......')

    const bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })

    if (!bucket) throw new HttpError(400, '存储桶不存在')

    let errMessage = ''
    const bucketId = bucket.id

    const files = filesData.map(_mapToUploadFile(bucketname, bucketId))

    const _files: File[] = await db.$transaction(
      files.map((file) => db.file.create({ data: file })))
      .catch(async (err) => {
        console.log('error--------------')
        errMessage = err.message
        const filenames = filesData.map(file => file.filename)
        await removeObjects(bucketname, filenames)
      })

    if (errMessage) throw new Error(errMessage)

    return _files
  }

  async removeFiles (bucketname: string, filenames: string[]) {
    if (isEmpty(bucketname) || isEmpty(filenames)) throw new HttpError(400, 'bucketName和filenames都不能为空')

    const _bucket: Bucket = await db.bucket.findFirst({ where: { name: bucketname } })
    if (!_bucket) throw new HttpError(409, `${bucketname} 不存在`)

    let errMessage = ''
    const files: File[] = await db.file.findMany({
      where: { filename: { in: filenames } },
      select: {
        filename: true, originName: true, isCollected: true, url: true, fileType: true, bucketId: true, foodId: true, banners: true
      }
    })

    if (!files.length) throw new Error('文件不存在')

    const result = await db.file.deleteMany({ where: { filename: { in: filenames } } }).then(async (data) => {
      await removeObjects(bucketname, filenames).catch(err => {
        errMessage = err.message
        Promise.all(files.map(({ banners, ...fileData }) => {
          return db.file.create({
            data: {
              ...fileData,
              banners: {
                connect: banners.map(banner => ({ id: banner.id }))
              }
            }
          })
        }))
      })
      return data
    }).catch(err => (errMessage = err.message))

    if (errMessage) throw new Error(errMessage)

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
