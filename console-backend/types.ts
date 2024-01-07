export type AuthCheckBody = {
  accessToken: string
}

export type AuthCheckData = {
  authenticated: boolean
}

export type AuthSignupBody = {
  name: string
  phone: string
  email: string
  password: string
  passwordConfirm: string
}

export type AuthSignupSuccess = {
  ok: true
  accessToken: string
  refreshToken: string
}

export type AuthSignupFail = {
  error:
    | 'auth-signup-name-empty'
    | 'auth-signup-phone-empty'
    | 'auth-signup-phone-invalid'
    | 'auth-signup-email-empty'
    | 'auth-signup-email-invalid'
    | 'auth-signup-password-mismatch'
    | 'auth-signup-password-empty'
}

export type AuthSignupResult =
  | AuthSignupSuccess
  | AuthSignupFail
