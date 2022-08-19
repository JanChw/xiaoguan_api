import { Role } from '../interfaces/role.interface'

export class StaffDto {
  name: string;

  password: string;

  phone: string;

  isCopartner: boolean;

  hireDate?: Date | string;

  leaveDate?: Date | string;

  roles: Role[]
}
