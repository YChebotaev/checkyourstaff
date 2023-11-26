export type StatsResp = {
  '1'?: number
  '2'?: number
  '3'?: number
  d1?: number
  d2?: number
  d3?: number
  c?: number
}

export type ChartsDataResp = {
  t: string
  [key: number]: number
}[]

export type TextFeedbackResp = {
  ss: {
    id: number
    t: string
    a: {
      id: number
      q: string
      f: string
      s: number
    }[]
  }[],
  ff: {
    id: number
    t: string
    tx: string
  }[]
}
