import { Media } from '@/shared/enums/files.enum'

export interface File {
  filename: string;
  originName: string;
  fileType: Media
  url: string;
}
