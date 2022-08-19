import { FileService } from '@/services/file.service'
import { FileOptionalInfoDto, FileRemoteAddressDto } from '@/types/dtos/file.dto'
import { File } from '@/types/interfaces/file.interface'
import { Body, BodyParam, Controller, Delete, Get, HttpCode, HttpError, Param, Post, Put, QueryParams, UploadedFiles, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import MinioStroage from '@/utils/storage'
import { isEmpty } from '@/utils/util'
import { validationMiddleware } from '@/middlewares/validation.middleware'

@Controller()
export class FileController {
  public fileService: FileService = new FileService()

  @Get('/files/:bucketName')
  @OpenAPI({ summary: 'Return a list of files' })
  async findFilesWithBucket (@Param('bucketName') bucketname: string, @QueryParams() query: FileOptionalInfoDto) {
    const files: File[] = await this.fileService.findFiles({ bucketname, ...query })
    return { data: files, message: 'find files' }
  }

  @Put('/file/:id')
  @OpenAPI({ summary: 'Update a file' })
  async updateFileOptionalInfo (@Param('id') id: number, @Body() fileData: FileOptionalInfoDto) {
    const file: File = await this.fileService.updateFile(id, fileData)
    return { data: file, message: 'update a file' }
  }

  @Post('/files/uploads/:bucketname')
  @HttpCode(201)
  @OpenAPI({ summary: 'Upload many files' })
  async uploadFiles (@Param('bucketname') bucketname: string, @UploadedFiles('file', { options: { storage: MinioStroage() } }) filesData: any) {
    if (isEmpty(bucketname)) throw new HttpError(500, '传入参数非法')
    const result = await this.fileService.uploadFiles(bucketname, filesData)
    return { data: result, message: 'upload files' }
  }

  // TODO:upload from url
  @Post('/file/upload/:bucketname/remote')
  @UseBefore(validationMiddleware(FileRemoteAddressDto, 'body'))
  @OpenAPI({ summary: 'Upload a file from url' })
  async uploadFileFromUrl (@Param('bucketname') bucketname: string, @BodyParam('url') url: string) {
    if (isEmpty(bucketname)) throw new HttpError(500, '传入参数非法')
    const file: File = await this.fileService.uploadFileFromUrl(bucketname, url)
    return { data: file, message: 'upload file' }
  }

  @Delete('/files/:bucketname')
  @OpenAPI({ summary: 'Delete many files' })
  async removeFilesWithBucket (@Param('bucketname') bucketname: string, @BodyParam('filenames') filenames: string[]) {
    console.log(bucketname, filenames)
    const files: File[] = await this.fileService.removeFiles(bucketname, filenames)
    return { data: files, message: 'remove files' }
  }
}
