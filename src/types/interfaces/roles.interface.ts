import { Staff } from './staffs.interface'
import { Resource } from './resources.interface'

export interface Role {
  name: string; // 英文
  title: string; // 中文
  staffs?: Staff[]
  resources?: Resource[];
}
