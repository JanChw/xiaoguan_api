import CRUD from '@/decorators/crud.decorator'
import db from '@/db'
import { ResourceType } from '../types/enums/resources.enum'
@CRUD('resource')
export class ResourceService {
  async getAllPermissions (): Promise<[]> {
    return await db.resource.find({
      where: {
        type: ResourceType.ACTION_BUTTON
      },
      select: { permission: true }
    })
  }
}
