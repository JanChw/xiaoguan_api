import * as Minio from 'minio'

const mc = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'root',
  secretKey: 'root_123456'
})

export const makeBucket = async (bucketname: string) => {
  const isExist = await mc.bucketExists(bucketname)

  if (isExist) { throw new Error(`bucket ${bucketname} already exists`) }

  await mc.makeBucket(bucketname, 'ap-east-1')
}

export const removeBucket = async (bucketname: string) => {
  await mc.removeBucket(bucketname)
}

export const removeObject = async (bucketname: string, objectname: string, cb: Function) => {
  const result = await mc.removeObject(bucketname, objectname)
  return result
}

export const removeObjects = async (bucketname: string, objectnames: string[]) => {
  console.log(bucketname, objectnames)
  const result = mc.removeObjects(bucketname, objectnames)
  return result
}

export const putObject = async (bucketname: string, objectname: string, stream: Readable) => {
  const result = await mc.putObject(bucketname, objectname, stream)
  return result
}
