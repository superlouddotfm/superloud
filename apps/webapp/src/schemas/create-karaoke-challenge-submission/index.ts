import { number, object, string } from 'zod'

/**
 * - Superloud karaoke challenge submission -
 * Users can participate to a karaoke challenge.
 * They are allowed X amount of takes (decided by the artist that created the challenge), but can only submit a single one.
 * Under the hood, a take is an Unlock membership.
 * When the user starts a take, it automatically "marks" the membership as used.
 * This way, we ensure that users can "cheat" the takes system.
 * Once the participant is satisfied with a take, they pick ONE of their take to submit
 * This take will be uploaded to their web3 storage account (ipfs:// URI)
 * The participant also needs to specify which address will receive the rewards
 * As well as the preferred EVM chain of destination.
 *
 */

export const createKaraokeChallengeSubmissionSchema = object({
  // Basic information
  submission_uri: string().optional(),
  send_rewards_to_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
  send_rewards_to_chain_id: number(),
})

export default createKaraokeChallengeSubmissionSchema
