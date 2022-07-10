import { validationMiddleware } from '@/middlewares/validation.middleware'
import { FileService } from '@/services/files.service'
import { CreateFileDto } from '@/shared/dtos/files.dto'
import { File } from '@/shared/interfaces/files.interface'
import { Controller, Delete, Get, HttpCode, Param, Post, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

@Controller()
export class FilesController {
  public fileService: FileService = new FileService()

  @Get('/files/:bucketName')
  @OpenAPI({ summary: 'Return a list of files' })
  async findFilesWithBucket (@Param('bucketName') bucketName: string) {
    const files: File[] = await this.fileService.findAllFilesByBucketName(bucketName)
    return { data: files, message: 'find files' }
  }

  @Post('/files/:bucketName')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateFileDto, 'body'))
  @OpenAPI({ summary: 'Upload many files' })
  async uploadFilesWithBucket (@Param('bucketName') bucketName: string, files: CreateFileDto[]) {
    const _files: File[] = await this.fileService.uploadFiles(bucketName, files)
    return { data: _files, message: 'upload files' }
  }

  @Delete('/files/:bucketName')
  @OpenAPI({ summary: 'Delete many files' })
  async removeFilesWithBucket (@Param('bucketName') bucketName: string, fileIds: number[]) {
    const files: File[] = await this.fileService.removeFiles(bucketName, fileIds)
    return { data: files, message: 'remove files' }
  }
}
