import { Media } from '@/types/enums/file.enum'

export interface File {
  id?: number;
  filename: string;
  originName: string;
  fileType: Media
  url: string;
}

export interface SearchFileOption {
  bucketname?: string;
  originName?: string;
  isCollected?: boolean;
  fileType?: Media,
  page?: number | string,
  size?: number | string,
  orderby?: string
}

export interface FileQueryOption {
  originName?: string;
  isCollected?: boolean;
  fileType?: Media
}
