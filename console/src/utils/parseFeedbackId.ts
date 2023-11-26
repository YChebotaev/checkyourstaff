const simpleRegexp = /(\d+)-(a|f)-(\d+)/
const freeFormRegexp = /(\d+)-ff/

export const parseFeedbackId = (id: string) => {
  if (simpleRegexp.test(id)) {
    const m = id.match(simpleRegexp)

    if (m) {
      return {
        sessionId: Number(m[1]),
        feedbackType: m[2],
        feedbackId: Number(m[3]),
      }
    }
  } else
    if (freeFormRegexp.test(id)) {
      const m = id.match(freeFormRegexp)

      if (m) {
        return {
          feedbackType: 'ff',
          feedbackId: m[1]
        }
      }
    }
}
