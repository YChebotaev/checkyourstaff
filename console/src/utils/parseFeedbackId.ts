export const parseFeedbackId = (id: string) => {
  const m = id.match(/(\d+)-(a|f)-(\d+)/);

  if (m) {
    return {
      sessionId: Number(m[1]),
      feedbackType: m[2],
      feedbackId: Number(m[3]),
    };
  }
}
