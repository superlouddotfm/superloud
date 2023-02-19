import { ListNewKaraokeVersion as ListNewKaraokeVersionEvent } from '../generated/SuperloudCatalog/SuperloudCatalog'
import { KaraokeVersion } from '../generated/schema'
import { KaraokeVersionMetadataTemplate } from '../generated/templates'
import { sendEPNSNotification } from './EPNSNotification'

export const subgraphID = 'naomihauret/superloud-catalog-mumbai'
export function handleListNewKaraokeVersion(event: ListNewKaraokeVersionEvent): void {
  let entity = KaraokeVersion.load(event.params.id_karaoke_version)
  // If the entity wasn't indexed already
  if (entity === null) {
    // index on the graph is is_indexed flag is true
    if (event.params.is_indexed) {
      entity = new KaraokeVersion(event.params.id_karaoke_version)
      const metadata_uri = event.params.uri_metadata
      const metadata_ipfs_hash = `${event.params.uri_metadata.replace('ipfs://', '')}`

      KaraokeVersionMetadataTemplate.create(metadata_ipfs_hash)
      entity.id_karaoke_version = event.params.id_karaoke_version
      entity.id_original_version = event.params.id_original_version
      entity.created_at = event.params.created_at
      entity.curator_address = event.params.curator_address
      entity.uri_metadata = metadata_uri
      entity.is_indexed = event.params.is_indexed
      entity.metadata = metadata_ipfs_hash

      entity.save()
    }
  }
}

/*
export function handleUpdateListedKaraokeVersion(event: UpdateListedKaraokeVersionEvent): void {
  let entity = new UpdateListedKaraokeVersion(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.id_karaoke_version = event.params.id_karaoke_version
  entity.uri_metadata = event.params.uri_metadata
  entity.is_indexed = event.params.is_indexed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/
