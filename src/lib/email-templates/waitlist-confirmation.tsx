import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { maskEmail } from './mask-email'
import type { TemplateEntry } from './registry'

interface WaitlistConfirmationProps {
  siteUrl?: string
  email?: string
  position?: number
  referralCode?: string
  referralUrl?: string
  waitlistUrl?: string
  confirmUrl?: string
  needsConfirmation?: boolean
  alreadyIn?: boolean
}


const SITE_URL_FALLBACK = 'https://ownway.app'

// OwnWay palette
const pageBg = '#FFF6EA'
const cardBg = '#FFFDF8'
const primaryGreen = '#003033'
const textMain = '#0B2425'
const textMuted = '#425B5C'
const border = '#EBD2C2'
const coral = '#D96A42'

const WaitlistConfirmationEmail = ({
  siteUrl = SITE_URL_FALLBACK,
  email = 'you@example.com',
  position = 1,
  referralCode = 'ABCDEFG',
  referralUrl,
  waitlistUrl,
  confirmUrl,
  needsConfirmation = false,
  alreadyIn = false,
}: WaitlistConfirmationProps) => {
  const wl = waitlistUrl ?? `${siteUrl}/waitlist/${referralCode}`
  const maskedEmail = maskEmail(email)
  const previewText = needsConfirmation
    ? 'Confirm your email to secure your place on the OwnWay waitlist'
    : alreadyIn
      ? `You're already on the OwnWay waitlist — spot #${position}`
      : `You're on the OwnWay waitlist — spot #${position}`

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={outer}>
          <Section style={brand}>
            <Text style={brandMark}>OwnWay</Text>
          </Section>

          <Container style={card}>
            <Text style={eyebrow}>
              {needsConfirmation ? 'Early access · one step left' : 'Early access · confirmed'}
            </Text>
            <Heading style={h1}>
              {needsConfirmation
                ? 'Confirm your email.'
                : alreadyIn
                  ? "You're already on the list."
                  : "You're on the list."}
            </Heading>
            <Text style={lede}>
              {needsConfirmation
                ? `Confirming secures your place on the OwnWay waitlist. Until then your place isn't reserved.`
                : alreadyIn
                  ? `This email is already on the OwnWay early access list. Your spot and referral link are below.`
                  : `Thanks for joining OwnWay early access. We'll be in touch as soon as your spot opens.`}
            </Text>

            {needsConfirmation && confirmUrl ? (
              <>
                <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
                  <Button style={button} href={confirmUrl}>
                    Confirm and secure my place
                  </Button>
                </Section>
                <Text style={helperText}>
                  This link is valid for 14 days and works once, for{' '}
                  <span style={emailStrong}>{maskedEmail}</span>.
                </Text>
              </>
            ) : (
              <Section style={positionCard}>
                <Text style={positionLabel}>Your waitlist position</Text>
                <Text style={positionNumber}>#{position}</Text>
                <Text style={positionMeta}>
                  Reserved for <span style={emailStrong}>{maskedEmail}</span>
                </Text>
              </Section>
            )}


            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Move up the list
            </Heading>
            <Text style={body}>
              Share your invite link with friends who love to travel. Each new
              friend who joins through your link helps you move up the list.
            </Text>

            <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
              <Button style={button} href={wl}>
                Share your OwnWay invite
              </Button>
            </Section>

            <Text style={helperText}>
              Open your invite page to share or copy your personal link.
            </Text>


            <Text style={body}>
              You can{' '}
              <Link href={wl} style={linkStyle}>
                manage your waitlist
              </Link>{' '}
              anytime to check your position or update your details.
            </Text>
          </Container>

          <Section style={footerWrap}>
            <Text style={footer}>
              You're receiving this email because you joined the OwnWay early
              access list. We only use your email to send OwnWay launch
              updates.
            </Text>
            <Text style={footer}>
              <Link href={`${siteUrl}/privacy`} style={footerLink}>
                Privacy policy
              </Link>
              {'  ·  '}
              <Link href={wl} style={footerLink}>
                Manage your waitlist
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WaitlistConfirmationEmail

export const template = {
  component: WaitlistConfirmationEmail,
  subject: (data: Record<string, any>) =>
    data?.needsConfirmation
      ? 'Confirm your email to secure your OwnWay waitlist place'
      : data?.alreadyIn
      ? `You're already on the OwnWay waitlist — spot #${data?.position ?? ''}`.trim()
      : `You're on the OwnWay waitlist — spot #${data?.position ?? ''}`.trim(),
  displayName: 'Waitlist confirmation',
  previewData: {
    siteUrl: SITE_URL_FALLBACK,
    email: 'anna@example.com',
    position: 128,
    referralCode: 'ABCDEFG',
    referralUrl: `${SITE_URL_FALLBACK}/?ref=ABCDEFG`,
    waitlistUrl: `${SITE_URL_FALLBACK}/waitlist/ABCDEFG`,
    confirmUrl: `${SITE_URL_FALLBACK}/confirm-email?t=example-token`,
    needsConfirmation: true,
    alreadyIn: false,
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: pageBg,
  fontFamily: 'Arial, Helvetica, sans-serif',
  color: textMain,
  margin: 0,
  padding: '24px 12px',
}
const outer = { width: '100%', maxWidth: '600px', margin: '0 auto' }
const brand = { padding: '0 8px 16px', textAlign: 'center' as const }
const brandMark = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '22px',
  fontWeight: 400 as const,
  letterSpacing: '-0.01em',
  color: primaryGreen,
  margin: 0,
}
const card = {
  backgroundColor: cardBg,
  border: `1px solid ${border}`,
  borderRadius: '14px',
  padding: '28px 24px',
}
const eyebrow = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: coral,
  margin: '0 0 10px',
  fontWeight: 700 as const,
}
const h1 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '28px',
  lineHeight: 1.15,
  fontWeight: 400 as const,
  color: textMain,
  margin: '0 0 10px',
  letterSpacing: '-0.01em',
}
const h2 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '20px',
  fontWeight: 400 as const,
  color: textMain,
  margin: '0 0 6px',
}
const lede = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '15px',
  lineHeight: 1.55,
  color: textMuted,
  margin: '0 0 20px',
}
const body = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
  lineHeight: 1.6,
  color: textMuted,
  margin: '0 0 12px',
}
const positionCard = {
  backgroundColor: pageBg,
  border: `1px solid ${border}`,
  borderRadius: '10px',
  padding: '16px 18px',
  textAlign: 'center' as const,
  margin: '4px 0 4px',
}
const positionLabel = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '10px',
  letterSpacing: '0.24em',
  textTransform: 'uppercase' as const,
  color: textMuted,
  margin: '0 0 4px',
  fontWeight: 700 as const,
}
const positionNumber = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '34px',
  lineHeight: 1,
  color: primaryGreen,
  margin: 0,
  letterSpacing: '-0.02em',
}
const positionMeta = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: textMuted,
  margin: '10px 0 0',
}
const emailStrong = { color: textMain, fontWeight: 700 as const }
const hr = {
  borderColor: border,
  borderStyle: 'solid' as const,
  borderWidth: '0 0 1px 0',
  margin: '22px 0',
}
const button = {
  backgroundColor: primaryGreen,
  color: '#FFFDF8',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
  fontWeight: 700 as const,
  letterSpacing: '0.01em',
  borderRadius: '999px',
  padding: '12px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  border: `1px solid ${primaryGreen}`,
}
const helperText = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '13px',
  lineHeight: 1.5,
  color: textMuted,
  textAlign: 'center' as const,
  margin: '0 0 16px',
}
const linkBlock = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: textMuted,
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
  margin: '0 0 16px',
}
const linkStyle = {
  color: coral,
  textDecoration: 'underline',
  fontWeight: 700 as const,
}
const footerWrap = { padding: '18px 8px 4px', textAlign: 'center' as const }
const footer = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  lineHeight: 1.5,
  color: textMuted,
  margin: '0 0 6px',
}
const footerLink = {
  color: textMuted,
  textDecoration: 'underline',
}
