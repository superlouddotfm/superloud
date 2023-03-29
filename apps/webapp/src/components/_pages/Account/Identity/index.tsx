import { useAuthentication } from '~/hooks/useAuthentication'
import { usePolybase } from '~/hooks/usePolybase'
import { v4 as uuid } from 'uuid'
import { addMinutes, getUnixTime } from 'date-fns'

export const Identity = () => {
  const { currentUser } = useAuthentication()
  const { db } = usePolybase()
  return (
    <section class="text-primary-11 text-xs">
      <button onClick={async () => {
        const creator = currentUser()?.address
      const dbCollectionReference = db.collection('ChallengeRules')
      const dbCollectionReference2 = db.collection('ChallengeEntry')
      const cb = await dbCollectionReference.record("a55e7b19-d279-44bc-ac9d-a868e2260bbc").get();
      console.log(cb.data)

      // id, slug, contract, creator, canSubmitEntryFrom, canVoteFrom, challengeFinishesAt, name, notes
     //  const uid = 'a55e7b19-d279-44bc-ac9d-a868e2260bbc'
      const uidEntry1 = '7cad7ba2-13fa-4dc3-bed9-ba40201f9bd6'
      const dc = await dbCollectionReference2.record(uidEntry1).get();
      console.log(dc.data)

      const canVoteFrom = 1680126861
     //  const challenge = dbCollectionReference.record(uid)
      // currentTimestamp: number, voterAddress: string
      await dbCollectionReference2.record(uidEntry1).call('castVote', [canVoteFrom + 2, creator])

      }}>
        TEST
      </button>
      <h3 class="text-primary-12 font-semibold">Logged in as: </h3>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.name}</p>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.email}</p>
      <p class="overflow-hidden text-ellipsis">{currentUser()?.address}</p>
    </section>
  )
}

export default Identity
