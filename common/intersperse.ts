export const intersperse = <I, S>(arr: I[], sep: S) =>
  arr.flatMap(it => [sep, it]).slice(1)
