const SIGNUP_DRAFT_KEY = 'idto_signup_draft'

export type SignupDraft = {
  email?: string
  password?: string
  emailVerified?: boolean
  emailVerificationToken?: string
  mobile?: string
  mobileVerified?: boolean
  businessType?: string
}

export function getSignupDraft(): SignupDraft {
  try {
    const value = window.sessionStorage.getItem(SIGNUP_DRAFT_KEY)
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
}

export function updateSignupDraft(nextDraft: SignupDraft) {
  const current = getSignupDraft()
  window.sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify({ ...current, ...nextDraft }))
}

export function clearSignupDraft() {
  window.sessionStorage.removeItem(SIGNUP_DRAFT_KEY)
}
