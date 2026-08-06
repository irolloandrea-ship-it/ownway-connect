const DOT = '\u2022'

const maskPart = (value: string, keep: number) => {
  if (!value) return ''
  if (value.length <= keep) return value + DOT.repeat(2)
  return value.slice(0, keep) + DOT.repeat(Math.max(2, value.length - keep))
}

/**
 * Masks an email address for safe display, e.g. "anna@example.com" -> "an••@ex•••••.com".
 * Handles short local parts, missing "@", subdomains and empty input gracefully.
 */
export function maskEmail(email?: string | null): string {
  const value = (email ?? '').trim()
  if (!value) return ''

  const at = value.lastIndexOf('@')
  if (at <= 0 || at === value.length - 1) {
    return maskPart(value, Math.min(2, Math.max(1, value.length - 1)))
  }

  const local = value.slice(0, at)
  const domain = value.slice(at + 1)

  const maskedLocal = maskPart(local, local.length <= 2 ? 1 : 2)

  const labels = domain.split('.')
  const tld = labels.length > 1 ? labels.pop()! : ''
  const maskedDomain = labels
    .map((label) => maskPart(label, label.length <= 2 ? 1 : 2))
    .join('.')

  return `${maskedLocal}@${maskedDomain}${tld ? `.${tld}` : ''}`
}
