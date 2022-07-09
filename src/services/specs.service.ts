import { CreateSpecDto, UpdateSpecPartialDto } from '@/shared/dtos/specs.dto'
import { HttpException } from '@exceptions/HttpException'
import { Spec } from '@/shared/interfaces/specs.interface'
import { isEmpty } from '@utils/util'
import db from '../db'

class SpecService {
  public async findAllSpecs (): Promise<Spec[]> {
    const specs: Spec[] = await db.spec.findMany()
    return specs
  }

  public async findSpecById (specId: number): Promise<Spec> {
    const findSpec: Spec = await db.spec.findFirst({ where: { id: userId } })
    if (!findSpec) throw new HttpException(409, "You're not spec")

    return findSpec
  }

  public async createSpec (specData: CreateSpecDto): Promise<Spec> {
    if (isEmpty(specData)) throw new HttpException(400, "You're not specData")

    const spec: Spec = await db.spec.create({ data: specData })

    return spec
  }

  public async updateSpec (specId: number, specData: UpdateSpecPartialDto): Promise<Spec[]> {
    if (isEmpty(specData)) throw new HttpException(400, "You're not userData")

    const findSpec: Spec = await db.spec.findUnique({ where: { id: specId } })
    if (!findSpec) throw new HttpException(409, "You're not spec")

    const updateSpecData: Spec[] = await db.spec.update({
      where: { id: specId },
      data: specData
    })

    return updateSpecData
  }

  public async deleteSpec (specId: number): Promise<Spec[]> {
    const findSpec: Spec = await db.spec.findFirst({ where: { id: specId } })
    if (!findSpec) throw new HttpException(409, "You're not user")

    const deleteSpecData: Spec[] = await db.spec.delete({ where: { id: specId } })
    return deleteSpecData
  }
}

export default SpecService
