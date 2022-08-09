import CRUD from '@/decorators/crud.decorator'
import db from '@/db'
import { ResourceType } from '../types/enums/resources.enum'
// import { Resource } from '@/types/interfaces/resources.interface'
// import { ResourceDto } from '@/types/dtos/resources.dto'
@CRUD('resource')
export class ResourceService {
  async getAllPermissions () {
    return await db.resource.findMany({
      where: {
        type: ResourceType.ACTION_BUTTON
      },
      select: { permission: true }
    })
  }
}
