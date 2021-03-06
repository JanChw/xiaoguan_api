import { putObject, removeObject } from '@/utils/minio'
import { convertToWebpOrAvif } from './opImage'
import { BucketService } from '@/services/buckets.service'
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
    if (err) return cb(err)

    const bucket = await bucketService.findBucketByName(bucketname)
    if (!bucket) return cb(new Error('bucket not found'))

    const filename = generateFilename()
    file.filename = filename

    const data = await convertToWebpOrAvif(file.stream)
    const objInfo = await putObject(bucketname, filename, data)
    cb(null, { ...objInfo, filename })
  })
}

MinioStorage.prototype._removeFile = async function _removeFile (req, file, cb) {
  const bucketname = req.params.bucketname
  const bucket = await bucketService.findBucketByName(bucketname)
  if (!bucket) return cb(new Error('bucket not found'))

  await removeObject(bucketname, file.filename, cb)
}

export default function () {
  return new MinioStorage()
}
