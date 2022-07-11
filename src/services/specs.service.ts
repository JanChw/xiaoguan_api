import { CreateSpecDto, UpdateSpecPartialDto } from '@/shared/dtos/specs.dto'
import { HttpException } from '@exceptions/HttpException'
import { Spec } from '@/shared/interfaces/specs.interface'
import { isEmpty } from '@utils/util'
import db from '../db'
import CRUD from '@/decorators/crud.decorator'

@CRUD('spec')
class SpecService {
}

export default SpecService
