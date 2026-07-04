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

import type { TemplateEntry } from './registry'

interface WaitlistConfirmationProps {
  siteUrl?: string
  email?: string
  position?: number
  referralCode?: string
  referralUrl?: string
  waitlistUrl?: string
  alreadyIn?: boolean
}

const SITE_URL_FALLBACK = 'https://ownway.app'

const WaitlistConfirmationEmail = ({
  siteUrl = SITE_URL_FALLBACK,
  email = 'you@example.com',
  position = 1,
  referralCode = 'ABCDEFG',
  referralUrl,
  waitlistUrl,
  alreadyIn = false,
}: WaitlistConfirmationProps) => {
  const share = referralUrl ?? `${siteUrl}/?ref=${referralCode}`
  const wl = waitlistUrl ?? `${siteUrl}/waitlist/${referralCode}`
  const previewText = alreadyIn
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
            <Text style={eyebrow}>Early access · confirmed</Text>
            <Heading style={h1}>
              {alreadyIn ? "You're already in." : 'Thank you.'}
            </Heading>
            <Text style={lede}>
              {alreadyIn
                ? 'This email is already on the OwnWay early access queue. Here is your spot and referral link — share it to move up.'
                : 'We have added your email address to the OwnWay early access queue.'}
            </Text>

            {/* iPhone mockup — a taste of what OwnWay feels like */}
            <Section style={phoneWrap}>
              <div style={phoneFrame}>
                <div style={phoneNotch} />
                <div style={phoneScreen}>
                  <div style={statusBar}>
                    <span>OwnWay</span>
                    <span>9:41</span>
                  </div>
                  <div style={chatHeader}>
                    <p style={chatEyebrow}>Before the trip</p>
                    <p style={chatTitle}>Anna plans smarter</p>
                    <p style={chatMeta}>Anna · Marco (WayMaker)</p>
                  </div>
                  <div style={chatBody}>
                    <div style={rowRight}>
                      <div style={bubbleAnna}>
                        <p style={bubbleName}>Anna</p>
                        Going to Capri for 3 days — I want it to feel authentic, not touristy. How should I plan it?
                      </div>
                    </div>
                    <div style={rowLeft}>
                      <div style={bubbleMarco}>
                        <p style={bubbleName}>Marco</p>
                        Take the 8:40 ferry, not the 10:00. You'll arrive before the tours — the island feels completely different.
                      </div>
                    </div>
                    <div style={rowRight}>
                      <div style={bubbleAnna}>
                        <p style={bubbleName}>Anna</p>
                        That's exactly the kind of tip I need.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Text style={phoneCaption}>Your travel person — a real local, just for you.</Text>
            </Section>

            <Section style={positionCard}>
              <Text style={positionNumber}>#{position}</Text>
              <Text style={positionLabel}>on the waitlist</Text>
              <Text style={positionMeta}>
                Reservation held for <span style={emailStrong}>{email}</span>
              </Text>
            </Section>


            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Want priority access?
            </Heading>
            <Text style={body}>
              Move up the waitlist by inviting friends. Each signup through
              your link moves you roughly five places higher.
            </Text>

            <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
              <Button style={button} href={share}>
                Share your invite link
              </Button>
            </Section>

            <Text style={linkBlock}>
              <Link href={share} style={linkStyle}>
                {share}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={body}>
              You can check your position and manage your details anytime from
              your{' '}
              <Link href={wl} style={linkStyle}>
                waitlist page
              </Link>
              .
            </Text>

            <Text style={footer}>
              OwnWay — Travel your way. One right tip can change the whole trip.
            </Text>
          </Container>
        </Container>
      </Body>
    </Html>
  )
}

export default WaitlistConfirmationEmail

export const template = {
  component: WaitlistConfirmationEmail,
  subject: (data: Record<string, any>) =>
    data?.alreadyIn
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
    alreadyIn: false,
  },
} satisfies TemplateEntry

// Landing-inspired palette (oklch → hex approximations)
const cream = '#f7f2e8'
const ink = '#2a231d'
const muted = '#736a60'
const gold = '#c9a86a'
const border = '#e6ddcd'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  color: ink,
  margin: 0,
  padding: '32px 12px',
}
const outer = { width: '100%', maxWidth: '600px', margin: '0 auto' }
const brand = { padding: '0 8px 20px', textAlign: 'center' as const }
const brandMark = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '22px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: ink,
  margin: 0,
}
const card = {
  backgroundColor: cream,
  border: `1px solid ${border}`,
  borderRadius: '20px',
  padding: '40px 32px',
}
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase' as const,
  color: muted,
  margin: '0 0 12px',
}
const h1 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '38px',
  lineHeight: 1.1,
  fontWeight: 400 as const,
  color: ink,
  margin: '0 0 12px',
  letterSpacing: '-0.01em',
}
const h2 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '24px',
  fontWeight: 400 as const,
  color: ink,
  margin: '0 0 8px',
}
const lede = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: muted,
  margin: '0 0 28px',
}
const body = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: muted,
  margin: '0 0 12px',
}
const positionCard = {
  backgroundColor: '#ffffff',
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '28px 20px',
  textAlign: 'center' as const,
  margin: '8px 0 4px',
}
const positionNumber = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '56px',
  lineHeight: 1,
  color: ink,
  margin: 0,
  letterSpacing: '-0.02em',
}
const positionLabel = {
  fontSize: '11px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase' as const,
  color: muted,
  margin: '10px 0 0',
}
const positionMeta = {
  fontSize: '12px',
  color: muted,
  margin: '16px 0 0',
}
const emailStrong = { color: ink, fontWeight: 500 as const }
const hr = {
  borderColor: border,
  borderStyle: 'solid' as const,
  borderWidth: '0 0 1px 0',
  margin: '28px 0',
}
const button = {
  backgroundColor: ink,
  color: cream,
  fontSize: '14px',
  fontWeight: 500 as const,
  letterSpacing: '0.02em',
  borderRadius: '999px',
  padding: '14px 26px',
  textDecoration: 'none',
  display: 'inline-block',
  border: `1px solid ${ink}`,
}
const linkBlock = {
  fontSize: '12px',
  color: muted,
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
  margin: '0 0 4px',
}
const linkStyle = { color: gold, textDecoration: 'underline' }
const footer = {
  fontSize: '12px',
  color: muted,
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
  margin: '24px 0 0',
}
