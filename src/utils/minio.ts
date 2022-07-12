import * as Minio from 'minio'
import { Readable } from 'stream'

const mc = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'root',
  secretKey: 'root_123456'
})

export const removeObject = async (bucketname: string, objectname: string, cb: Function) => {
  const result = await mc.removeObject(bucketname, objectname, cb)
  return result
}

export const removeObjects = async (bucketname: string, objectnames: string[]) => {
  const result = mc.removeObjects(bucketname, objectnames)
  return result
}

export const putObject = async (bucketname: string, objectname: string, stream: Readable) => {
  const result = await mc.putObject(bucketname, objectname, stream)
  return result
}
