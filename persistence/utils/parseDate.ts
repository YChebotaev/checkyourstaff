export const parseDate = (dateStr: string) => {
  const dateNum = Number.isNaN(Number(dateStr)) ? undefined : Number(dateStr)

  if (dateNum) {
    return new Date(dateNum)
  }
}
