export const SUPERLOUD_CATALOG_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_CATALOG
export const ABI_SUPERLOUD_CATALOG = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'id_karaoke_version',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'created_at',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'curator_address',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'id_original_version',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri_metadata',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'is_indexed',
        type: 'bool',
      },
    ],
    name: 'ListNewKaraokeVersion',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'id_karaoke_version',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri_metadata',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'is_indexed',
        type: 'bool',
      },
    ],
    name: 'UpdateListedKaraokeVersion',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'curator_address_to_songs',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'id_karaoke_version_to_listed_song',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'id_karaoke_version',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'created_at',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'curator',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'id_original_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'uri_metadata',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'is_indexed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'id_original_version_to_karaoke_versions',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'id_original_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'uri_metadata',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'created_at',
        type: 'uint256',
      },
    ],
    name: 'listNewKaraokeVersion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'id_karaoke_version',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'is_indexed',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'uri_metadata_updated',
        type: 'string',
      },
    ],
    name: 'updateKaraokeVersion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllKaraokeVersions',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'id_karaoke_version',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'created_at',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'curator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'id_original_version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri_metadata',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'is_indexed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct SuperloudCatalog.KaraokeVersion[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getIndexedKaraokeVersions',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'id_karaoke_version',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'created_at',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'curator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'id_original_version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri_metadata',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'is_indexed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct SuperloudCatalog.KaraokeVersion[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'curator',
        type: 'address',
      },
    ],
    name: 'getKaraokeVersionsByCurator',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'id_karaoke_version',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'created_at',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'curator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'id_original_version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri_metadata',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'is_indexed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct SuperloudCatalog.KaraokeVersion[]',
        name: 'songs',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'id_original_version',
        type: 'string',
      },
    ],
    name: 'getKaraokeVersionsForOriginalVersion',
    outputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'id_karaoke_version',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'created_at',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'curator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'id_original_version',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri_metadata',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'is_indexed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct SuperloudCatalog.KaraokeVersion[]',
        name: 'indexed_karaoke_versions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'getKaraokeVersionById',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'id_karaoke_version',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'created_at',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'curator',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri_metadata',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'is_indexed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
]
