import { newMockEvent } from 'matchstick-as'
import { ethereum, Bytes, BigInt, Address } from '@graphprotocol/graph-ts'
import { ListNewKaraokeVersion, UpdateListedKaraokeVersion } from '../generated/SuperloudCatalog/SuperloudCatalog'

export function createListNewKaraokeVersionEvent(
  id_karaoke_version: Bytes,
  created_at: BigInt,
  curator_address: Address,
  id_original_version: string,
  uri_original_version_metadata: string,
  uri_karaoke_version_metadata: string,
  is_indexed: boolean,
): ListNewKaraokeVersion {
  let listNewKaraokeVersionEvent = changetype<ListNewKaraokeVersion>(newMockEvent())

  listNewKaraokeVersionEvent.parameters = new Array()

  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('id_karaoke_version', ethereum.Value.fromFixedBytes(id_karaoke_version)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('created_at', ethereum.Value.fromUnsignedBigInt(created_at)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('curator_address', ethereum.Value.fromAddress(curator_address)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('id_original_version', ethereum.Value.fromString(id_original_version)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('uri_original_version_metadata', ethereum.Value.fromString(uri_original_version_metadata)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('uri_karaoke_version_metadata', ethereum.Value.fromString(uri_karaoke_version_metadata)),
  )
  listNewKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('is_indexed', ethereum.Value.fromBoolean(is_indexed)),
  )

  return listNewKaraokeVersionEvent
}

export function createUpdateListedKaraokeVersionEvent(
  id_karaoke_version: Bytes,
  uri_karaoke_version_metadata: string,
  is_indexed: boolean,
): UpdateListedKaraokeVersion {
  let updateListedKaraokeVersionEvent = changetype<UpdateListedKaraokeVersion>(newMockEvent())

  updateListedKaraokeVersionEvent.parameters = new Array()

  updateListedKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('id_karaoke_version', ethereum.Value.fromFixedBytes(id_karaoke_version)),
  )
  updateListedKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('uri_karaoke_version_metadata', ethereum.Value.fromString(uri_karaoke_version_metadata)),
  )
  updateListedKaraokeVersionEvent.parameters.push(
    new ethereum.EventParam('is_indexed', ethereum.Value.fromBoolean(is_indexed)),
  )

  return updateListedKaraokeVersionEvent
}
