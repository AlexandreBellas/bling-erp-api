import {
  IPluralResponse,
  IPluralEntity,
  IPluralError,
  ISingularEntity,
  ISingularError
} from '../interfaces/method'

import Method from '../template/method'
import createError from '../helpers/createError'

export default class Find<IEntityResponse, IInfos> extends Method {
  /**
   * Retrieve one entity from the given endpoint.
   * @protected
   * @access protected
   * @async
   * @param endpoint The entity request endpoint.
   * @param id The entity id.
   * @param params The query params for the request sent by the user.
   * @param raw Boolean value to return either raw data from Bling or beautified processed data.
   * @returns The found entity.
   */
  public async find(
    id: number | string,
    options?: { params?: IInfos; raw?: false }
  ): Promise<IEntityResponse | IEntityResponse[]>

  public async find(
    id: number | string,
    options?: { params?: IInfos; raw: true }
  ): Promise<IPluralResponse<IEntityResponse>>

  public async find (
    id: number | string,
    options?: {
      params?: IInfos
      raw?: boolean
    }
  ): Promise<
    IEntityResponse | IEntityResponse[] | IPluralResponse<IEntityResponse>
  > {
    if (!id) {
      throw createError(
        'The "id" argument must be a number or string.',
        500,
        id,
        'ERR_INCORRECT_ID_ARG'
      )
    }

    const endpoint = this.endpoint || this.singularName

    const response = await this.api.get(`/${endpoint}/${id}/json`, {
      params: options && options.params
    })

    const data = response.data as IPluralResponse<IEntityResponse>
    if (data.retorno.erros) {
      const errReturn = data.retorno as IPluralError
      let errData
      if (options && options.raw) {
        errData = { retorno: errReturn }
      } else {
        // maybe enhance it to include JSON API standards?
        const rawErrData = errReturn.erros as ISingularError[]
        errData = rawErrData.map((err: ISingularError) => err.erro)
      }

      throw createError(
        'Error on find method after request call',
        response.status,
        errData,
        'ERR_FIND_METHOD'
      )
    } else {
      if (options && options.raw) {
        return data
      } else {
        const rawResponse = data.retorno as IPluralEntity<IEntityResponse>
        const rawEntity = rawResponse[
          this.pluralName
        ] as ISingularEntity<IEntityResponse>[]

        if (rawEntity.length === 1) {
          return rawEntity[0][this.singularName]
        } else {
          return rawEntity.map((entity) => entity[this.singularName])
        }
      }
    }
  }
}
