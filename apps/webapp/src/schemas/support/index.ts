import { boolean, number, object, string } from 'zod'

/**
 * - Superloud support -
 * Stream super tokens as a display of support
 */

export const supportSchema = object({
  // Basic information
  super_token_amount_per_month: number().positive(),
  super_token_symbol: string(),
  recipient_wallet_address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
})

export default supportSchema
