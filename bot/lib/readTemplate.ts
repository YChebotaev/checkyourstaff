import { readFileSync } from 'fs'
import { compile } from 'handlebars'

export const readTemplate = <Props extends {}>(filename: string) => {
  const templateContent = readFileSync(filename, 'utf-8').trim()

  return compile<Props>(templateContent)
}
