import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface Props {
  siteUrl?: string
  leaveUrl?: string
}

const SITE_URL_FALLBACK = 'https://ownway.app'

const pageBg = '#FFF6EA'
const cardBg = '#FFFDF8'
const primaryGreen = '#003033'
const textMain = '#0B2425'
const textMuted = '#425B5C'
const border = '#EBD2C2'

const LeaveWaitlistLinkEmail = ({
  siteUrl = SITE_URL_FALLBACK,
  leaveUrl = `${SITE_URL_FALLBACK}/leave-waitlist`,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your link to leave the OwnWay waitlist</Preview>
    <Body style={main}>
      <Container style={outer}>
        <Section style={brand}>
          <Text style={brandMark}>OwnWay</Text>
        </Section>
        <Container style={card}>
          <Heading style={h1}>Leave the OwnWay waitlist</Heading>
          <Text style={lede}>
            You asked for a link to leave the OwnWay waitlist. Opening this link
            does not remove anything on its own — you'll see a confirmation
            screen first.
          </Text>
          <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
            <Button style={button} href={leaveUrl}>
              Open the leave page
            </Button>
          </Section>
          <Text style={helperText}>
            This link is valid for 7 days and works once. If you didn't ask for
            it, you can ignore this email — nothing will change.
          </Text>
        </Container>
        <Section style={footerWrap}>
          <Text style={footer}>
            Sent by OwnWay because someone requested a leave link for this
            address at {siteUrl}.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default LeaveWaitlistLinkEmail

export const template = {
  component: LeaveWaitlistLinkEmail,
  subject: 'Your link to leave the OwnWay waitlist',
  displayName: 'Leave waitlist link',
  previewData: {
    siteUrl: SITE_URL_FALLBACK,
    leaveUrl: `${SITE_URL_FALLBACK}/leave-waitlist#t=example-token`,
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
  color: primaryGreen,
  margin: 0,
}
const card = {
  backgroundColor: cardBg,
  border: `1px solid ${border}`,
  borderRadius: '14px',
  padding: '28px 24px',
}
const h1 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '26px',
  lineHeight: 1.15,
  fontWeight: 400 as const,
  color: textMain,
  margin: '0 0 10px',
}
const lede = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '15px',
  lineHeight: 1.55,
  color: textMuted,
  margin: '0 0 20px',
}
const button = {
  backgroundColor: primaryGreen,
  color: '#FFFDF8',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
  fontWeight: 700 as const,
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
  margin: '0 0 8px',
}
const footerWrap = { padding: '18px 8px 4px', textAlign: 'center' as const }
const footer = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '12px',
  lineHeight: 1.5,
  color: textMuted,
  margin: '0 0 6px',
}
