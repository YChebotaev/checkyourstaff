export type ChatMetadata = {
  id: number
  tgChatId: number
}

export type PollSession = {
  id: number
  chatMetadataId: number
}

export type PollAnswer = {
  id: number
  pollSessionId: number
}

export type PollFeedback = {
  id: number
  pollSessionId: number
}

export type MessageMetadata = {
  id: number
  tgMessageId: number
}
