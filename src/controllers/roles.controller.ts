import { RoleService } from '@/services/roles.service'
import { RoleDto } from '@/types/dtos/roles.dto'
import { Resource } from '@/types/interfaces/resources.interface'
import { Role } from '@/types/interfaces/roles.interface'
import { Authorized, Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

type opPermission = 'add' | 'remove'

@Controller()
export class RolesController {
  public roleService: RoleService = new RoleService()

  @Get('/roles')
  @OpenAPI({ summary: 'Return a list of roles' })
  async getRoles () {
    const data: Role[] = await this.roleService.getAll()
    return { data, message: 'get a list of roles' }
  }

  @Get('/roles/:id')
  @Authorized('role:find')
  @OpenAPI({ summary: 'return a role' })
  async getRoleById (@Param('id') id: number) {
    const data: Role = await this.roleService.getOneById(id)
    return { data, message: 'get a role' }
  }

  @Get('/roles/:id/resources')
  @OpenAPI({ summary: 'return a role\'s resources' })
  async getResourcesByRoleID (@Param('id') id: number) {
    const opts = { include: { resources: true } }
    const data: Resource[] = await this.roleService.getOneById(id, opts)
    return { data, message: 'get a role\'s resources' }
  }

  @Post('/roles')
  @OpenAPI({ summary: 'crate a role' })
  async createRole (@Body() role: RoleDto) {
    const data: Role = await this.roleService.create(role)
    return { data, message: 'create a role' }
  }

  @Put('/roles/:id/permissions')
  @OpenAPI({ summary: 'operate permissions for a role with type query parameters' })
  async addPermissionsToRole (@BodyParam('ids') permissionIDs: number[], @Param('id') roleId: number, @QueryParam('type') op: opPermission) {
    console.log(op)
    const data = await this.roleService.opPermissionsToRole(permissionIDs, roleId, op)
    return { data, message: 'add permissions to a role' }
  }

  @Put('/roles/:id')
  @OpenAPI({ summary: 'update a role' })
  async updateRole (@Body() role: RoleDto, @Param('id') id: number) {
    const data: Role = await this.roleService.update(id, role)
    return { data, message: 'update a role' }
  }

  @Delete('/roles/:id')
  @OpenAPI({ summary: 'delete a role' })
  async deleteRole (@Param('id') id: number) {
    const data: Role = await this.roleService.delete(id)
    return { data, message: 'delete a role' }
  }
}
