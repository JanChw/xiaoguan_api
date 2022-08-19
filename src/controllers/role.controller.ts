import { RoleService } from '@/services/role.service'
import { RoleDto } from '@/types/dtos/role.dto'
import { Resource } from '@/types/interfaces/resource.interface'
import { Role } from '@/types/interfaces/role.interface'
import { Body, BodyParam, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class RoleController {
  public roleService: RoleService = new RoleService()

  @Get('/roles')
  @OpenAPI({ summary: 'Return a list of roles' })
  async getRoles () {
    const data: Role[] = await this.roleService.getAll()
    return { data, message: 'get a list of roles' }
  }

  @Get('/role/:id')
  // @Authorized('role:find')
  @OpenAPI({ summary: 'return a role' })
  async getRoleById (@Param('id') id: number) {
    const data: Role = await this.roleService.getOneById(id)
    return { data, message: 'get a role' }
  }

  @Get('/role/:id/resources')
  @OpenAPI({ summary: 'return a role\'s resources' })
  async getResourcesByRoleID (@Param('id') id: number) {
    const opts = { include: { resources: true } }
    const data: Resource[] = await this.roleService.getOneById(id, opts)
    return { data, message: 'get a role\'s resources' }
  }

  @Post('/role')
  @OpenAPI({ summary: 'crate a role' })
  async createRole (@Body() role: RoleDto) {
    const data: Role = await this.roleService.create(role)
    return { data, message: 'create a role' }
  }

  @Put('/role/:id/add/permissions')
  @OpenAPI({ summary: 'add permissions for a role' })
  async addPermissionsToRole (@BodyParam('ids') permissionIDs: number[], @Param('id') roleId: number) {
    const data = await this.roleService.addPermissionsToRole(permissionIDs, roleId)
    return { data, message: 'add permissions to a role' }
  }

  @Put('/role/:id/remove/permissions')
  @OpenAPI({ summary: 'remove permissions for a role' })
  async removePermissionsToRole (@BodyParam('ids') permissionIDs: number[], @Param('id') roleId: number) {
    const data = await this.roleService.removePermissionsToRole(permissionIDs, roleId)
    return { data, message: 'remove permissions to a role' }
  }

  @Put('/role/:id')
  @OpenAPI({ summary: 'update a role' })
  async updateRole (@Body() role: RoleDto, @Param('id') id: number) {
    const data: Role = await this.roleService.update(id, role)
    return { data, message: 'update a role' }
  }

  @Delete('/role/:id')
  @OpenAPI({ summary: 'delete a role' })
  async deleteRole (@Param('id') id: number) {
    const data: Role = await this.roleService.delete(id)
    return { data, message: 'delete a role' }
  }
}
