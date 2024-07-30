export const pascalToSentenceCase = (string: string) => string.replace(/[A-Z]/g, (match, offset) => {
  return offset <= 0 ? match : " " + match.toLowerCase()
})