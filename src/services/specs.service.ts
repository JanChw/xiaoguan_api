import { CreateSpecDto, UpdateSpecPartialDto } from '@/types/dtos/specs.dto'
import { HttpException } from '@exceptions/HttpException'
import { Spec } from '@/types/interfaces/specs.interface'
import { isEmpty } from '@utils/util'
import db from '../db'
import CRUD from '@/decorators/crud.decorator'

@CRUD('spec')
class SpecService {
}

export default SpecService
