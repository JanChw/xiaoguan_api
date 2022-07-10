import { validationMiddleware } from '@/middlewares/validation.middleware'
import { FileService } from '@/services/files.service'
import { CreateFileDto } from '@/shared/dtos/files.dto'
import { File } from '@/shared/interfaces/files.interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseBefore } from 'routing-controllers'
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

  @Post('/files')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateFileDto, 'body'))
  @OpenAPI({ summary: 'Upload many files' })
  async uploadFilesWithBucket (@Body() files: CreateFileDto[]) {
    console.log('==================')
    console.log(files)
    console.log('-------------------------')
    console.log('==================')
    const _files: File[] = await this.fileService.uploadFiles(files)
    return { data: _files, message: 'upload files' }
  }

  @Delete('/files')
  @OpenAPI({ summary: 'Delete many files' })
  async removeFilesWithBucket (@Body() delsInfo) {
    const { bucketName, fileIds } = delsInfo
    const files: File[] = await this.fileService.removeFiles(bucketName, fileIds)
    return { data: files, message: 'remove files' }
  }
}
