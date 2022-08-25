import { putObject, removeObject } from '@/utils/minio'
import { BucketService } from '@/services/bucket.service'
import { generateFilename } from './util'

const bucketService = new BucketService()

function getDestination (req, file, cb) {
  cb(null)
}

function MinioStorage () {
  this.getDestination = getDestination
}

MinioStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  const bucketname = req.params.bucketname
  this.getDestination(req, file, async function (err) {
    try {
      if (err) return cb(req.next(err))

      const bucket = await bucketService.findBucketByName(bucketname)
      if (!bucket) throw new Error('bucket not found')

      const filename = generateFilename()
      file.filename = filename

      // 图片的压缩在浏览器端处理
      // const data = await convertToWebpOrAvif(file.stream)
      const objInfo = await putObject(bucketname, filename, file.stream)
      cb(null, { ...objInfo, filename })
    } catch (error) {
      cb(req.next(new Error(error.message)))
    }
  })
}

MinioStorage.prototype._removeFile = async function _removeFile (req, file, cb) {
  try {
    const bucketname = req.params.bucketname
    const bucket = await bucketService.findBucketByName(bucketname)
    if (!bucket) throw new Error('bucket not found')

    await removeObject(bucketname, file.filename, cb)
  } catch (error) {
    cb(req.next(new Error(error.message)))
  }
}

export default function () {
  return new MinioStorage()
}
