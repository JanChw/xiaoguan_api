import { File } from './file.interface'

export interface Bucket {
  id?: number;
  name: string;

  isDefault?: boolean;

  files?: File[]
}
