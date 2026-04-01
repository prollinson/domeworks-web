const EMAIL = 'piers@domeworks.tech'
const CALENDLY = 'https://fantastical.app/piers/domeworks'

export function getBookCallUrl(): string {
  return CALENDLY
}

export function generateScanMailto(): string {
  const subject = encodeURIComponent('AI Scan — interested')

  const body = encodeURIComponent(`Hi Piers,

I'm interested in the AI Scan for my team.

Company:
Role:
Team size (engineers):
AI tools currently in use:

Best time for a 15-min call:`)

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}

export function generateAssessmentMailto(): string {
  const subject = encodeURIComponent('AI Assessment — interested')

  const body = encodeURIComponent(`Hi Piers,

I'm interested in the AI Infrastructure Assessment.

Company:
Role:
Team size (engineers):
AI tools currently in use:
Biggest challenge with AI adoption:

Best time for a 30-min call:`)

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}

export function generateGeneralMailto(): string {
  const subject = encodeURIComponent('DomeWorks — inquiry')

  const body = encodeURIComponent(`Hi Piers,

`)

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}
