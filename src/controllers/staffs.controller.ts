import { StaffService } from '@/services/staffs.service'
import { StaffDto } from '@/types/dtos/staffs.dto'
import { Staff } from '@/types/interfaces/staffs.interface'
import { Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class StaffsController {
  public staffService: StaffService = new StaffService()

  @Get('/staffs')
  @OpenAPI({ summary: 'return a list of all staffs' })
  async getAllStaffs () {
    const data: Staff[] = await this.staffService.getAll()
    return { data, message: 'get all staffs' }
  }

  @Get('/staffs/company')
  @OpenAPI({ summary: 'return a list of company staffs' })
  async getStaffs () {
    const data: Staff[] = await this.getAll({ where: { isCopartner: false } })
    return { data, message: 'get company staffs ' }
  }

  @Get('/staffs/copartner')
  @OpenAPI({ summary: 'return a list of company staffs' })
  async getCopartners () {
    const data: Staff[] = await this.getAll({ where: { isCopartner: true } })
    return { data, message: 'get all copartners' }
  }

  @Get('/staffs/:id')
  @OpenAPI({ summary: 'return a staff' })
  async getStaffWithRoles (@Param('id') id: number) {
    const data: Staff = await this.staffService.getOneWithRelations(id)
    return { data, message: 'get a staff' }
  }

  @Post('/staffs/create')
  @OpenAPI({ summary: 'create a staff' })
  async createStaff (@Body() staff: StaffDto) {
    const data: Staff = await this.staffService.createStaff(staff)
    return { data, message: 'create a staff' }
  }

  @Put('/staffs/:id/roles')
  @OpenAPI({ summary: 'add or remove roles for staff with type query parameter' })
  async addRolesToStaff (@BodyParam('ids') roleIds: number[], @Param('id') staffId: number, @QueryParam('type') op: 'add' | 'remove') {
    const data = await this.staffService.opRolesToStaff(roleIds, staffId, op)
    return { data, message: 'add or remove roles from staff' }
  }

  @Put('/staffs/:id')
  @OpenAPI({ summary: 'update a staff' })
  async updateStaff (@Body() staff: StaffDto, @Param('id') id: number) {
    const data: Staff = await this.staffService.update(id, staff)
    return { data, message: 'update a staff' }
  }

  @Delete('/staffs/:id')
  @OpenAPI({ summary: 'delete a staff' })
  async deleteStaff (@Param('id') id: number) {
    const data: Staff = await this.staffService.delete(id)
    return { data, message: 'delete a staff' }
  }

  @Delete('/staffs/:id')
  @OpenAPI({ summary: 'delete a staff' })
  async deleteStaffs (@BodyParam('ids') ids: number[]) {
    const data: Staff[] = await this.staffService.deletes(ids)
    return { data, message: 'delete some staffs' }
  }
}
