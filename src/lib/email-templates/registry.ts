import type { ComponentType } from 'react'

import { template as leaveWaitlistLinkTemplate } from './leave-waitlist-link'
import { template as referralCreditedTemplate } from './referral-credited'
import { template as waitlistConfirmationTemplate } from './waitlist-confirmation'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'waitlist-confirmation': waitlistConfirmationTemplate,
  'referral-credited': referralCreditedTemplate,
}
