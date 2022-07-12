import { createParamDecorator } from 'routing-controllers'
import multer from 'multer'
import MinioStorage from '@/utils/storage'
import { generateFilename } from '@utils/util'

export function CustomUploadFiles () {
  return createParamDecorator({
    value: action => {
      const request = action.request
      const response = action.response
      // console.log(request.params)
      const bucketname = request.params.bucketname
      const next = action.next
      // console.log(request.files)
      const handle = multer({ storage: MinioStorage({ bucketname, filename: generateFilename() }) }).array('upload_item', 15)
      handle(request, response, next)
      console.log(request.files)
      return request.files
    }
  })
}
