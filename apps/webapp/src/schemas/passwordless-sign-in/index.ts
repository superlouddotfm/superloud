import { object, string } from 'zod'

export const passwordlessSignInSchema = object({
  // Basic information
  sign_in_email: string().email(),
})

export default passwordlessSignInSchema
