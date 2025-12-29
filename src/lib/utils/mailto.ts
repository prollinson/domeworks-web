const EMAIL = 'hello@domeworks.io'

interface MailtoOptions {
  workflowName?: string
}

export function generateSmbMailto(options: MailtoOptions = {}): string {
  const subject = encodeURIComponent(
    `Automation Sprint — ${options.workflowName || '[workflow name]'}`
  )

  const body = encodeURIComponent(`Business type + team size:

Workflow (start → end):

Bottlenecks (top 3):

Tools (Google/Slack/Microsoft/HubSpot + others):

Volume per week:

Success definition:

Budget band (target $5–15k):

Decision maker involved? (Yes/No):

Timing constraints:`)

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}

export function generateEnterpriseMailto(): string {
  const subject = encodeURIComponent('AI Consulting — scope discussion')

  const body = encodeURIComponent(`Goals:

Constraints (security/compliance):

Stakeholders (dev/IT/security):

Current stack:

Desired engagement model:

Timeline:

NDA required?:`)

  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}
