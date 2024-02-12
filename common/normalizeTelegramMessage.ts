export const normalizeTelegramMessage = (input: string) => {
  const lines = input.trim().split(/\n+/)

  return lines
    .map(line => line.trim())
    .filter(line => line)
    .join('\n')
}
