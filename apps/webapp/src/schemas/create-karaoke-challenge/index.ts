import { boolean, number, object, string } from 'zod'

/**
 * - Superloud karaoke challenge -
 * A challenge is a karaoke competition organized by an artist.
 * The artist can setup a maximum amount of takes possible per participant.
 * A participant can get additional takes for a fee.
 * Entering a challenge can be free or paid.
 * The winner of a challenge can be picked by an audience vote (public vote) or by the artist themselves.
 * A challenge finishes when a winner has been selected.
 * A winner can receive a prize, but this prize can also be sent to a whitelisted charity.
 * A winner can be designated by audience vote.
 * Voters can also receive a % of rewards for voting.
 *
 */

export const createKaraokeChallengeSchema = object({
  // Basic information
  title: string().trim().min(1),
  creator_note: string().trim().min(1),
  number_of_takes: number().positive(),
  additional_take_lock_token_amount: number().positive().optional(),
  additional_take_lock_token_address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  submissions_start_at: string().datetime(),
  submissions_end_at: string().datetime(),

  // The entrance condition for participants
  is_entrance_paid: boolean(),
  is_entrance_limited: boolean(),
  entrance_lock_limited_number_amount: number().positive().optional(),
  entrance_lock_token_amount: number().positive().optional(),
  entrance_lock_token_address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),

  // If the winner is determined by the audience vote
  is_winning_mode_vote: boolean(),
  votes_start_at: string().datetime(),
  votes_end_at: string().datetime(),

  // Voters rewards
  do_voters_get_rewards: boolean(),
  voters_rewards_super_token_address: string().optional(),
  voters_rewards_super_token_amount: number().positive().optional(),

  // Winner rewards
  // -- charity
  is_charity_challenge: boolean(),
  winner_rewards_super_token_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
  winner_rewards_super_token_amount: number().positive(),
})

export default createKaraokeChallengeSchema
