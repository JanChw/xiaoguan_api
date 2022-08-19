import randomStr from 'randomstring'
import { Format } from '@/utils/constant'
import { join } from 'path'
import fg from 'fast-glob'
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true
  } else if (typeof value !== 'number' && value === '') {
    return true
  } else if (typeof value === 'undefined' || value === undefined) {
    return true
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true
  } else {
    return false
  }
}

export const generateFilename = () : string => {
  return `${randomStr.generate(7)}.${Format.webp}`
}

export function delay (timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}

export async function loadFiles (dir: string, patterns: string[]): Promise<Function[]> {
  const currentDir = join(process.cwd(), dir)
  const files = await fg(patterns, { cwd: currentDir })

  const promises = files.map(file => import(join(currentDir, file)))
  const controllersObj = await Promise.all(promises)

  const controllers = Object.values(Object.assign({}, ...controllersObj))

  return controllers
}
