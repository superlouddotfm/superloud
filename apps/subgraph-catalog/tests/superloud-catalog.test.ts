import { assert, describe, test, clearStore, beforeAll, afterAll } from 'matchstick-as/assembly/index'
import { Bytes, BigInt, Address } from '@graphprotocol/graph-ts'
import { ListNewKaraokeVersion } from '../generated/schema'
import { ListNewKaraokeVersion as ListNewKaraokeVersionEvent } from '../generated/SuperloudCatalog/SuperloudCatalog'
import { handleListNewKaraokeVersion } from '../src/superloud-catalog'
import { createListNewKaraokeVersionEvent } from './superloud-catalog-utils'

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let id_karaoke_version = Bytes.fromI32(1234567890)
    let created_at = BigInt.fromI32(234)
    let curator_address = Address.fromString('0x0000000000000000000000000000000000000001')
    let id_original_version = 'Example string value'
    let uri_original_version_metadata = 'Example string value'
    let uri_karaoke_version_metadata = 'Example string value'
    let is_indexed = 'boolean Not implemented'
    let newListNewKaraokeVersionEvent = createListNewKaraokeVersionEvent(
      id_karaoke_version,
      created_at,
      curator_address,
      id_original_version,
      uri_original_version_metadata,
      uri_karaoke_version_metadata,
      is_indexed,
    )
    handleListNewKaraokeVersion(newListNewKaraokeVersionEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test('ListNewKaraokeVersion created and stored', () => {
    assert.entityCount('ListNewKaraokeVersion', 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'id_karaoke_version',
      '1234567890',
    )
    assert.fieldEquals('ListNewKaraokeVersion', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1', 'created_at', '234')
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'curator_address',
      '0x0000000000000000000000000000000000000001',
    )
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'id_original_version',
      'Example string value',
    )
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'uri_original_version_metadata',
      'Example string value',
    )
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'uri_karaoke_version_metadata',
      'Example string value',
    )
    assert.fieldEquals(
      'ListNewKaraokeVersion',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'is_indexed',
      'boolean Not implemented',
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
