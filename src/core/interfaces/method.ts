import {
  AxiosInstance as IAxiosInstance,
  AxiosError as IAxiosError
} from 'axios'

export type IApiInstance = IAxiosInstance
export type IApiError = IAxiosError

export interface ISingularEntity<T> {
  [singular: string]: T
}

export interface IPluralEntity<T> {
  [plural: string]: ISingularEntity<T>[] | ISingularEntity<T>
}

export interface ISingularError {
  erro: {
    cod: string
    msg: string
  }
}

export interface IDeleteError {
  [code: string]: string
}

export interface IPluralError {
  erros: ISingularError[] | IDeleteError
}

export interface IPluralResponse<T> {
  retorno: IPluralEntity<T> | IPluralError
}

export interface ISingularResponse<T> {
  retorno: ISingularEntity<T> | IPluralError
}
