declare interface ResData<T> {
  // 接口返回的状态码
  code: number
  // 接口返回的提示信息
  message: string
  // 接口返回的数据
  data: T
}
declare type Nullable<T> = T | null
