import CRUD, { handlePaginationAndOrderArgs } from '@/decorators/crud.decorator'
import { PaginationAndOrderBy, ResultWithCount } from '@/types/interfaces/common.interface'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import db from '@/db'

@CRUD('banner')
export class BannerService {
  public async search (content: string, args: PaginationAndOrderBy): Promise<ResultWithCount> {
    if (isEmpty(content)) throw new HttpError(400, '参数不能为空')

    const opts = {
      where: {
        name: {
          search: content
        },
        title: {
          search: content
        },
        desc: {
          search: content
        }
      }
    }
    const count = await db.banner.count(opts)
    handlePaginationAndOrderArgs(args, opts)

    const data = await db.banner.findMany(opts)

    return { entities: data, count }
  }
}
