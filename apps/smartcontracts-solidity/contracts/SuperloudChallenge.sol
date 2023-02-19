// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 - Superloud Challenges
 - List songs (by karaoke version id, by original version id, by curator...)
 - Index/unindex songs
*/

contract SuperloudChallenge {
  struct Challenge {
    bytes32 id_karaoke_version;
    uint256 created_at;
    string uri_challenge_metadata;
    address creator;
  }
}
