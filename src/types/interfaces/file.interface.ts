import { Media } from '@/types/enums/file.enum'

export interface File {
  filename: string;
  originName: string;
  fileType: Media
  url: string;
}

export interface SearchFileOption {
  bucketname?: string;
  originName?: string;
  isCollected?: boolean;
  fileType?: Media
}

export interface FileQueryOption {
  originName?: string;
  isCollected?: boolean;
  fileType?: Media
}
