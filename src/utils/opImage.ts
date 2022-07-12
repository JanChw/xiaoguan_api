import sharp from 'sharp'
import { Format } from '@/utils/constant'
import { Readable } from 'stream'

// TODO:如果图片格式本来是webp或者avif直接跳过
export async function convertToWebpOrAvif (readable: Readable) {
  const { data } = await readable.pipe(sharp())
    .toFormat(Format.webp)
    .toBuffer({ resolveWithObject: true })
  return data
}
