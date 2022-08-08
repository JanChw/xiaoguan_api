import { Role } from '../interfaces/roles.interface'

export class StaffDto {
  name: string;

  password: string;

  phone: string;

  isCopartner: boolean;

  hireDate?: Date | string;

  leaveDate?: Date | string;

  roles: Role[]
}
