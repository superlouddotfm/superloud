// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "usingtellor/contracts/UsingTellor.sol";

contract SuperloudChallenge is UsingTellor {
  /**
  * - The challenge is created on chain and on Polybase
    - Submitting an entry and voting happens on Polybase
    - At the end of the challenge, the challengers, entries, voters and winner are reported via Tellor
    - Rewards are stored in 2 safes : 1 for the winner, 1 for the voters
  */
  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

  struct Challenge {
    bytes32 id_challenge;
    address creator;
    string content_uri;
    string slug_catalog_song;
    uint256 created_at;
    uint256 can_submit_entries_from;
    uint256 can_vote_from;
    uint256 ends_at;
    bool is_for_charity;
    bool will_reward_voters;
    address[] rewards; // [winner rewards safe address, voters rewards safe address]
    bool reported;
    bool exists;
  }

  mapping(address => bytes32[]) public owner_challenges;
  mapping(bytes32 => Challenge) public id_to_challenge;

  event newChallenge(
    bytes32 id,
    address creator,
    uint256 created_at,
    string content_uri,
    string slug_catalog_song,
    uint256 can_submit_entries_from,
    uint256 can_vote_from,
    uint256 ends_at,
    bool is_charity,
    bool will_reward_voters,
    address[] rewards,
  );

  function createChallenge(
    uint256 created_at,
    string memory content_uri,
    string memory slug_catalog_song,
    uint256 can_submit_entries_from,
    uint256 can_vote_from,
    uint256 ends_at,
    address[] memory rewards,
    bool is_charity,
    bool reward_voters,
    address winner // can be 0x00...
  ) external {
    bytes32 id = keccak256(
      abi.encodePacked(
        msg.sender,
        address(this),
        created_at,
        content_uri,
        slug_catalog_song,
        can_submit_entries_from,
        can_vote_from,
        ends_at,
        is_charity,
        rewards_voters,
      )
    );
    require(id_to_challenge[id].exists == false, 'Already exists');
    bytes32[] memory entries = new bytes32[](0);
    address[] memory challengers = new address[](0);
    address[] memory voters = new address[](0);

    id_to_challenge[id] = Challenge(
      id,
      msg.sender,
      content_uri,
      slug_catalog_song,
      created_at,
      can_submit_entries_from,
      can_vote_from,
      ends_at,
      is_charity,
      reward_voters,
      entries,
      challengers,
      voters,
      rewards,
      false,
      false
    );
    owner_challenges[msg.sender].push(id);
    emit newChallenge(
      id,
      msg.sender,
      created_at,
      content_uri,
      slug_catalog_song,
      can_submit_entries_from,
      can_vote_from,
      ends_at,
      is_charity,
      reward_voters,
      rewards,
    );
  }

  function reportResults(bytes32 idChallenge) public view returns(uint256) {
    require(id_to_challenge[id].exists == false, "Doesn't exist");
    require(id_to_challenge[id].reported == true, 'Results already reported');

    //make our queryData
    bytes memory queryData = abi.encode("SpotPrice", abi.encode("mkr", "usd"));

    //make our queryId
    bytes32 queryId = keccak256(queryData);

    //read our data
    (, bytes memory value ,) = getDataBefore(queryId, block.timestamp - 30 minutes);

  //parse the price
        uint256 price = abi.decode(value, (uint256));

        return price;
    }

}
