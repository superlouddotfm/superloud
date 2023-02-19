// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 - Superloud Catalog
 - List songs (by karaoke version id, by original version id, by curator...)
 - Index/unindex songs
*/
contract SuperloudCatalog {
  address private _owner;

  struct KaraokeVersion {
    bytes32 id_karaoke_version;
    uint256 created_at;
    address curator;
    string id_original_version;
    string uri_metadata;
    bool is_indexed;
    bool exists;
  }

  // For a given karaoke version id, returns a song
  mapping(bytes32 => KaraokeVersion) public id_karaoke_version_to_listed_song;

  // For a given original version id, returns songs
  mapping(string => bytes32[]) public id_original_version_to_karaoke_versions;

  // For a given curator Ethereum address, return this curator's listed songs
  mapping(address => bytes32[]) public curator_address_to_songs;

  event ListNewKaraokeVersion(
    bytes32 id_karaoke_version,
    uint256 created_at,
    address curator_address,
    string id_original_version,
    string uri_metadata,
    bool is_indexed
  );

  event UpdateListedKaraokeVersion(bytes32 id_karaoke_version, string uri_metadata, bool is_indexed);

  // Array of all listed songs ids
  bytes32[] private _listed_karaoke_versions_ids;

  // Array of all indexed/public listed songs ids
  bytes32[] private _indexed_listed_karaoke_versions_ids;

  constructor() {
    _owner = msg.sender;
  }

  /**
   * Returns the address of the contract owner
   */
  function owner() public view returns (address) {
    return _owner;
  }

  modifier onlyOwner() {
    require(owner() == msg.sender, 'Only the Superloud managers can use this feature !');
    _;
  }

  /**
   * Return indexed karaoke version id
   */
  function _getIndexedKaraokeVersionId(bytes32 id_karaoke_version, bytes32[] storage list)
    private
    view
    returns (uint256 index)
  {
    for (uint256 i = 0; i < list.length; i++) {
      if (list[i] == id_karaoke_version) {
        return i;
      }
    }
  }

  /*
    List & index a new song in the Superloud karaoke catalog
  */
  function listNewKaraokeVersion(
    string memory id_original_version,
    string memory uri_metadata,
    uint256 created_at
  ) external {
    // Create a unique identifier for the song
    bytes32 id_karaoke_version = keccak256(
      abi.encodePacked(msg.sender, address(this), id_original_version, uri_metadata, created_at)
    );

    // Check is the karaoke version was already listed in the catalog
    require(
      id_karaoke_version_to_listed_song[id_karaoke_version].exists == false,
      'This song was already listed in the catalog.'
    );

    // Index the created karaoke version to the curator_address<>songs mapping
    curator_address_to_songs[msg.sender].push(id_karaoke_version);

    // Index the original version (if it wasn't listed)
    id_original_version_to_karaoke_versions[id_original_version].push(id_karaoke_version);

    // Index the created karaoke version id to the song_id<>song mapping
    _listed_karaoke_versions_ids.push(id_karaoke_version);
    _indexed_listed_karaoke_versions_ids.push(id_karaoke_version);
    // Add our karaoke version on chain !
    id_karaoke_version_to_listed_song[id_karaoke_version] = KaraokeVersion(
      // Id of our newly created karaoke version
      id_karaoke_version,
      // timestamp (epoch time) of when the karaoke version was listed
      created_at,
      // Curator address
      msg.sender,
      // Id of the original version (from Spinamp API)
      id_original_version,
      // URI of the metadata of our karaoke version (eg: ipfs://<cid> ; ar://<arweave-tx-id> ; https://<some-website> etc. etc.)
      // Note: this will be used by The Graph
      // So it's better to host the metadata on IPFS with Infura
      uri_metadata,
      // If the song is indexed or not
      // (indexed song = visible on the front-end ; unindexed songs are not visible on the front-end)
      true,
      // If our song exists or not
      true
    );

    emit ListNewKaraokeVersion(id_karaoke_version, created_at, msg.sender, id_original_version, uri_metadata, true);
  }

  /*
    Unindex a song from the Superloud karaoke catalog
    Only the curator and the contract owner can do that
    KaraokeVersions can't be permanently deleted, as some users might buy access to it
  */
  function updateKaraokeVersion(
    bytes32 id_karaoke_version,
    bool is_indexed,
    string memory uri_metadata_updated
  ) external {
    require(
      msg.sender == owner() || msg.sender == id_karaoke_version_to_listed_song[id_karaoke_version].curator,
      'Only the Superloud managers or the curator of this song can unindex it!'
    );
    KaraokeVersion storage song_to_update = id_karaoke_version_to_listed_song[id_karaoke_version];

    // If the visibility value of the song was updated
    if (song_to_update.is_indexed != is_indexed) {
      id_karaoke_version_to_listed_song[id_karaoke_version].is_indexed = is_indexed;
      // Update our managed visibility indexer
      if (is_indexed == true) {
        _indexed_listed_karaoke_versions_ids.push(id_karaoke_version);
      } else {
        _indexed_listed_karaoke_versions_ids[
          _getIndexedKaraokeVersionId(id_karaoke_version, _indexed_listed_karaoke_versions_ids)
        ] = _indexed_listed_karaoke_versions_ids[_indexed_listed_karaoke_versions_ids.length - 1];
        _indexed_listed_karaoke_versions_ids.pop();
      }
    }

    // If metadata uri of the karaoke version
    if (keccak256(abi.encodePacked(song_to_update.uri_metadata)) != keccak256(abi.encodePacked(uri_metadata_updated))) {
      id_karaoke_version_to_listed_song[id_karaoke_version].uri_metadata = uri_metadata_updated;
    }
    KaraokeVersion storage updated_song = id_karaoke_version_to_listed_song[id_karaoke_version];
    emit UpdateListedKaraokeVersion(id_karaoke_version, updated_song.uri_metadata, updated_song.is_indexed);
  }

  /*
    Get all karaoke versions from the Superloud karaoke catalog
  */
  function getAllKaraokeVersions() public view onlyOwner returns (KaraokeVersion[] memory) {
    KaraokeVersion[] memory all_listed_songs = new KaraokeVersion[](_listed_karaoke_versions_ids.length);
    for (uint256 i; _listed_karaoke_versions_ids.length > i; i++) {
      all_listed_songs[i] = id_karaoke_version_to_listed_song[_listed_karaoke_versions_ids[i]];
    }
    return all_listed_songs;
  }

  /*
    Get all indexed (visible on the front-end) karaoke versions from the Superloud karaoke catalog
  */
  function getIndexedKaraokeVersions() public view returns (KaraokeVersion[] memory) {
    KaraokeVersion[] memory indexed_songs = new KaraokeVersion[](_indexed_listed_karaoke_versions_ids.length);
    for (uint256 i; _indexed_listed_karaoke_versions_ids.length > i; i++) {
      indexed_songs[i] = id_karaoke_version_to_listed_song[_indexed_listed_karaoke_versions_ids[i]];
    }
    return indexed_songs;
  }

  /*
    Get a curator's listed karaoke versions (curator & contract owner only)
  */
  function getKaraokeVersionsByCurator(address curator) public view returns (KaraokeVersion[] memory songs) {
    uint256 total_amount_songs_listed_by_curator = curator_address_to_songs[curator].length;

    // If the wallet address calling this function is the curator or the contract owner
    if (msg.sender == curator || msg.sender == owner()) {
      // Return all songs listed by this curator
      KaraokeVersion[] memory all_songs_listed_by_curator = new KaraokeVersion[](total_amount_songs_listed_by_curator);
      for (uint256 index; total_amount_songs_listed_by_curator > index; index++) {
        all_songs_listed_by_curator[index] = id_karaoke_version_to_listed_song[
          curator_address_to_songs[curator][index]
        ];
      }
      return all_songs_listed_by_curator;
    } else {
      // Otherwise, only return public (is_indexed = true) karaoke versions
      uint256 public_amount_songs_listed_by_curator;
      for (uint256 i; public_amount_songs_listed_by_curator > i; i++) {
        if (id_karaoke_version_to_listed_song[curator_address_to_songs[curator][i]].is_indexed == true) {
          public_amount_songs_listed_by_curator++;
        }
      }
      KaraokeVersion[] memory indexed_songs_listed_by_curator = new KaraokeVersion[](
        public_amount_songs_listed_by_curator
      );
      for (uint256 i; public_amount_songs_listed_by_curator > i; i++) {
        if (id_karaoke_version_to_listed_song[curator_address_to_songs[curator][i]].is_indexed == true) {
          indexed_songs_listed_by_curator[i] = id_karaoke_version_to_listed_song[curator_address_to_songs[curator][i]];
        }
      }
      return indexed_songs_listed_by_curator;
    }
  }

  /**
  Get a list of all karaoke versions for a given original version id
 */
  function getKaraokeVersionsForOriginalVersion(string memory id_original_version)
    public
    view
    returns (KaraokeVersion[] memory indexed_karaoke_versions)
  {
    bytes32[] memory karaoke_versions = id_original_version_to_karaoke_versions[id_original_version];
    uint256[] memory indexed_karaoke_version_indexes;

    uint256 counter = 0;
    for (uint256 i; karaoke_versions.length > i; i++) {
      if (id_karaoke_version_to_listed_song[karaoke_versions[i]].is_indexed == true) {
        indexed_karaoke_version_indexes[counter] = i;
        counter++;
      }
    }
    indexed_karaoke_versions = new KaraokeVersion[](indexed_karaoke_version_indexes.length);
    for (uint256 i; indexed_karaoke_version_indexes.length > i; i++) {
      indexed_karaoke_versions[i] = id_karaoke_version_to_listed_song[
        karaoke_versions[indexed_karaoke_version_indexes[i]]
      ];
    }
    return indexed_karaoke_versions;
  }

  /*
    Get a listed karaoke version by its id
  */
  function getKaraokeVersionById(bytes32 id)
    public
    view
    returns (
      bytes32 id_karaoke_version,
      uint256 created_at,
      address curator,
      string memory uri_metadata,
      bool is_indexed
    )
  {
    KaraokeVersion memory _song = id_karaoke_version_to_listed_song[id];
    return (id, _song.created_at, _song.curator, _song.uri_metadata, _song.is_indexed);
  }
}
