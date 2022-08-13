import { File } from './files.interface'

export interface Bucket {
  id?: number;
  name: string;

  isDefault?: boolean;

  files?: File[]
}
