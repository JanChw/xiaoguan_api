import { Staff } from './staffs.interface'

export interface Role {
  role: string;
  staffs?: Staff[]
}
