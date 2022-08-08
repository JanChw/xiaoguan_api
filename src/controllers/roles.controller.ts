import { RoleService } from '@/services/roles.service'
import { RoleDto } from '@/types/dtos/roles.dto'
import { Role } from '@/types/interfaces/roles.interface'
import { Body, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

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
  @OpenAPI({ summary: 'return a role' })
  async getRoleById (@Param('id') id: number) {
    const data: Role = await this.roleService.getOneById(id)
    return { data, message: 'get a role' }
  }

  @Post('/roles')
  @OpenAPI({ summary: 'crate a role' })
  async createRole (@Body() role: RoleDto) {
    const data: Role = await this.roleService.create(role)
    return { data, message: 'create a role' }
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
