export interface Address {
  address: string
  isDefault?: boolean
}

export interface SearchAddressOptions {
  address: string
  page?: number | string,
  size?: number | string
}
