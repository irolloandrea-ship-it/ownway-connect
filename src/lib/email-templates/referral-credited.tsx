import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface ReferralCreditedProps {
  siteUrl?: string
  count?: number
  position?: number
  waitlistUrl?: string
  referralUrl?: string
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

const ReferralCreditedEmail = ({
  siteUrl = SITE_URL_FALLBACK,
  count = 1,
  position = 1,
  waitlistUrl,
  referralUrl,
}: ReferralCreditedProps) => {
  const wl = waitlistUrl ?? `${siteUrl}/wl`
  const sentence = `Your invite was credited. You now have ${count} confirmed invites and are currently #${position}.`

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{sentence}</Preview>
      <Body style={main}>
        <Container style={outer}>
          <Section style={brand}>
            <Text style={brandMark}>OwnWay</Text>
          </Section>

          <Container style={card}>
            <Text style={eyebrow}>Waitlist update</Text>
            <Heading style={h1}>Your invite was credited.</Heading>
            <Text style={lede}>{sentence}</Text>

            <Section style={positionCard}>
              <Text style={positionLabel}>Confirmed invites</Text>
              <Text style={positionNumber}>{count}</Text>
              <Text style={positionMeta}>Currently #{position} on the waitlist</Text>
            </Section>

            <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
              <Button style={button} href={wl}>
                Share your OwnWay invite
              </Button>
            </Section>

            {referralUrl ? (
              <Text style={linkBlock}>
                <Link href={referralUrl} style={linkStyle}>
                  {referralUrl}
                </Link>
              </Text>
            ) : null}
          </Container>

          <Section style={footerWrap}>
            <Text style={footer}>
              You're receiving this waitlist update because you joined the OwnWay
              early access list and opted in to updates.
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

export default ReferralCreditedEmail

export const template = {
  component: ReferralCreditedEmail,
  subject: 'Your OwnWay invite was credited',
  displayName: 'Referral credited (waitlist update)',
  previewData: {
    siteUrl: SITE_URL_FALLBACK,
    count: 2,
    position: 118,
    waitlistUrl: `${SITE_URL_FALLBACK}/wl/ABCDEFG`,
    referralUrl: `${SITE_URL_FALLBACK}/?ref=ABCDEFG`,
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
const lede = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '15px',
  lineHeight: 1.55,
  color: textMuted,
  margin: '0 0 20px',
}
const positionCard = {
  backgroundColor: pageBg,
  border: `1px solid ${border}`,
  borderRadius: '10px',
  padding: '16px 18px',
  textAlign: 'center' as const,
  margin: '4px 0',
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
const linkBlock = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  color: textMuted,
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
  margin: '0 0 4px',
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
