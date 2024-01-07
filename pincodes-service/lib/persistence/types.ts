export type PinCode = {
  id: number
  tenantId: number
  generatorId: number
  code: string
  payload: any
  deleted: boolean | null
  createdAt: string
  updatedAt: string | null
}

export type Generator = {
  id: number
  tenantId: number
  size: number
  generatedCount: number
  latestIndex: number
  deleted: boolean | null
  createdAt: string
  updatedAt: string | null
}
