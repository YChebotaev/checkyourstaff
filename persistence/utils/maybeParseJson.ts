export const maybeParseJson = <T>(inp: string | object) => {
  if (typeof inp === 'object') {
    return inp as T
  } else
    if (typeof inp === 'string') {
      return JSON.parse(inp) as T
    }
}
