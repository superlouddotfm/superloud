# Superloud

> **Web3 powered karaoke & community interactions for song writers and musicians.**

## Description

Superloud helps connecting musicians and fans through a fun web3 karaoke platform.

On Superloud, artists can upload the lyrics video of their songs to our catalog, allowing fans to not only discover new artists and songs through karaoke, but also to easily share it with their friends and audience through a video of their karaoke session.

Artists can also create song challenges and set a reward for the best cover of their songs, giving fans the opportunity to showcase their talents and earn not only earn recognition, but also a prize.
Additionally, the artist can decide to either pick the winner themselves, or to let the audience vote for the best cover, connecting the artist’s fanbase to contestants’ communities, with voters themselves earning a share of the reward as well.

Finally, artists can use Superloud to help finance good causes by making their challenge a charity event, where the all the funds will be donated to a charity chosen by the winner.

## Monorepo structure

- `apps/webapp` - Superloud front-end (webapp - SolidStart, wagmi)
- `apps/smartcontracts-solidity/*` - Superloud solidity smart contracts (Catalog & Challenges)
- `apps/smartcontracts-warp/*` - Superloud Warp (Smartweave) smart contracts (Voting)
- `apps/subgraph-catalog` - Subgraph for the karaoke catalog
- `apps/subgraph-challenges` - Subgraph for the karaoke challenges

## Tech stack overview

- NFT Music, Artists & Playlist API: [Spinamp](https://dev.spinamp.xyz/)
- Song catalog & challenge smart contracts: Solidity
- Challenge entrance ticket & karaoke trial ticket: Unlock Protocol
- Voting smart contract: Smartweave
- Oracle: Chainlink
- Vote sybil resistance: Polygon ID
- Automated rewards distribution: Superfluid
- Cross-chain distribution: Connextq
- Subgraph:
- Social login: Arcana
- Storage: IPFS (infura-ipfs, w3ui)
- Video NFT & CDN: Livepeer

## Get started

### Pre-requisites

- `node` version `>=18.0.0`
- Get an Infura IPFS key
- **(recommended)** Create a wallet that will be only used to deploy the smart contracts

### Once you're set

- Install dependencies `pnpm install`
- Run the app `pnpm dev`

## Deployed contracts

- `SuperloudCatalog.sol` - Deployed on Mumbai: `0x49dD1c27100acDe5af60D5Bbd0a615c952bE2C5d` ; [view on Sourcify](https://repo.sourcify.dev/contracts/full_match/80001/0x49dD1c27100acDe5af60D5Bbd0a615c952bE2C5d/sources/project_/contracts/)
