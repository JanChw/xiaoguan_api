import { Staff } from './staff.interface'
import { Resource } from './resource.interface'

export interface Role {
  name: string; // 英文
  title: string; // 中文
  staffs?: Staff[]
  resources?: Resource[];
}
