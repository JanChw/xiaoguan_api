import { Role } from './role.interface'

export interface Staff {
  name: string;
  password: string;
  phone: string;
  isCopartner?: boolean;
  hireDate?: Date,
  leaveDate?: Date,
  roles?: Role[]
}
