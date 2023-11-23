import type { StatsResp, ChartsDataResp, TextFeedbackResp } from '@checkyourstaff/service/types'

export type StatsLoaderResult = {
  stats: StatsResp
}

export type ChartsLoaderResult = {
  chartsData: ChartsDataResp
}

export type FeedbackLoaderResult = {
  feedbackData: TextFeedbackResp
}
